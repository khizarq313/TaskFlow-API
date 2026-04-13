# Environment Variables Reference

Quick reference for all environment variables used in TaskFlow API.

## Required Variables

These MUST be set for the application to run:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL JDBC connection URL | `jdbc:postgresql://localhost:5432/taskflow` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `your_secure_password` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Base64-encoded Firebase service account JSON | `eyJ0eXBlIjoic2VydmljZV9hY2NvdW50...` |

**Note**: For Firebase, you only need ONE of these three:
- `FIREBASE_SERVICE_ACCOUNT_JSON` (recommended for production)
- `FIREBASE_SERVICE_ACCOUNT_PATH` (path to JSON file)
- `FIREBASE_SERVICE_ACCOUNT_JSON_RAW` (raw JSON string)

## Optional Variables

These have sensible defaults but can be customized:

| Variable | Description | Default | Production Recommendation |
|----------|-------------|---------|---------------------------|
| `PORT` | Server port | `8080` | `8080` |
| `DDL_AUTO` | Hibernate DDL mode | `update` | `validate` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173,http://localhost:3000` | `https://yourdomain.com` |
| `LOG_LEVEL` | Application log level | `INFO` | `INFO` or `WARN` |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `dev` | `prod` |
| `DB_POOL_SIZE` | Max database connections | `10` | `20` |
| `DB_MIN_IDLE` | Min idle connections | `5` | `10` |
| `LOG_FILE_PATH` | Log file location | `logs/taskflow-api.log` | `/var/log/taskflow/api.log` |

## How to Set Environment Variables

### Linux/Mac (Terminal)

```bash
export DATABASE_URL="jdbc:postgresql://localhost:5432/taskflow"
export DATABASE_USERNAME="postgres"
export DATABASE_PASSWORD="your_password"
export FIREBASE_SERVICE_ACCOUNT_JSON="<base64_encoded_json>"
```

### Windows (Command Prompt)

```cmd
set DATABASE_URL=jdbc:postgresql://localhost:5432/taskflow
set DATABASE_USERNAME=postgres
set DATABASE_PASSWORD=your_password
set FIREBASE_SERVICE_ACCOUNT_JSON=<base64_encoded_json>
```

### Windows (PowerShell)

```powershell
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/taskflow"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="your_password"
$env:FIREBASE_SERVICE_ACCOUNT_JSON="<base64_encoded_json>"
```

### Using .env File (Development)

Create `backend/.env`:

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/taskflow
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
FIREBASE_SERVICE_ACCOUNT_JSON=<base64_encoded_json>
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**Note**: Spring Boot doesn't load .env files by default. Use a tool like `dotenv` or set variables manually.

### Docker

```bash
docker run -e DATABASE_URL="jdbc:postgresql://host:5432/taskflow" \
           -e DATABASE_USERNAME="postgres" \
           -e DATABASE_PASSWORD="password" \
           -e FIREBASE_SERVICE_ACCOUNT_JSON="<base64>" \
           taskflow-api
```

### Docker Compose

```yaml
environment:
  DATABASE_URL: jdbc:postgresql://postgres:5432/taskflow
  DATABASE_USERNAME: postgres
  DATABASE_PASSWORD: postgres
  FIREBASE_SERVICE_ACCOUNT_JSON: ${FIREBASE_SERVICE_ACCOUNT_JSON}
```

### Heroku

```bash
heroku config:set DATABASE_URL="jdbc:postgresql://..."
heroku config:set DATABASE_USERNAME="postgres"
heroku config:set DATABASE_PASSWORD="password"
heroku config:set FIREBASE_SERVICE_ACCOUNT_JSON="<base64>"
```

### AWS Elastic Beanstalk

```bash
eb setenv DATABASE_URL="jdbc:postgresql://..." \
         DATABASE_USERNAME="postgres" \
         DATABASE_PASSWORD="password" \
         FIREBASE_SERVICE_ACCOUNT_JSON="<base64>"
```

### Kubernetes

Create a Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: taskflow-secrets
type: Opaque
stringData:
  DATABASE_URL: jdbc:postgresql://postgres:5432/taskflow
  DATABASE_USERNAME: postgres
  DATABASE_PASSWORD: your_password
  FIREBASE_SERVICE_ACCOUNT_JSON: <base64_encoded_json>
```

Reference in Deployment:

```yaml
envFrom:
  - secretRef:
      name: taskflow-secrets
```

## Firebase Credential Setup

### Method 1: Base64-Encoded JSON (Recommended)

1. Download service account JSON from Firebase Console
2. Encode to base64:

```bash
# Linux/Mac
cat firebase-service-account.json | base64 -w 0

# Mac (alternative)
base64 -i firebase-service-account.json

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("firebase-service-account.json"))
```

3. Set environment variable:

```bash
export FIREBASE_SERVICE_ACCOUNT_JSON="<output_from_above>"
```

### Method 2: File Path

```bash
export FIREBASE_SERVICE_ACCOUNT_PATH="/path/to/firebase-service-account.json"
```

### Method 3: Raw JSON String

```bash
export FIREBASE_SERVICE_ACCOUNT_JSON_RAW='{"type":"service_account","project_id":"..."}'
```

## Environment-Specific Configurations

### Development

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/taskflow
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DDL_AUTO=update
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
LOG_LEVEL=DEBUG
SPRING_PROFILES_ACTIVE=dev
```

### Staging

```bash
DATABASE_URL=jdbc:postgresql://staging-db:5432/taskflow
DATABASE_USERNAME=taskflow_user
DATABASE_PASSWORD=<secure_password>
DDL_AUTO=validate
CORS_ALLOWED_ORIGINS=https://staging.yourdomain.com
LOG_LEVEL=INFO
SPRING_PROFILES_ACTIVE=prod
```

### Production

```bash
DATABASE_URL=jdbc:postgresql://prod-db:5432/taskflow
DATABASE_USERNAME=taskflow_user
DATABASE_PASSWORD=<very_secure_password>
DDL_AUTO=validate
CORS_ALLOWED_ORIGINS=https://yourdomain.com
LOG_LEVEL=WARN
SPRING_PROFILES_ACTIVE=prod
DB_POOL_SIZE=20
DB_MIN_IDLE=10
```

## Validation

### Check if Variables are Set

```bash
# Linux/Mac
echo $DATABASE_URL
echo $FIREBASE_SERVICE_ACCOUNT_JSON

# Windows (PowerShell)
echo $env:DATABASE_URL
echo $env:FIREBASE_SERVICE_ACCOUNT_JSON
```

### Test Application Startup

```bash
# Should show all loaded properties
mvn spring-boot:run -Dspring-boot.run.arguments=--debug
```

### Verify Health Endpoint

```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "UP",
  "service": "TaskFlow API",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:45",
  "database": "UP"
}
```

## Troubleshooting

### Database Connection Failed

- Verify `DATABASE_URL` format is correct
- Check database is running: `pg_isready -h localhost -p 5432`
- Test credentials: `psql -h localhost -U postgres -d taskflow`

### Firebase Initialization Failed

- Verify base64 encoding is correct
- Check JSON is valid: `echo $FIREBASE_SERVICE_ACCOUNT_JSON | base64 -d | jq`
- Ensure no extra whitespace or newlines

### CORS Errors

- Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check for trailing slashes (should not have them)
- Ensure protocol matches (http vs https)

## Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Use strong passwords** - Minimum 16 characters
3. **Rotate credentials regularly** - Every 90 days
4. **Use secrets management** - AWS Secrets Manager, HashiCorp Vault
5. **Limit CORS origins** - Never use wildcards in production
6. **Use HTTPS in production** - Always
7. **Encrypt database connections** - Use SSL/TLS
8. **Monitor access logs** - Track who accesses what

## Quick Copy-Paste Templates

### Local Development

```bash
export DATABASE_URL="jdbc:postgresql://localhost:5432/taskflow"
export DATABASE_USERNAME="postgres"
export DATABASE_PASSWORD="postgres"
export FIREBASE_SERVICE_ACCOUNT_JSON="<your_base64_here>"
export CORS_ALLOWED_ORIGINS="http://localhost:5173"
```

### Docker Compose

```yaml
environment:
  - DATABASE_URL=jdbc:postgresql://postgres:5432/taskflow
  - DATABASE_USERNAME=postgres
  - DATABASE_PASSWORD=postgres
  - FIREBASE_SERVICE_ACCOUNT_JSON=${FIREBASE_SERVICE_ACCOUNT_JSON}
  - CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Production (Heroku)

```bash
heroku config:set \
  DATABASE_URL="<heroku_provides_this>" \
  FIREBASE_SERVICE_ACCOUNT_JSON="<base64>" \
  CORS_ALLOWED_ORIGINS="https://yourdomain.com" \
  DDL_AUTO="validate" \
  SPRING_PROFILES_ACTIVE="prod"
```
