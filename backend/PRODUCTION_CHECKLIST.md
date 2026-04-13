# Production Deployment Checklist

Use this checklist before deploying TaskFlow API to production.

## Pre-Deployment

### Database Setup
- [ ] PostgreSQL database created
- [ ] Database user created with appropriate permissions
- [ ] Database accessible from application server
- [ ] Connection tested: `psql -h <host> -U <user> -d taskflow`
- [ ] Database backups configured
- [ ] Connection encryption enabled (SSL/TLS)

### Environment Variables
- [ ] `DATABASE_URL` set correctly
- [ ] `DATABASE_USERNAME` set
- [ ] `DATABASE_PASSWORD` set (strong password)
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` set (base64-encoded)
- [ ] `CORS_ALLOWED_ORIGINS` set to production domain(s)
- [ ] `DDL_AUTO=validate` (CRITICAL - never use 'update' in production)
- [ ] `SPRING_PROFILES_ACTIVE=prod`
- [ ] `LOG_LEVEL=INFO` or `WARN`

### Firebase Configuration
- [ ] Firebase project created
- [ ] Service account JSON downloaded
- [ ] Service account JSON encoded to base64
- [ ] Firebase credentials tested locally
- [ ] Firebase authentication enabled in console

### Security
- [ ] No secrets in source code
- [ ] No secrets in version control
- [ ] `.gitignore` includes all sensitive files
- [ ] CORS origins restricted (no wildcards)
- [ ] Strong database password (16+ characters)
- [ ] HTTPS/TLS enabled
- [ ] Security headers configured (if using reverse proxy)

### Build & Test
- [ ] `mvn clean install` runs successfully
- [ ] All tests pass: `mvn test`
- [ ] Application starts locally with production config
- [ ] Health endpoint returns UP: `curl /api/health`
- [ ] Database connectivity verified in health check
- [ ] API endpoints tested with Postman/curl
- [ ] Firebase authentication tested

### Code Quality
- [ ] No TODO or FIXME comments in critical code
- [ ] No debug logging in production code
- [ ] No unused imports or dead code
- [ ] Constructor-based dependency injection used
- [ ] Proper exception handling in all services

## Deployment

### Infrastructure
- [ ] Application server provisioned
- [ ] Database server provisioned (or managed service)
- [ ] Load balancer configured (if applicable)
- [ ] CDN configured (if applicable)
- [ ] DNS records configured
- [ ] SSL/TLS certificates installed

### Application Deployment
- [ ] JAR file built: `mvn clean package`
- [ ] JAR file uploaded to server
- [ ] Environment variables set on server
- [ ] Application started successfully
- [ ] Health check endpoint accessible
- [ ] Logs being written correctly
- [ ] Application accessible via domain

### Database Migration
- [ ] Database schema created (first deployment only)
- [ ] Migration scripts prepared (if using Flyway/Liquibase)
- [ ] Backup taken before migration
- [ ] Migration executed successfully
- [ ] Data integrity verified

## Post-Deployment

### Verification
- [ ] Health endpoint returns UP: `https://yourdomain.com/api/health`
- [ ] Database status shows UP in health check
- [ ] API endpoints accessible
- [ ] Firebase authentication working
- [ ] CORS working from frontend
- [ ] Error responses formatted correctly
- [ ] Swagger UI accessible (if enabled): `/swagger-ui.html`

### Monitoring
- [ ] Application logs accessible
- [ ] Log aggregation configured (CloudWatch, Datadog, etc.)
- [ ] Health check monitoring configured
- [ ] Uptime monitoring configured (Pingdom, UptimeRobot, etc.)
- [ ] Error alerting configured
- [ ] Performance monitoring configured (APM)

### Performance
- [ ] Response times acceptable (<500ms for most endpoints)
- [ ] Database connection pool sized appropriately
- [ ] Memory usage within limits
- [ ] CPU usage within limits
- [ ] No memory leaks detected

### Security Scan
- [ ] Dependency vulnerability scan: `mvn dependency-check:check`
- [ ] No critical vulnerabilities found
- [ ] Security headers verified
- [ ] HTTPS enforced
- [ ] CORS policy verified

## Ongoing Maintenance

### Daily
- [ ] Check application logs for errors
- [ ] Monitor health check endpoint
- [ ] Review error rates

### Weekly
- [ ] Review application performance metrics
- [ ] Check database performance
- [ ] Review security logs
- [ ] Verify backups are running

### Monthly
- [ ] Update dependencies: `mvn versions:display-dependency-updates`
- [ ] Review and rotate credentials
- [ ] Review and optimize database queries
- [ ] Review application logs for patterns

### Quarterly
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Disaster recovery test
- [ ] Update documentation

## Rollback Plan

### Preparation
- [ ] Previous version JAR backed up
- [ ] Database backup taken before deployment
- [ ] Rollback procedure documented
- [ ] Rollback tested in staging

### If Issues Occur
1. [ ] Stop current application
2. [ ] Restore previous JAR version
3. [ ] Restore database backup (if schema changed)
4. [ ] Restart application
5. [ ] Verify health check
6. [ ] Notify team

## Emergency Contacts

Document your emergency contacts:

- **DevOps Lead**: [Name] - [Contact]
- **Database Admin**: [Name] - [Contact]
- **Security Team**: [Name] - [Contact]
- **On-Call Engineer**: [Name] - [Contact]

## Useful Commands

### Check Application Status
```bash
# Health check
curl https://yourdomain.com/api/health

# View logs (Docker)
docker logs -f taskflow-backend

# View logs (systemd)
journalctl -u taskflow-api -f

# View logs (file)
tail -f /var/log/taskflow/api.log
```

### Database Operations
```bash
# Connect to database
psql -h <host> -U <user> -d taskflow

# Check connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'taskflow';

# Backup database
pg_dump -h <host> -U <user> taskflow > backup_$(date +%Y%m%d).sql

# Restore database
psql -h <host> -U <user> taskflow < backup_20240115.sql
```

### Application Management
```bash
# Start application (systemd)
sudo systemctl start taskflow-api

# Stop application
sudo systemctl stop taskflow-api

# Restart application
sudo systemctl restart taskflow-api

# View status
sudo systemctl status taskflow-api

# Start application (Docker)
docker-compose up -d backend

# Stop application
docker-compose stop backend

# Restart application
docker-compose restart backend
```

## Documentation References

- **Setup Guide**: `backend/README.md`
- **Deployment Guide**: `backend/DEPLOYMENT.md`
- **Environment Variables**: `backend/ENV_VARIABLES.md`
- **Change Log**: `backend/CHANGES.md`
- **API Documentation**: `https://yourdomain.com/swagger-ui.html`

## Sign-Off

### Deployment Team

- [ ] **Developer**: _________________ Date: _______
- [ ] **DevOps**: _________________ Date: _______
- [ ] **QA**: _________________ Date: _______
- [ ] **Security**: _________________ Date: _______
- [ ] **Manager**: _________________ Date: _______

### Deployment Details

- **Version**: 1.0.0
- **Date**: _________________
- **Environment**: Production
- **Deployed By**: _________________
- **Deployment Method**: _________________
- **Rollback Plan Verified**: Yes / No

---

**Note**: This checklist should be completed for every production deployment. Keep a copy of completed checklists for audit purposes.
