# TaskFlow API - Deployment Guide

This guide covers deploying TaskFlow API to various platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [Monitoring](#monitoring)

## Prerequisites

- Java 17+
- PostgreSQL 12+
- Firebase project with service account
- Docker (optional)

## Local Development

### 1. Database Setup

```bash
# Create database
createdb taskflow

# Or using psql
psql -U postgres
CREATE DATABASE taskflow;
\q
```

### 2. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Run Application

```bash
./mvnw spring-boot:run
```

## Docker Deployment

### Using Docker Compose (Recommended for Development)

```bash
# Set Firebase credentials
export FIREBASE_SERVICE_ACCOUNT_JSON="<base64_encoded_json>"

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t taskflow-api ./backend

# Run container
docker run -d \
  --name taskflow-api \
  -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/taskflow \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=your_password \
  -e FIREBASE_SERVICE_ACCOUNT_JSON=<base64_json> \
  -e CORS_ALLOWED_ORIGINS=https://yourdomain.com \
  taskflow-api
```

## Cloud Deployment

### Heroku

1. **Create Heroku App**

```bash
heroku create taskflow-api
```

2. **Add PostgreSQL**

```bash
heroku addons:create heroku-postgresql:mini
```

3. **Set Environment Variables**

```bash
heroku config:set FIREBASE_SERVICE_ACCOUNT_JSON="<base64_json>"
heroku config:set CORS_ALLOWED_ORIGINS="https://yourfrontend.com"
heroku config:set DDL_AUTO=validate
heroku config:set SPRING_PROFILES_ACTIVE=prod
```

4. **Deploy**

```bash
git push heroku main
```

### AWS Elastic Beanstalk

1. **Initialize EB**

```bash
eb init -p docker taskflow-api
```

2. **Create Environment**

```bash
eb create taskflow-prod
```

3. **Set Environment Variables**

```bash
eb setenv \
  FIREBASE_SERVICE_ACCOUNT_JSON="<base64_json>" \
  CORS_ALLOWED_ORIGINS="https://yourfrontend.com" \
  DDL_AUTO=validate \
  SPRING_PROFILES_ACTIVE=prod
```

4. **Deploy**

```bash
eb deploy
```

### Google Cloud Run

1. **Build and Push Image**

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/taskflow-api ./backend
```

2. **Deploy**

```bash
gcloud run deploy taskflow-api \
  --image gcr.io/PROJECT_ID/taskflow-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "FIREBASE_SERVICE_ACCOUNT_JSON=<base64_json>,CORS_ALLOWED_ORIGINS=https://yourfrontend.com,DDL_AUTO=validate"
```

### DigitalOcean App Platform

1. **Create `app.yaml`**

```yaml
name: taskflow-api
services:
  - name: api
    dockerfile_path: backend/Dockerfile
    source_dir: /
    github:
      repo: your-username/taskflow
      branch: main
    envs:
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
      - key: FIREBASE_SERVICE_ACCOUNT_JSON
        value: <base64_json>
        type: SECRET
      - key: CORS_ALLOWED_ORIGINS
        value: https://yourfrontend.com
      - key: DDL_AUTO
        value: validate
    http_port: 8080
databases:
  - name: db
    engine: PG
    version: "15"
```

2. **Deploy**

```bash
doctl apps create --spec app.yaml
```

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/taskflow
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=secure_password

# Firebase (choose one method)
FIREBASE_SERVICE_ACCOUNT_JSON=<base64_encoded_json>
# OR
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account.json

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Production-Specific Variables

```bash
# Hibernate
DDL_AUTO=validate  # NEVER use 'update' or 'create' in production

# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Logging
LOG_LEVEL=INFO
LOG_FILE_PATH=/var/log/taskflow/api.log

# Connection Pool
DB_POOL_SIZE=20
DB_MIN_IDLE=10
```

## Database Setup

### Production Database Initialization

1. **Create Database**

```sql
CREATE DATABASE taskflow;
CREATE USER taskflow_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE taskflow TO taskflow_user;
```

2. **Run Migrations**

For first deployment, use `DDL_AUTO=update` to create tables, then switch to `validate`:

```bash
# First deployment
DDL_AUTO=update java -jar app.jar

# After tables are created, switch to validate
DDL_AUTO=validate java -jar app.jar
```

3. **Backup Strategy**

```bash
# Automated daily backups
pg_dump -U taskflow_user taskflow > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U taskflow_user taskflow < backup_20240115.sql
```

## Monitoring

### Health Check Endpoint

```bash
curl http://localhost:8080/api/health
```

Response:
```json
{
  "status": "UP",
  "service": "TaskFlow API",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:45",
  "database": "UP"
}
```

### Application Logs

```bash
# Docker
docker logs -f taskflow-api

# Heroku
heroku logs --tail

# Local
tail -f logs/taskflow-api.log
```

### Metrics (Optional)

Add Spring Boot Actuator for detailed metrics:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Access metrics at: `http://localhost:8080/actuator/metrics`

## Security Checklist

- [ ] Use HTTPS/TLS in production
- [ ] Set `DDL_AUTO=validate` in production
- [ ] Use strong database passwords
- [ ] Restrict CORS to specific origins (no wildcards)
- [ ] Store Firebase credentials securely (environment variables)
- [ ] Enable database connection encryption
- [ ] Set up database backups
- [ ] Configure rate limiting (API Gateway/Load Balancer)
- [ ] Enable application logging and monitoring
- [ ] Use secrets management (AWS Secrets Manager, HashiCorp Vault)

## Troubleshooting

### Application Won't Start

1. Check database connectivity
2. Verify Firebase credentials
3. Review application logs
4. Ensure all required environment variables are set

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d taskflow

# Check if PostgreSQL is running
pg_isready -h localhost -p 5432
```

### Firebase Authentication Errors

1. Verify service account JSON is valid
2. Check Firebase project settings
3. Ensure token format is correct
4. Verify base64 encoding (if using that method)

## Rollback Strategy

### Docker

```bash
# Tag previous version
docker tag taskflow-api:latest taskflow-api:previous

# Rollback
docker stop taskflow-api
docker rm taskflow-api
docker run -d --name taskflow-api taskflow-api:previous
```

### Heroku

```bash
heroku releases
heroku rollback v123
```

### Kubernetes

```bash
kubectl rollout undo deployment/taskflow-api
```

## Performance Tuning

### JVM Options

```bash
java -Xms512m -Xmx2g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -jar app.jar
```

### Database Connection Pool

```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.connection-timeout=30000
```

### Caching (Optional)

Add Redis for caching:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review Firebase configuration
5. Check CORS settings
