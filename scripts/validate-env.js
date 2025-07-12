#!/usr/bin/env node

/**
 * Environment Configuration Validator for Gemini CLI Hub
 * 
 * This script validates all environment configurations and provides
 * recommendations for production deployment.
 */

const fs = require('fs');
const path = require('path');

class EnvironmentValidator {
  constructor() {
    this.results = {
      valid: [],
      invalid: [],
      missing: [],
      warnings: [],
      recommendations: []
    };
    
    this.requiredEnvVars = {
      // Database
      'DATABASE_URL': {
        required: true,
        description: 'PostgreSQL database connection string',
        example: 'postgresql://user:password@localhost:5432/geminicli_hub'
      },
      
      // NextAuth
      'NEXTAUTH_SECRET': {
        required: true,
        description: 'Secret key for NextAuth.js authentication',
        example: 'your-secret-key-here'
      },
      'NEXTAUTH_URL': {
        required: true,
        description: 'Base URL for NextAuth.js callbacks',
        example: 'https://your-domain.com'
      },
      
      // App Configuration
      'NEXT_PUBLIC_WEB_URL': {
        required: true,
        description: 'Public web URL for the application',
        example: 'https://geminicli.org'
      },
      
      // AI Providers
      'OPENAI_API_KEY': {
        required: false,
        description: 'OpenAI API key for AI features',
        example: 'sk-...'
      },
      'GOOGLE_GENERATIVE_AI_API_KEY': {
        required: false,
        description: 'Google Gemini API key',
        example: 'AIza...'
      },
      
      // Stripe (if payment enabled)
      'STRIPE_SECRET_KEY': {
        required: false,
        description: 'Stripe secret key for payments',
        example: 'sk_...'
      },
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': {
        required: false,
        description: 'Stripe publishable key',
        example: 'pk_...'
      },
      'STRIPE_WEBHOOK_SECRET': {
        required: false,
        description: 'Stripe webhook secret for payment verification',
        example: 'whsec_...'
      },
      
      // Comments (Giscus)
      'NEXT_PUBLIC_GISCUS_REPO': {
        required: false,
        description: 'GitHub repository for Giscus comments',
        example: 'username/repository'
      },
      'NEXT_PUBLIC_GISCUS_REPO_ID': {
        required: false,
        description: 'GitHub repository ID for Giscus',
        example: 'R_...'
      },
      'NEXT_PUBLIC_GISCUS_CATEGORY_ID': {
        required: false,
        description: 'GitHub discussion category ID for Giscus',
        example: 'DIC_...'
      },
      
      // Email (if enabled)
      'EMAIL_SERVER_HOST': {
        required: false,
        description: 'SMTP server host for email',
        example: 'smtp.gmail.com'
      },
      'EMAIL_SERVER_PORT': {
        required: false,
        description: 'SMTP server port',
        example: '587'
      },
      'EMAIL_SERVER_USER': {
        required: false,
        description: 'SMTP username',
        example: 'your-email@gmail.com'
      },
      'EMAIL_SERVER_PASSWORD': {
        required: false,
        description: 'SMTP password',
        example: 'your-app-password'
      },
      'EMAIL_FROM': {
        required: false,
        description: 'From email address',
        example: 'noreply@geminicli.org'
      }
    };
  }

  loadEnvironmentFiles() {
    const envFiles = [
      '.env.local',
      '.env.development',
      '.env.production',
      '.env'
    ];
    
    const envVars = {};
    
    for (const file of envFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        console.log(`📄 Loading ${file}...`);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            if (key && valueParts.length > 0) {
              envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            }
          }
        }
      }
    }
    
    // Also load from process.env
    Object.keys(process.env).forEach(key => {
      if (!envVars[key]) {
        envVars[key] = process.env[key];
      }
    });
    
    return envVars;
  }

  validateEnvironmentVariable(key, config, value) {
    if (!value) {
      if (config.required) {
        this.results.missing.push({
          key,
          description: config.description,
          example: config.example
        });
        return false;
      } else {
        this.results.warnings.push({
          key,
          message: `Optional environment variable not set: ${key}`,
          description: config.description
        });
        return true;
      }
    }
    
    // Validate specific formats
    if (key.includes('URL') && !this.isValidUrl(value)) {
      this.results.invalid.push({
        key,
        value: this.maskSensitive(key, value),
        issue: 'Invalid URL format'
      });
      return false;
    }
    
    if (key.includes('EMAIL') && key !== 'EMAIL_SERVER_PASSWORD' && !this.isValidEmail(value)) {
      this.results.invalid.push({
        key,
        value: this.maskSensitive(key, value),
        issue: 'Invalid email format'
      });
      return false;
    }
    
    if (key.includes('PORT') && !this.isValidPort(value)) {
      this.results.invalid.push({
        key,
        value: value,
        issue: 'Invalid port number'
      });
      return false;
    }
    
    // Check for security issues
    if (config.required && this.isWeakSecret(key, value)) {
      this.results.warnings.push({
        key,
        message: 'Weak secret detected - consider using a stronger value',
        recommendation: 'Use a cryptographically secure random string (32+ characters)'
      });
    }
    
    this.results.valid.push({
      key,
      status: 'OK',
      masked: this.maskSensitive(key, value)
    });
    
    return true;
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPort(port) {
    const num = parseInt(port, 10);
    return num > 0 && num <= 65535;
  }

  isWeakSecret(key, value) {
    if (!key.toLowerCase().includes('secret') && !key.toLowerCase().includes('key')) {
      return false;
    }
    
    return value.length < 32 || 
           value === 'your-secret-key-here' ||
           value === 'change-me' ||
           /^(test|dev|development|demo)/.test(value.toLowerCase());
  }

  maskSensitive(key, value) {
    const sensitiveKeys = ['secret', 'key', 'password', 'token'];
    const isSensitive = sensitiveKeys.some(sensitive => 
      key.toLowerCase().includes(sensitive)
    );
    
    if (isSensitive && value) {
      if (value.length <= 8) {
        return '*'.repeat(value.length);
      }
      return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
    }
    
    return value;
  }

  generateRecommendations() {
    // Database recommendations
    if (!process.env.DATABASE_URL) {
      this.results.recommendations.push({
        category: 'Database',
        recommendation: 'Set up PostgreSQL database and configure DATABASE_URL',
        priority: 'High',
        description: 'Database is required for user management, content storage, and application functionality'
      });
    }
    
    // Security recommendations
    if (!process.env.NEXTAUTH_SECRET || this.isWeakSecret('NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET)) {
      this.results.recommendations.push({
        category: 'Security',
        recommendation: 'Generate a strong NEXTAUTH_SECRET',
        priority: 'High',
        description: 'Use: openssl rand -base64 32'
      });
    }
    
    // Performance recommendations
    this.results.recommendations.push({
      category: 'Performance',
      recommendation: 'Configure caching with Redis',
      priority: 'Medium',
      description: 'Add REDIS_URL for improved performance and session storage'
    });
    
    // Monitoring recommendations
    this.results.recommendations.push({
      category: 'Monitoring',
      recommendation: 'Set up error tracking',
      priority: 'Medium',
      description: 'Configure Sentry or similar service for error monitoring'
    });
    
    // Backup recommendations
    this.results.recommendations.push({
      category: 'Backup',
      recommendation: 'Configure automated database backups',
      priority: 'High',
      description: 'Set up regular backups of PostgreSQL database'
    });
  }

  generateConfigTemplate() {
    const template = [
      '# Gemini CLI Hub Environment Configuration',
      '# Copy this file to .env.local and fill in your values',
      '',
      '# === REQUIRED CONFIGURATION ===',
      ''
    ];
    
    Object.entries(this.requiredEnvVars).forEach(([key, config]) => {
      if (config.required) {
        template.push(`# ${config.description}`);
        template.push(`${key}=${config.example}`);
        template.push('');
      }
    });
    
    template.push('# === OPTIONAL CONFIGURATION ===');
    template.push('');
    
    Object.entries(this.requiredEnvVars).forEach(([key, config]) => {
      if (!config.required) {
        template.push(`# ${config.description}`);
        template.push(`# ${key}=${config.example}`);
        template.push('');
      }
    });
    
    return template.join('\n');
  }

  async validate() {
    console.log('🔍 Validating Environment Configuration...\n');
    
    const envVars = this.loadEnvironmentFiles();
    
    console.log('📋 Checking Environment Variables:\n');
    
    Object.entries(this.requiredEnvVars).forEach(([key, config]) => {
      const value = envVars[key];
      this.validateEnvironmentVariable(key, config, value);
    });
    
    this.generateRecommendations();
    
    // Print results
    this.printResults();
    
    // Save report
    await this.saveReport();
    
    // Generate template if needed
    if (this.results.missing.length > 0) {
      this.saveConfigTemplate();
    }
    
    const hasErrors = this.results.invalid.length > 0 || this.results.missing.length > 0;
    return !hasErrors;
  }

  printResults() {
    console.log('📊 Validation Results:\n');
    
    if (this.results.valid.length > 0) {
      console.log('✅ Valid Configuration:');
      this.results.valid.forEach(item => {
        console.log(`  ${item.key}: ${item.masked || 'OK'}`);
      });
      console.log('');
    }
    
    if (this.results.invalid.length > 0) {
      console.log('❌ Invalid Configuration:');
      this.results.invalid.forEach(item => {
        console.log(`  ${item.key}: ${item.issue} (${item.value})`);
      });
      console.log('');
    }
    
    if (this.results.missing.length > 0) {
      console.log('🚫 Missing Required Configuration:');
      this.results.missing.forEach(item => {
        console.log(`  ${item.key}: ${item.description}`);
        console.log(`    Example: ${item.example}`);
      });
      console.log('');
    }
    
    if (this.results.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.results.warnings.forEach(item => {
        console.log(`  ${item.key}: ${item.message}`);
      });
      console.log('');
    }
    
    if (this.results.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      this.results.recommendations.forEach(item => {
        console.log(`  [${item.priority}] ${item.category}: ${item.recommendation}`);
        if (item.description) {
          console.log(`    ${item.description}`);
        }
      });
      console.log('');
    }
    
    const totalChecked = this.results.valid.length + this.results.invalid.length + this.results.missing.length;
    const successRate = Math.round((this.results.valid.length / totalChecked) * 100);
    
    console.log('📈 Summary:');
    console.log(`  Total Checked: ${totalChecked}`);
    console.log(`  Valid: ${this.results.valid.length} ✅`);
    console.log(`  Invalid: ${this.results.invalid.length} ❌`);
    console.log(`  Missing: ${this.results.missing.length} 🚫`);
    console.log(`  Success Rate: ${successRate}%`);
  }

  async saveReport() {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      results: this.results,
      summary: {
        total: this.results.valid.length + this.results.invalid.length + this.results.missing.length,
        valid: this.results.valid.length,
        invalid: this.results.invalid.length,
        missing: this.results.missing.length,
        warnings: this.results.warnings.length
      }
    };
    
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const filename = `env-validation-${timestamp.replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(reportsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`💾 Report saved: ${filepath}`);
  }

  saveConfigTemplate() {
    const template = this.generateConfigTemplate();
    const templatePath = path.join(__dirname, '../.env.template');
    
    fs.writeFileSync(templatePath, template);
    console.log(`📝 Configuration template saved: ${templatePath}`);
    console.log('   Copy this file to .env.local and fill in your values');
  }
}

// CLI execution
if (require.main === module) {
  const validator = new EnvironmentValidator();
  
  validator.validate()
    .then((isValid) => {
      if (isValid) {
        console.log('🎉 Environment validation completed successfully!');
        process.exit(0);
      } else {
        console.log('❌ Environment validation failed. Please fix the issues above.');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Environment validation error:', error);
      process.exit(1);
    });
}

module.exports = EnvironmentValidator;