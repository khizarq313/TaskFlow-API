# TaskFlow API

![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Auth-yellow?logo=firebase)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)

A full-stack enterprise task management system with Firebase authentication, real-time kanban boards, and comprehensive analytics. Built with Spring Boot, React, and PostgreSQL.

## Features

- **Firebase Authentication** - Secure user authentication with email/password and Google OAuth
- **Kanban Board** - Drag-and-drop task management with real-time updates using @dnd-kit
- **Task Management** - Create, update, delete tasks with priorities, due dates, and assignments
- **Subtasks & Comments** - Nested subtasks with completion tracking and threaded comments
- **Project Workspaces** - Organize tasks into projects with team member management
- **Analytics Dashboard** - Visual insights with completion rates, status distribution, and activity feeds
- **Responsive Design** - Mobile-first UI with dark mode and glassmorphism effects
- **RESTful API** - Comprehensive backend API with Swagger documentation
- **Docker Support** - Multi-stage builds with Docker Compose orchestration
- **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions

## Architecture

```
┌─────────────────┐
│   React SPA     │
│  (TypeScript)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Spring Boot    │
│   Controller    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │
│     Layer       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Repository    │
│   (Spring JPA)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│    Database     │
└─────────────────┘
```

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, React Router, Recharts, @dnd-kit |
| **Backend** | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, Hibernate |
| **Authentication** | Firebase Admin SDK, JWT tokens |
| **Database** | PostgreSQL 15, Flyway migrations |
| **DevOps** | Docker, Docker Compose, GitHub Actions, Maven |
| **API Docs** | Swagger/OpenAPI 3.0 |

## Prerequisites

- **Java 17** or higher
- **Node.js 20** or higher
- **Docker** and Docker Compose (optional, for containerized deployment)
- **Firebase Project** with Authentication enabled
- **PostgreSQL 15** (if running without Docker)

## Quick Start - Docker

The fastest way to get started:

```bash
# Clone the repository
git clone https://github.com/yourusername/taskflow-api.git
cd taskflow-api

# Copy environment variables
cp .env.example .env

# Edit .env and add your Firebase credentials
nano .env

# Start all services
docker compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8080/api
# Swagger UI: http://localhost:8080/swagger-ui.html
# pgAdmin: http://localhost:5050
```

## Quick Start - Manual

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies and run tests
mvn clean install

# Run the application
mvn spring-boot:run

# Or build and run the JAR
mvn package
java -jar target/taskflow-api-1.0.0.jar
```

The backend will start on `http://localhost:8080`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your Firebase credentials
nano .env

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIzaSyC...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `my-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |
| `VITE_USE_MOCK` | Use mock data (dev mode) | `true` or `false` |
| `VITE_API_URL` | Backend API URL | `http://localhost:8080/api` |
| `DATABASE_URL` | PostgreSQL connection string | `jdbc:postgresql://localhost:5432/taskflow` |
| `DATABASE_USER` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | `strongpassword123` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase service account JSON | `/path/to/service-account.json` |

## API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks (with filters) |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/{id}` | Get task by ID |
| `PUT` | `/api/tasks/{id}` | Update task |
| `PATCH` | `/api/tasks/{id}/status` | Update task status |
| `DELETE` | `/api/tasks/{id}` | Delete task |
| `POST` | `/api/tasks/{id}/subtasks` | Add subtask |
| `POST` | `/api/tasks/{id}/comments` | Add comment |
| `GET` | `/api/projects` | Get all projects |
| `POST` | `/api/projects` | Create project |
| `GET` | `/api/analytics` | Get analytics data |
| `GET` | `/api/health` | Health check (no auth) |

All endpoints except `/api/health` require Firebase authentication token in the `Authorization` header:

```
Authorization: Bearer <firebase_id_token>
```

## Running Tests

### Backend Tests

```bash
cd backend
mvn test

# With coverage report
mvn test jacoco:report
```

Test reports are generated in `backend/target/surefire-reports/`

### Frontend Type Checking

```bash
cd frontend
npx tsc --noEmit
```

## Demo Mode

The application includes a demo mode with realistic mock data for development and testing:

1. Set `VITE_USE_MOCK=true` in your `.env` file
2. Start the frontend with `npm run dev`
3. You can explore the UI without a backend or Firebase setup
4. Mock data includes 10 tasks, 3 projects, and analytics

## Project Structure

```
taskflow-api/
├── backend/
│   ├── src/main/java/com/taskflow/api/
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access
│   │   ├── model/          # JPA entities
│   │   ├── dto/            # Data transfer objects
│   │   ├── security/       # Firebase auth filter
│   │   ├── config/         # Spring configuration
│   │   └── exception/      # Exception handlers
│   ├── src/main/resources/
│   │   └── application.yml # Spring Boot config
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── types/          # TypeScript types
│   │   └── mocks/          # Mock data
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── .github/workflows/
│   └── ci.yml              # GitHub Actions CI/CD
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose orchestration
├── .env.example            # Environment variables template
└── README.md
```

## Design System

The application uses a custom dark-mode design system with:

- **Typography**: Manrope (headlines), Inter (body/labels)
- **Colors**: Material Design 3 inspired color tokens
- **Components**: Glassmorphism cards, atmospheric shadows, architectural gradients
- **Icons**: Material Symbols Outlined
- **Responsive**: Mobile-first with Tailwind breakpoints

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from Material Design 3
- Icons from Google Material Symbols
- Charts powered by Recharts
- Drag-and-drop by @dnd-kit

---

Built with ❤️ using Spring Boot and React
