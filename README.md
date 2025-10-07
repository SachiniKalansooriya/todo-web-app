# Todo Web Application
🎯 **# Overview**

A full-stack todo management application built with Angular 19 frontend and Spring Boot 3.5.6 backend, featuring Google OAuth2 authentication, MySQL database integration, and modern responsive design.

**1. Authentication & Security**
Google OAuth2 Integration

Implemented using Spring Security OAuth2 Client
JWT token-based authentication for API calls
Secure user session management
Custom OAuth2 authentication success handler

**JWT Token Management**

Custom JWT utility class for token generation/validation
Token expiration handling (24-hour validity)
Bearer token authentication for API endpoints

**2. User Management**

User Entity & Model
User profile with Google ID integration
Profile picture support from Google account
Email-based user identification
Automatic user creation on first login

**3. Task Management System**

Advanced Task Features

CRUD operations (Create, Read, Update, Delete)
Task priority levels (LOW, MEDIUM, HIGH)
Task status tracking (TODO, IN_PROGRESS, DONE)
Due date management with overdue detection
Task descriptions and categorization

**Task Filtering & Search**

Filter by status (All, Todo, In Progress, Done)
Filter by priority level
Search functionality by task title/description
Date range filtering
Overdue tasks filter

**4. User Interface Features**

Multiple View Modes

Board view for Kanban-style task management
Calendar view for date-based task visualization
Responsive design with Tailwind CSS
Interactive Components

Task form component for create/edit operations
Task list component with dynamic filtering
Task item component with inline actions
Modal-based task editing

**5. Real-time Data Management**

Angular Services
Task service for API communication
Auth service for authentication management
Reactive state management with RxJS observables
HTTP interceptors for token injection

**Database Design**
MySQL Database with JPA/Hibernate ORM
Users Table: Profile information and Google OAuth data
Tasks Table: Task details with user relationships
Automatic timestamps for creation and update tracking

**Calendar Integration for due date visualization
Real-time Updates using observables
Form Validation with Angular reactive forms
Error Handling throughout the application
Loading States for better UX**

🎨 **Design & UX Features**
Modern UI with Tailwind CSS styling
Responsive design for mobile and desktop
Interactive animations and smooth transitions
Intuitive navigation with clear visual hierarchy
Color-coded priorities and status indicators

**🔧 **Development Tools & Technologies**
Backend Stack**
Spring Boot 3.5.6 with Java 17
Spring Security for OAuth2 authentication
Spring Data JPA for database operations
JWT for stateless authentication
MySQL database with connection pooling
Maven for dependency management

**Frontend Stack**
Angular 19 with TypeScript
RxJS for reactive programming
Tailwind CSS for styling
Angular Router for navigation
HTTP Client for API communication
