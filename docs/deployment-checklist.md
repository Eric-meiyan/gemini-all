# Gemini CLI Hub - Production Deployment Checklist

## Pre-Deployment Checklist ✅

### Environment Preparation
- [ ] **Server Setup**
  - [ ] Ubuntu 20.04+ / CentOS 8+ / Amazon Linux 2 installed
  - [ ] Node.js 18.x or 20.x LTS installed
  - [ ] pnpm package manager installed
  - [ ] PM2 process manager installed
  - [ ] Nginx web server installed
  - [ ] PostgreSQL 13+ database installed
  - [ ] Server has minimum 2GB RAM (4GB+ recommended)
  - [ ] Server has minimum 20GB storage (SSD recommended)
  - [ ] Firewall configured (ports 80, 443, 22 open)

### Domain and SSL
- [ ] **Domain Configuration**
  - [ ] Domain purchased and configured
  - [ ] DNS A/AAAA records pointing to server IP
  - [ ] Subdomain configuration (if needed)
  - [ ] DNS propagation completed (check with `nslookup`)

- [ ] **SSL Certificate**
  - [ ] Let's Encrypt certificate obtained
  - [ ] Certificate auto-renewal configured
  - [ ] SSL/TLS test passed (SSLLabs.com grade A)
  - [ ] HTTPS redirect configured

### Database Setup
- [ ] **PostgreSQL Configuration**
  - [ ] Database `geminicli_hub` created
  - [ ] Database user created with proper permissions
  - [ ] Database connection tested
  - [ ] Performance tuning applied
  - [ ] Backup user and procedures configured
  - [ ] Connection pooling configured (if needed)

### Environment Variables
- [ ] **Required Variables Set**
  - [ ] `DATABASE_URL` - PostgreSQL connection string
  - [ ] `NEXTAUTH_SECRET` - Strong secret (32+ characters)
  - [ ] `NEXTAUTH_URL` - Production domain URL
  - [ ] `NEXT_PUBLIC_WEB_URL` - Public web URL
  - [ ] `NODE_ENV=production`

- [ ] **Optional Variables Configured (as needed)**
  - [ ] `OPENAI_API_KEY` - OpenAI API access
  - [ ] `GOOGLE_GENERATIVE_AI_API_KEY` - Google Gemini API
  - [ ] `STRIPE_SECRET_KEY` - Payment processing
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe frontend
  - [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhooks
  - [ ] `NEXT_PUBLIC_GISCUS_REPO` - Comments system
  - [ ] `NEXT_PUBLIC_GISCUS_REPO_ID` - Giscus repository
  - [ ] `NEXT_PUBLIC_GISCUS_CATEGORY_ID` - Giscus category
  - [ ] Email SMTP configuration (if email features enabled)

- [ ] **Environment Validation**
  - [ ] Run `pnpm env:validate` successfully
  - [ ] No missing required variables
  - [ ] No weak secrets detected
  - [ ] All URLs and email formats valid

### Security Configuration
- [ ] **System Security**
  - [ ] UFW firewall enabled and configured
  - [ ] Fail2ban installed for SSH protection
  - [ ] Unattended security updates configured
  - [ ] SSH key-based authentication (disable password auth)
  - [ ] Non-root user for application deployment

- [ ] **Application Security**
  - [ ] Strong database passwords
  - [ ] Secure file permissions (644 for files, 755 for directories)
  - [ ] Environment files protected (600 permissions)
  - [ ] API rate limiting configured
  - [ ] Security headers configured in Nginx

## Deployment Checklist ✅

### Code Preparation
- [ ] **Source Code**
  - [ ] Latest stable code pulled from repository
  - [ ] Dependencies installed with `pnpm install --frozen-lockfile`
  - [ ] Application builds successfully with `pnpm build`
  - [ ] No TypeScript errors or linting issues
  - [ ] Database migrations ready

### Application Deployment
- [ ] **File Deployment**
  - [ ] Application files copied to `/var/www/gemini-cli-hub/`
  - [ ] Proper ownership set (`chown -R www-data:www-data`)
  - [ ] Environment file `.env.production` created and secured
  - [ ] Log directory created (`/var/log/gemini-cli-hub/`)

- [ ] **Database Migration**
  - [ ] Database migrations executed with `pnpm db:migrate`
  - [ ] Database schema verified
  - [ ] Sample data loaded (if applicable)
  - [ ] Database backup created before migration

- [ ] **Process Management**
  - [ ] PM2 ecosystem configuration created
  - [ ] Application started with PM2
  - [ ] PM2 startup script configured
  - [ ] PM2 process monitoring enabled

### Web Server Configuration
- [ ] **Nginx Setup**
  - [ ] Nginx configuration file created
  - [ ] SSL configuration added
  - [ ] Gzip compression enabled
  - [ ] Static file caching configured
  - [ ] API rate limiting configured
  - [ ] Security headers added
  - [ ] Nginx configuration tested (`nginx -t`)
  - [ ] Nginx reloaded with new configuration

### Testing and Verification
- [ ] **Application Testing**
  - [ ] Application accessible via domain
  - [ ] HTTPS working correctly
  - [ ] All main pages loading (Home, Blog, Tools, Search, News)
  - [ ] API endpoints responding correctly
  - [ ] Database connections working
  - [ ] User authentication functioning (if enabled)

- [ ] **Performance Testing**
  - [ ] Run `pnpm monitor:performance` successfully
  - [ ] Page load times under 2 seconds
  - [ ] All health checks passing
  - [ ] No memory leaks detected
  - [ ] Resource usage within acceptable limits

## Post-Deployment Checklist ✅

### Monitoring and Logging
- [ ] **Log Management**
  - [ ] Application logs writing to correct location
  - [ ] Log rotation configured
  - [ ] Error tracking setup (Sentry, if configured)
  - [ ] Access logs monitoring enabled

- [ ] **System Monitoring**
  - [ ] Server resource monitoring setup
  - [ ] Database performance monitoring
  - [ ] Application uptime monitoring
  - [ ] SSL certificate expiry monitoring

### Backup and Recovery
- [ ] **Backup Systems**
  - [ ] Database backup script created and tested
  - [ ] Backup schedule configured (daily recommended)
  - [ ] Backup retention policy implemented
  - [ ] Application files backup configured
  - [ ] Recovery procedures documented and tested

- [ ] **Disaster Recovery**
  - [ ] Emergency rollback procedure documented
  - [ ] Database recovery procedure tested
  - [ ] Maintenance mode configuration ready
  - [ ] Contact information for emergency support

### Security Verification
- [ ] **Security Audit**
  - [ ] SSL/TLS configuration tested (A grade on SSL Labs)
  - [ ] Security headers verified
  - [ ] No sensitive information exposed in logs
  - [ ] API endpoints properly secured
  - [ ] Database access restricted to application only

### Performance Optimization
- [ ] **CDN Configuration (if applicable)**
  - [ ] Static assets served via CDN
  - [ ] Image optimization enabled
  - [ ] Cache headers configured
  - [ ] DNS prefetching configured

- [ ] **Database Optimization**
  - [ ] Indexes created for frequently queried fields
  - [ ] Query performance analyzed
  - [ ] Connection pooling configured (if high traffic)

### Documentation and Handover
- [ ] **Documentation Updated**
  - [ ] Deployment details documented
  - [ ] Admin credentials securely stored
  - [ ] Backup procedures documented
  - [ ] Troubleshooting guide updated
  - [ ] Emergency contact information provided

## Maintenance Schedule 📅

### Daily Tasks
- [ ] Check application logs for errors
- [ ] Monitor system resource usage
- [ ] Verify backup completion
- [ ] Check SSL certificate status

### Weekly Tasks
- [ ] Review performance metrics
- [ ] Analyze security logs
- [ ] Check for security updates
- [ ] Monitor database performance

### Monthly Tasks
- [ ] Update dependencies (patch versions)
- [ ] Review and clean up logs
- [ ] Test backup recovery procedures
- [ ] Security audit and review

### Quarterly Tasks
- [ ] Major dependency updates
- [ ] Full security audit
- [ ] Disaster recovery test
- [ ] Performance optimization review

## Emergency Contacts 🚨

### Technical Issues
- **System Administrator**: [contact information]
- **Database Administrator**: [contact information]
- **DevOps Team**: [contact information]

### Service Providers
- **Domain Registrar**: [contact information]
- **Hosting Provider**: [contact information]
- **CDN Provider**: [contact information]
- **Email Service**: [contact information]

## Common Commands Quick Reference 🛠️

```bash
# Application Management
pm2 status                          # Check application status
pm2 logs gemini-cli-hub             # View application logs
pm2 restart gemini-cli-hub          # Restart application
pm2 reload gemini-cli-hub           # Reload application (zero downtime)

# Database Management
pnpm db:migrate                     # Run database migrations
pnpm db:studio                      # Open database management interface
pg_dump -U user -d db > backup.sql  # Create database backup

# Environment and Monitoring
pnpm env:validate                   # Validate environment configuration
pnpm monitor:performance           # Run performance monitoring
systemctl status nginx             # Check Nginx status
systemctl status postgresql        # Check database status

# SSL Certificate Management
certbot certificates               # List certificates
certbot renew                     # Renew certificates
certbot renew --dry-run          # Test certificate renewal

# Log Management
tail -f /var/log/gemini-cli-hub/error.log    # View real-time error logs
tail -f /var/log/nginx/access.log           # View Nginx access logs
journalctl -u nginx -f                      # View Nginx system logs
```

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Version**: _______________  
**Environment**: Production  

**Sign-off**:
- [ ] Technical Lead: _______________
- [ ] DevOps Engineer: _______________
- [ ] Project Manager: _______________