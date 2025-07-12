# Gemini CLI Hub - Production Deployment Guide

This guide provides comprehensive instructions for deploying Gemini CLI Hub to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Deployment Methods](#deployment-methods)
5. [SSL/TLS Configuration](#ssltls-configuration)
6. [Performance Optimization](#performance-optimization)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup Strategy](#backup-strategy)
9. [Security Hardening](#security-hardening)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Operating System**: Ubuntu 20.04+ / CentOS 8+ / Amazon Linux 2
- **Node.js**: 18.x or 20.x LTS
- **Memory**: Minimum 2GB RAM (4GB+ recommended)
- **Storage**: Minimum 20GB (SSD recommended)
- **CPU**: 2+ cores
- **Network**: Stable internet connection with adequate bandwidth

### Required Services

- **Database**: PostgreSQL 13+ or 14+ (recommended)
- **Reverse Proxy**: Nginx or Apache (recommended: Nginx)
- **Process Manager**: PM2 or systemd
- **SSL Certificate**: Let's Encrypt or commercial certificate

## Environment Setup

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc

# Install PM2 globally
npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

### 2. Application Deployment

```bash
# Clone repository
git clone https://github.com/your-org/gemini-cli-hub.git
cd gemini-cli-hub

# Install dependencies
pnpm install --frozen-lockfile

# Validate environment configuration
pnpm env:validate

# Build application
pnpm build

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Environment Configuration

### Required Environment Variables

Create `/var/www/gemini-cli-hub/.env.production`:

```bash
# === DATABASE CONFIGURATION ===
DATABASE_URL="postgresql://username:password@localhost:5432/geminicli_hub"

# === APPLICATION CONFIGURATION ===
NODE_ENV=production
NEXT_PUBLIC_WEB_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET="your-super-secure-secret-key-32-chars-min"

# === AUTHENTICATION PROVIDERS ===
# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# === AI PROVIDERS (optional) ===
OPENAI_API_KEY="sk-your-openai-key"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# === PAYMENT INTEGRATION (optional) ===
STRIPE_SECRET_KEY="sk_live_your-stripe-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-publishable"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# === COMMENTS SYSTEM ===
NEXT_PUBLIC_GISCUS_REPO="your-username/your-repo"
NEXT_PUBLIC_GISCUS_REPO_ID="R_your-repo-id"
NEXT_PUBLIC_GISCUS_CATEGORY_ID="DIC_your-category-id"

# === EMAIL CONFIGURATION (optional) ===
EMAIL_SERVER_HOST="smtp.your-provider.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-smtp-username"
EMAIL_SERVER_PASSWORD="your-smtp-password"
EMAIL_FROM="noreply@your-domain.com"

# === MONITORING (optional) ===
SENTRY_DSN="https://your-sentry-dsn"
ANALYTICS_ID="your-analytics-id"
```

### Environment Validation

```bash
# Validate configuration
pnpm env:validate

# Test database connection
pnpm db:push
```

## Database Configuration

### PostgreSQL Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE geminicli_hub;
CREATE USER geminicli_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE geminicli_hub TO geminicli_user;
ALTER USER geminicli_user CREATEDB;
\q

# Run database migrations
cd /var/www/gemini-cli-hub
pnpm db:migrate
```

### Database Optimization

```sql
-- PostgreSQL performance tuning (in postgresql.conf)
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

## Deployment Methods

### Method 1: Traditional Server Deployment

#### PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'gemini-cli-hub',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/gemini-cli-hub',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    error_file: '/var/log/gemini-cli-hub/error.log',
    out_file: '/var/log/gemini-cli-hub/out.log',
    log_file: '/var/log/gemini-cli-hub/combined.log',
    time: true
  }]
};
```

#### Nginx Configuration

Create `/etc/nginx/sites-available/gemini-cli-hub`:

```nginx
upstream nextjs_upstream {
    server 127.0.0.1:3000;
    # Add more servers for load balancing if needed
    # server 127.0.0.1:3001;
    # server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy strict-origin-when-cross-origin;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.giscus.app; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.githubusercontent.com; connect-src 'self' *.giscus.app; frame-src *.giscus.app;";

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Static file caching
    location /_next/static/ {
        alias /var/www/gemini-cli-hub/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /imgs/ {
        alias /var/www/gemini-cli-hub/public/imgs/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main application
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/gemini-cli-hub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Method 2: Docker Deployment

#### Dockerfile Optimization

```dockerfile
# Multi-stage build for production
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production stage
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose for Production

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/geminicli_hub
    depends_on:
      - db
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: geminicli_hub
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Method 3: Cloud Platform Deployment

#### Vercel Deployment

1. **Environment Variables**: Set all required environment variables in Vercel dashboard
2. **Database**: Use Vercel Postgres or external PostgreSQL service
3. **Domain**: Configure custom domain with SSL

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

#### AWS/GCP/Azure Deployment

- **AWS**: Use Elastic Beanstalk, ECS, or EC2 with RDS
- **GCP**: Use App Engine, Cloud Run, or Compute Engine with Cloud SQL
- **Azure**: Use App Service with Azure Database for PostgreSQL

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Setup auto-renewal cron job
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## Performance Optimization

### Application-Level Optimizations

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },
  compress: true,
  poweredByHeader: false,
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
```

### Database Optimization

```sql
-- Create indexes for better query performance
CREATE INDEX CONCURRENTLY idx_posts_published_date ON posts(created_at) WHERE status = 'published';
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_sessions_user_id ON sessions(user_id);

-- Analyze and vacuum regularly
ANALYZE;
VACUUM;
```

### CDN Configuration

Use a CDN like Cloudflare, AWS CloudFront, or similar:

1. **Static Assets**: Serve images, CSS, JS through CDN
2. **Cache Rules**: Set appropriate cache headers
3. **Image Optimization**: Use WebP/AVIF formats
4. **Minification**: Enable CSS/JS minification

## Monitoring & Logging

### Application Monitoring

```bash
# Install monitoring dependencies
pnpm add @sentry/nextjs @opentelemetry/api

# Configure Sentry (sentry.client.config.js)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

### Log Management

```bash
# Create log directory
sudo mkdir -p /var/log/gemini-cli-hub
sudo chown www-data:www-data /var/log/gemini-cli-hub

# Configure log rotation
sudo tee /etc/logrotate.d/gemini-cli-hub << EOF
/var/log/gemini-cli-hub/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload all
    endscript
}
EOF
```

### Health Checks

```bash
# Add health check endpoint monitoring
curl -f http://localhost:3000/api/ping || exit 1

# Database health check
psql $DATABASE_URL -c "SELECT 1;" || exit 1
```

## Backup Strategy

### Database Backups

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/var/backups/gemini-cli-hub"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="geminicli_hub"
DB_USER="geminicli_user"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $DB_USER -h localhost -d $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

```bash
# Make script executable and add to cron
chmod +x backup-db.sh
echo "0 2 * * * /path/to/backup-db.sh" | crontab -
```

### File System Backups

```bash
# Application files backup
rsync -av --exclude node_modules --exclude .next /var/www/gemini-cli-hub/ /backup/app/

# Environment files backup (encrypted)
gpg --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 \
    --s2k-digest-algo SHA512 --s2k-count 65536 --symmetric \
    --output /backup/env/.env.production.gpg /var/www/gemini-cli-hub/.env.production
```

## Security Hardening

### System Security

```bash
# Firewall configuration
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Fail2ban for SSH protection
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Regular security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Application Security

```bash
# Set proper file permissions
sudo chown -R www-data:www-data /var/www/gemini-cli-hub
sudo find /var/www/gemini-cli-hub -type f -exec chmod 644 {} \;
sudo find /var/www/gemini-cli-hub -type d -exec chmod 755 {} \;
sudo chmod 600 /var/www/gemini-cli-hub/.env.production
```

### Environment Security

- **API Keys**: Use environment variables, never commit to version control
- **Database**: Use strong passwords, enable SSL connections
- **Sessions**: Configure secure session storage
- **CORS**: Configure appropriate CORS policies
- **Rate Limiting**: Implement API rate limiting

## Troubleshooting

### Common Issues

#### 1. Application Won't Start

```bash
# Check logs
pm2 logs gemini-cli-hub

# Check environment variables
pnpm env:validate

# Check port availability
sudo netstat -tlnp | grep :3000
```

#### 2. Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check PostgreSQL status
sudo systemctl status postgresql

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### 3. SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Test SSL configuration
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Check Nginx configuration
sudo nginx -t
```

#### 4. Performance Issues

```bash
# Monitor system resources
htop
iotop
nethogs

# Check application performance
pnpm monitor:performance

# Analyze slow queries
sudo tail -f /var/log/postgresql/postgresql-14-main.log | grep "slow"
```

### Emergency Procedures

#### 1. Quick Rollback

```bash
# Stop current version
pm2 stop gemini-cli-hub

# Rollback to previous version
git checkout previous-stable-tag
pnpm install --frozen-lockfile
pnpm build

# Restart
pm2 restart gemini-cli-hub
```

#### 2. Database Recovery

```bash
# Restore from backup
gunzip /var/backups/gemini-cli-hub/db_backup_YYYYMMDD_HHMMSS.sql.gz
psql -U geminicli_user -d geminicli_hub < /var/backups/gemini-cli-hub/db_backup_YYYYMMDD_HHMMSS.sql
```

#### 3. Emergency Maintenance Mode

```nginx
# Add to Nginx configuration
location / {
    return 503;
}

error_page 503 @maintenance;
location @maintenance {
    rewrite ^(.*)$ /maintenance.html break;
}
```

## Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured and validated
- [ ] Database setup and migrations completed
- [ ] SSL certificates obtained and configured
- [ ] Domain DNS configured
- [ ] Backup procedures tested
- [ ] Monitoring and logging configured

### Deployment

- [ ] Application built successfully
- [ ] Static assets optimized
- [ ] PM2/Docker configuration verified
- [ ] Nginx configuration tested
- [ ] Health checks passing
- [ ] Performance tests completed

### Post-Deployment

- [ ] Application accessible via domain
- [ ] SSL certificate working
- [ ] Database connections verified
- [ ] Email functionality tested (if configured)
- [ ] Payment processing tested (if configured)
- [ ] Monitoring alerts configured
- [ ] Backup scripts scheduled

## Support and Maintenance

### Regular Maintenance Tasks

- **Daily**: Check application logs and system metrics
- **Weekly**: Review performance metrics and optimize if needed
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and test backup/recovery procedures

### Getting Help

- **Documentation**: Check this deployment guide and application README
- **Logs**: Always check application and system logs first
- **Community**: Join our Discord/Slack community for support
- **Issues**: Report bugs and feature requests on GitHub

---

**Last Updated**: December 2024  
**Version**: 1.0.0