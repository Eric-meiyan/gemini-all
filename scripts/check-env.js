#!/usr/bin/env node

/**
 * 环境配置验证脚本
 * 检查必需的环境变量是否已正确设置
 */

const path = require('path');
const fs = require('fs');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local 文件不存在', 'red');
    log('💡 请复制 .env.example 为 .env.local 并填入配置值', 'yellow');
    return false;
  }
  log('✅ .env.local 文件存在', 'green');
  return true;
}

function checkRequiredEnvVars() {
  log('\n🔍 检查必需的环境变量...', 'blue');
  
  const requiredVars = [
    {
      name: 'NEXT_PUBLIC_WEB_URL',
      description: '网站基础 URL',
      required: true
    },
    {
      name: 'DATABASE_URL',
      description: 'PostgreSQL 数据库连接字符串',
      required: true
    },
    {
      name: 'NEXTAUTH_SECRET',
      description: 'NextAuth.js 认证密钥',
      required: true
    },
    {
      name: 'NEXTAUTH_URL',
      description: 'NextAuth.js 基础 URL',
      required: true
    }
  ];

  const optionalVars = [
    {
      name: 'GITHUB_CLIENT_ID',
      description: 'GitHub OAuth 客户端 ID',
      required: false
    },
    {
      name: 'GITHUB_CLIENT_SECRET',
      description: 'GitHub OAuth 客户端密钥',
      required: false
    },
    {
      name: 'NEXT_PUBLIC_GISCUS_REPO',
      description: 'Giscus 评论系统仓库',
      required: false
    },
    {
      name: 'NEXT_PUBLIC_GISCUS_REPO_ID',
      description: 'Giscus 仓库 ID',
      required: false
    },
    {
      name: 'NEXT_PUBLIC_GISCUS_CATEGORY_ID',
      description: 'Giscus 分类 ID',
      required: false
    }
  ];

  let allRequired = true;
  let hasOptional = 0;

  // 检查必需变量
  log('\n必需的环境变量:', 'bold');
  requiredVars.forEach(variable => {
    const value = process.env[variable.name];
    if (!value || value.trim() === '' || value === 'your-super-secret-key-here') {
      log(`❌ ${variable.name}: ${variable.description}`, 'red');
      allRequired = false;
    } else {
      log(`✅ ${variable.name}: ${variable.description}`, 'green');
    }
  });

  // 检查可选变量
  log('\n可选的环境变量:', 'bold');
  optionalVars.forEach(variable => {
    const value = process.env[variable.name];
    if (!value || value.trim() === '') {
      log(`⚪ ${variable.name}: ${variable.description} (未设置)`, 'yellow');
    } else {
      log(`✅ ${variable.name}: ${variable.description}`, 'green');
      hasOptional++;
    }
  });

  return { allRequired, hasOptional, totalOptional: optionalVars.length };
}

function checkGiscusConfig() {
  log('\n💬 检查 Giscus 评论系统配置...', 'blue');
  
  const giscusVars = [
    'NEXT_PUBLIC_GISCUS_REPO',
    'NEXT_PUBLIC_GISCUS_REPO_ID', 
    'NEXT_PUBLIC_GISCUS_CATEGORY_ID'
  ];

  const configuredVars = giscusVars.filter(varName => {
    const value = process.env[varName];
    return value && value.trim() !== '' && !value.includes('xxxxxxx');
  });

  if (configuredVars.length === 0) {
    log('⚠️  Giscus 评论系统未配置', 'yellow');
    log('💡 评论功能将显示配置提示信息', 'yellow');
    log('📖 配置指南: docs/environment-setup.md', 'blue');
    return false;
  } else if (configuredVars.length === giscusVars.length) {
    log('✅ Giscus 评论系统配置完整', 'green');
    return true;
  } else {
    log('⚠️  Giscus 评论系统配置不完整', 'yellow');
    log(`已配置: ${configuredVars.length}/${giscusVars.length}`, 'yellow');
    return false;
  }
}

function generateConfigSummary(results) {
  log('\n📊 配置摘要:', 'blue');
  log('================', 'blue');
  
  if (results.allRequired) {
    log('✅ 所有必需的配置已设置', 'green');
  } else {
    log('❌ 缺少必需的配置项', 'red');
  }
  
  log(`📋 可选配置: ${results.hasOptional}/${results.totalOptional} 已设置`, 
      results.hasOptional > 0 ? 'green' : 'yellow');
  
  const readiness = results.allRequired ? '🚀 准备就绪' : '⚠️  需要配置';
  log(`🎯 部署状态: ${readiness}`, results.allRequired ? 'green' : 'yellow');
}

function main() {
  log('🔧 Gemini CLI Hub 环境配置检查器', 'bold');
  log('=====================================', 'blue');
  
  // 加载环境变量
  require('dotenv').config({ path: '.env.local' });
  
  // 检查 .env.local 文件
  if (!checkEnvFile()) {
    process.exit(1);
  }
  
  // 检查环境变量
  const results = checkRequiredEnvVars();
  
  // 检查 Giscus 配置
  const giscusConfigured = checkGiscusConfig();
  
  // 生成摘要
  generateConfigSummary(results);
  
  // 提供帮助信息
  if (!results.allRequired) {
    log('\n🆘 需要帮助?', 'yellow');
    log('📖 查看详细配置指南: docs/environment-setup.md', 'blue');
    log('📝 参考模板文件: .env.example', 'blue');
    process.exit(1);
  }
  
  if (!giscusConfigured) {
    log('\n💡 可选改进:', 'yellow');
    log('🗨️  配置 Giscus 评论系统以启用用户讨论功能', 'yellow');
  }
  
  log('\n🎉 配置检查完成!', 'green');
}

// 检查是否安装了 dotenv
try {
  require.resolve('dotenv');
} catch (e) {
  log('❌ 缺少 dotenv 依赖', 'red');
  log('💡 请运行: npm install dotenv', 'yellow');
  process.exit(1);
}

main();