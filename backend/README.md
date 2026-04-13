# TaskFlow API - Backend

A production-ready Spring Boot REST API for task management with Firebase authentication and PostgreSQL database.

## Features

- 🔐 Firebase Authentication with JWT token verification
- 📊 RESTful API with OpenAPI/Swagger documentation
- 🗄️ PostgreSQL database with JPA/Hibernate
- 🛡️ User-scoped data isolation and security
- 📝 Comprehensive error handling
- 🚀 Production-ready configuration
- 📦 Docker support

## Tech Stack

- **Framework**: Spring Boot 3.4.4
- **Language**: Java 17
- **Database**: PostgreSQL
- **Authentication**: Firebase Admin SDK
- **Documentation**: SpringDoc OpenAPI 3
- **Build Tool**: Maven

## Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Firebase project with service account credentials
- Maven 3.6+ (or use included wrapper)

## Quick Start

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Set Up Database

Create a PostgreSQL database:

```sql
CREATE DATABASE taskflow;
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/taskflow
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password

# Firebase (choose one method)
# Method 1: Base64-encoded JSON (recommended)
FIREBASE_SERVICE_ACCOUNT_JSON=<base64_encoded_json>

# Method 2: File path
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/firebase-service-account.json

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Build the Project

```bash
./mvnw clean install
```

Or if you have Maven installed:

```bash
mvn clean install
```

### 5. Run the Application

Development mode:

```bash
./mvnw spring-boot:run
```

Or run the JAR:

```bash
java -jar target/taskflow-api-1.0.0.jar
```

The API will start on `http://localhost:8080`

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/taskflow` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `your_password` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Base64-encoded Firebase credentials | `eyJ0eXBlIjoi...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `DDL_AUTO` | Hibernate DDL mode | `update` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:5173` |
| `LOG_LEVEL` | Application log level | `INFO` |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `dev` |

## Firebase Setup

### Option 1: Base64-Encoded JSON (Recommended for Production)

1. Download your Firebase service account JSON from Firebase Console
2. Encode it to base64:

```bash
cat firebase-service-account.json | base64 -w 0
```

3. Set the environment variable:

```bash
export FIREBASE_SERVICE_ACCOUNT_JSON="<base64_output>"
```

### Option 2: File Path

1. Download your Firebase service account JSON
2. Set the path:

```bash
export FIREBASE_SERVICE_ACCOUNT_PATH="/path/to/firebase-service-account.json"
```

## API Documentation

Once the application is running, access:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## API Endpoints

### Public Endpoints

- `GET /api/health` - Health check

### Protected Endpoints (Require Firebase JWT)

#### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/tasks/{id}/comments` - Add comment

#### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

#### Analytics
- `GET /api/analytics` - Get user analytics

## Authentication

All protected endpoints require a Firebase JWT token in the Authorization header:

```
Authorization: Bearer <firebase_jwt_token>
```

The token is verified on every request, and the user is automatically created/updated in the database.

## Production Deployment

### Using Production Profile

```bash
export SPRING_PROFILES_ACTIVE=prod
java -jar target/taskflow-api-1.0.0.jar
```

### Production Checklist

- [ ] Set `DDL_AUTO=validate` (never use `create` or `update` in production)
- [ ] Use strong database credentials
- [ ] Configure proper CORS origins (no wildcards)
- [ ] Use base64-encoded Firebase credentials
- [ ] Enable HTTPS/TLS
- [ ] Set up proper logging and monitoring
- [ ] Configure database connection pooling
- [ ] Set up database backups
- [ ] Use environment-specific configuration

### Docker Deployment

Build the image:

```bash
docker build -t taskflow-api .
```

Run the container:

```bash
docker run -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/taskflow \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=password \
  -e FIREBASE_SERVICE_ACCOUNT_JSON=<base64_json> \
  taskflow-api
```

## Database Schema

The application uses JPA/Hibernate with the following entities:

- **User** - Firebase-authenticated users
- **Project** - Task projects/workspaces
- **Task** - Individual tasks with status, priority, due dates
- **Subtask** - Task sub-items
- **Comment** - Task comments and activity
- **ProjectMember** - Project membership and roles

## Error Handling

All API errors return a consistent JSON format:

```json
{
  "timestamp": "2024-01-15T10:30:45",
  "status": 404,
  "message": "Task not found with id: 123",
  "path": "/api/tasks/123"
}
```

## Security Features

- Firebase JWT token verification on every request
- User-scoped data isolation (users can only access their own data)
- CORS protection with configurable origins
- SQL injection protection via JPA/Hibernate
- No sensitive data in logs or error messages

## Development

### Running Tests

```bash
./mvnw test
```

### Code Style

The project uses:
- Lombok for boilerplate reduction
- Constructor-based dependency injection
- Service layer for business logic
- Repository pattern for data access

### Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/taskflow/api/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data transfer objects
│   │   │   ├── exception/       # Exception handling
│   │   │   ├── model/           # JPA entities
│   │   │   ├── repository/      # Data repositories
│   │   │   ├── security/        # Security filters
│   │   │   └── service/         # Business logic
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-prod.properties
│   └── test/                    # Unit and integration tests
├── pom.xml
└── README.md
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check connection URL format
- Ensure database exists
- Verify credentials

### Firebase Authentication Issues

- Verify service account JSON is valid
- Check Firebase project configuration
- Ensure token is not expired
- Verify token is sent in Authorization header

### Build Issues

- Ensure Java 17 is installed: `java -version`
- Clear Maven cache: `./mvnw clean`
- Update dependencies: `./mvnw dependency:resolve`

## Support

For issues and questions:
- Check the [API documentation](http://localhost:8080/swagger-ui.html)
- Review application logs
- Verify environment variables are set correctly

## License

Proprietary - All rights reserved
