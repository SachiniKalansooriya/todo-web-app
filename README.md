# Todo Web Application

## 🎯 Overview

A full-stack todo management application built with Angular 19 (frontend) and Spring Boot 3.5.6 (backend). The app includes Google OAuth2 authentication, JWT-based API security, MySQL persistence, and a responsive UI with Tailwind CSS.

## 🔐 Authentication & Security

-  Google OAuth2 Integration using Spring Security OAuth2 Client
-  JWT token-based authentication for API calls (stateless sessions)
-  Secure user session management with a custom OAuth2 authentication success handler
-  Token expiration handling (24-hour validity)

## 👥 User Management

-  User entity and model stored in MySQL
-  Google ID and profile picture support
-  Email-based user identification
-  Automatic user creation on first login

## 🗂️ Task Management System

### Advanced Task Features

-  CRUD operations: create, read, update, delete tasks
-  Priority levels: LOW, MEDIUM, HIGH
-  Status tracking: TODO, IN_PROGRESS, DONE
-  Due date management and overdue detection
-  Task descriptions and optional categories

### Task Filtering & Search

-  Filter by status (All, Todo, In Progress, Done)
-  Filter by priority
-  Date range filtering

## 🖥️ User Interface Features

-  Multiple view modes: Board (Kanban-style) and Calendar
-  Responsive design built with Tailwind CSS
-  Interactive components:
  -  Task form component (create/edit)
  -  Task list component with dynamic filtering
  -  Task item component with inline actions
  -  Modal-based task editing

## 🔁 Real-time Data Management

-  Angular services for API communication
-  Auth service for token handling and user state
-  Reactive state management using RxJS observables
-  HTTP interceptors inject Bearer tokens for secure requests

## 🗄️ Database Design

-  MySQL with Spring Data JPA / Hibernate ORM
-  `users` table: profile data and Google OAuth fields
-  `tasks` table: task details linked to users (relations)
-  Automatic created_at / updated_at timestamps

##  Calendar & UX Enhancements

-  Calendar integration for due date visualization
-  Real-time updates using observables
-  Form validation with Angular reactive forms
-  Centralized error handling and loading states for better UX

## 🎨 Design & UX

-  Modern UI styled with Tailwind CSS
-  Mobile-first responsive layout
-  Smooth transitions and intuitive navigation
-  Color-coded priorities and status indicators for clarity

## 🛠️ Development Tools & Technologies

### Backend

- Java 17 + Spring Boot 3.5.6
- Spring Security (OAuth2) and JWT
- Spring Data JPA
- MySQL
- Maven for builds

### Frontend

- Angular 19 (TypeScript)
- RxJS for reactive programming
- Tailwind CSS for styling
- Angular Router and HttpClient

## ✅ How it was implemented (brief)

- Backend exposes REST APIs under `/api/*` secured by JWT; OAuth2 login flow handled by Spring Security and a custom `OAuth2AuthenticationSuccessHandler` which issues a JWT and redirects the user to the frontend callback with the token.
- Frontend handles authentication by redirecting users to the backend OAuth2 endpoint, receiving the JWT on callback, storing it in `localStorage`, and using an HTTP interceptor to add the `Authorization: Bearer <token>` header to API requests.
- Task operations use a `TaskService` on the frontend which communicates with `TaskController` endpoints on the backend; the backend maps `Task` JPA entities to DTOs and performs validation.


