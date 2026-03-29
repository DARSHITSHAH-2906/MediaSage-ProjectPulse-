# ProjectPulse

A full-stack project and task management application built with modern web technologies.

## Overview

ProjectPulse is a productivity tool designed to help users manage their projects and tasks efficiently. It features a modern UI with intuitive task tracking, project progress visualization, and deadline management.

## Features

- **User Authentication** - Secure registration and login with JWT-based authentication
- **Project Management** - Create, view, and delete projects with descriptions
- **Task Management** - Create tasks within projects with priority levels (low, medium, high)
- **Task Status Tracking** - Track task progress through states: `todo`, `in-progress`, `done`
- **Kanban Board View** - Visual task board for drag-and-drop style task management
- **Dashboard Analytics** - Overview of projects, active tasks, completed tasks, and overdue items
- **Progress Visualization** - Circular progress indicators and progress bars for each project
- **Due Date Management** - Set and track task deadlines with overdue highlighting

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling with Zod validation
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons
- **date-fns** - Date utility library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation

## Project Structure

```
MediaSage/
├── frontend/               # Frontend (Next.js)
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and API client
│   └── public/             # Static assets
│
└── backend/                # Backend (Express.js)
    └── src/
        ├── controllers/    # Request handlers
        ├── services/       # Business logic
        ├── repositories/   # Data access layer
        ├── models/         # Data models
        ├── routes/         # API routes
        ├── middlewares/    # Auth & validation
        └── config/         # Database configuration
```

## Links

| Resource | URL |
|----------|-----|
| **Frontend URL** | [FRONTEND_URL](https://media-sage-project-pulse.vercel.app/) |
| **Backend URL** | [BACKEND_URL](https://mediasage-projectpulse.onrender.com) |
| **Postman Documentation** | [POSTMAN_LINK](https://wrap-link.vercel.app/url/6) |
| **Demo Video** | [DRIVE_LINK](https://drive.google.com/drive/folders/1BxlcEPx1jVBLB1qBoMBD-FVz7VfPD9On?usp=sharing) |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/projectpulse
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your_secret_key
   JWT_MAX_AGE=86400000
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/verify` | Verify authentication token |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get project by ID |
| POST | `/api/projects` | Create a new project |
| DELETE | `/api/projects/:id` | Delete a project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:project_id/tasks` | Get all tasks for a project |
| POST | `/api/projects/:project_id/tasks` | Create a task in project |
| PUT | `/api/tasks/:id` | Update task status/details |
| DELETE | `/api/tasks/:id` | Delete a task |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |

### Frontend
The frontend expects the backend API to be available at the URL configured in the API client. Update the base URL in `lib/api.ts` if needed.
