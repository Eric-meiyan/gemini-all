#!/usr/bin/env node

/**
 * Performance Monitoring Script for Gemini CLI Hub
 * 
 * This script provides comprehensive performance monitoring capabilities
 * including web vitals tracking, API performance, and resource utilization.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class PerformanceMonitor {
  constructor(config = {}) {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
      endpoints: [
        '/',
        '/en/blog',
        '/en/tools',
        '/en/search',
        '/en/news',
        '/api/ping'
      ],
      metrics: {
        responseTime: true,
        memoryUsage: true,
        cpuUsage: true,
        loadTime: true
      },
      alerts: {
        responseTimeThreshold: 2000, // 2 seconds
        memoryThreshold: 80, // 80% memory usage
        cpuThreshold: 80 // 80% CPU usage
      },
      ...config
    };
    
    this.results = [];
    this.startTime = Date.now();
  }

  async checkEndpoint(endpoint) {
    const url = `${this.config.baseUrl}${endpoint}`;
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          resolve({
            endpoint,
            url,
            statusCode: response.statusCode,
            responseTime,
            contentLength: data.length,
            headers: response.headers,
            success: response.statusCode >= 200 && response.statusCode < 400
          });
        });
      });
      
      request.on('error', (error) => {
        resolve({
          endpoint,
          url,
          error: error.message,
          responseTime: Date.now() - startTime,
          success: false
        });
      });
      
      request.setTimeout(10000, () => {
        request.destroy();
        resolve({
          endpoint,
          url,
          error: 'Request timeout',
          responseTime: 10000,
          success: false
        });
      });
    });
  }

  getSystemMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
        percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: Math.round(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    };
  }

  async runPerformanceTests() {
    console.log('🚀 Starting Performance Monitoring...\n');
    
    // Test all endpoints
    console.log('📊 Testing Endpoints:');
    for (const endpoint of this.config.endpoints) {
      console.log(`  Testing ${endpoint}...`);
      const result = await this.checkEndpoint(endpoint);
      this.results.push(result);
      
      if (result.success) {
        const status = result.responseTime > this.config.alerts.responseTimeThreshold ? '⚠️' : '✅';
        console.log(`  ${status} ${endpoint}: ${result.responseTime}ms (${result.statusCode})`);
      } else {
        console.log(`  ❌ ${endpoint}: Failed - ${result.error}`);
      }
    }
    
    // System metrics
    console.log('\n🖥️  System Metrics:');
    const systemMetrics = this.getSystemMetrics();
    console.log(`  Memory Usage: ${systemMetrics.memory.heapUsed}MB / ${systemMetrics.memory.heapTotal}MB (${systemMetrics.memory.percentage}%)`);
    console.log(`  Process Uptime: ${systemMetrics.uptime}s`);
    console.log(`  Node.js Version: ${systemMetrics.nodeVersion}`);
    console.log(`  Platform: ${systemMetrics.platform} ${systemMetrics.arch}`);
    
    // Performance summary
    this.generateSummary(systemMetrics);
    
    // Save results
    await this.saveResults(systemMetrics);
    
    return {
      endpoints: this.results,
      system: systemMetrics,
      summary: this.getSummary()
    };
  }

  generateSummary(systemMetrics) {
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.length - successful;
    const avgResponseTime = this.results
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.responseTime, 0) / successful || 0;
    
    console.log('\n📈 Performance Summary:');
    console.log(`  Endpoints Tested: ${this.results.length}`);
    console.log(`  Successful: ${successful} ✅`);
    console.log(`  Failed: ${failed} ${failed > 0 ? '❌' : '✅'}`);
    console.log(`  Average Response Time: ${Math.round(avgResponseTime)}ms`);
    
    // Alerts
    const alerts = [];
    if (avgResponseTime > this.config.alerts.responseTimeThreshold) {
      alerts.push(`High response time: ${Math.round(avgResponseTime)}ms`);
    }
    if (systemMetrics.memory.percentage > this.config.alerts.memoryThreshold) {
      alerts.push(`High memory usage: ${systemMetrics.memory.percentage}%`);
    }
    
    if (alerts.length > 0) {
      console.log('\n⚠️  Alerts:');
      alerts.forEach(alert => console.log(`  - ${alert}`));
    } else {
      console.log('\n✅ All metrics within normal range');
    }
  }

  getSummary() {
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.length - successful;
    const avgResponseTime = this.results
      .filter(r => r.success)
      .reduce((sum, r) => sum + r.responseTime, 0) / successful || 0;
    
    return {
      total: this.results.length,
      successful,
      failed,
      successRate: Math.round((successful / this.results.length) * 100),
      averageResponseTime: Math.round(avgResponseTime),
      testDuration: Date.now() - this.startTime
    };
  }

  async saveResults(systemMetrics) {
    const timestamp = new Date().toISOString();
    const reportData = {
      timestamp,
      config: this.config,
      results: this.results,
      systemMetrics,
      summary: this.getSummary()
    };
    
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const filename = `performance-report-${timestamp.replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(reportsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(reportData, null, 2));
    console.log(`\n💾 Report saved: ${filepath}`);
    
    // Also save latest report
    const latestPath = path.join(reportsDir, 'latest-performance-report.json');
    fs.writeFileSync(latestPath, JSON.stringify(reportData, null, 2));
  }
}

// CLI execution
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  
  monitor.runPerformanceTests()
    .then((results) => {
      console.log('\n🎉 Performance monitoring completed!');
      process.exit(results.summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Performance monitoring failed:', error);
      process.exit(1);
    });
}

module.exports = PerformanceMonitor;