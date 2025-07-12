# Production Deployment Scripts

This directory contains automated scripts for production deployment of Gemini CLI Hub.

## Scripts Overview

### Environment Management
- `validate-env.js` - Validates all environment variables and configuration
- `monitor-performance.js` - Comprehensive performance monitoring and reporting

### Deployment Automation
- `deploy-production.sh` - Automated production deployment script
- `backup-database.sh` - Database backup automation
- `setup-server.sh` - Initial server setup and configuration

## Usage

### Environment Validation
```bash
# Validate current environment configuration
pnpm env:validate

# This will check:
# - Required environment variables
# - Configuration format validation
# - Security recommendations
# - Generate configuration template if needed
```

### Performance Monitoring
```bash
# Run comprehensive performance monitoring
pnpm monitor:performance

# This will test:
# - Endpoint response times
# - System resource usage
# - Memory and CPU metrics
# - Generate performance reports
```

### Production Deployment
```bash
# Full automated deployment
./scripts/deploy-production.sh

# This will:
# - Pull latest code
# - Install dependencies
# - Build application
# - Run migrations
# - Restart services
# - Verify deployment
```

### Database Backup
```bash
# Create database backup
./scripts/backup-database.sh

# This will:
# - Create compressed database dump
# - Store with timestamp
# - Clean old backups
# - Verify backup integrity
```

## Security Notes

- All scripts use environment variables for sensitive data
- Database backups are compressed and can be encrypted
- Environment validation masks sensitive values in output
- Performance monitoring excludes sensitive headers

## Customization

Each script can be customized by modifying the configuration section at the top of the file. Common customizations include:

- Backup retention periods
- Performance monitoring thresholds
- Deployment hooks and notifications
- Alert thresholds and recipients

## Monitoring Integration

Scripts generate JSON reports that can be integrated with monitoring systems:

- **Environment Reports**: `reports/env-validation-*.json`
- **Performance Reports**: `reports/performance-report-*.json`
- **Deployment Logs**: `logs/deployment-*.log`

## Troubleshooting

If scripts fail:

1. Check script permissions: `chmod +x scripts/*.sh`
2. Verify environment variables: `pnpm env:validate`
3. Check log files in `logs/` directory
4. Ensure required dependencies are installed

For detailed troubleshooting, see the main deployment documentation.