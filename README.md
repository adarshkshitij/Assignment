# Primetrade AI Backend Developer (Intern) Assignment

This repository contains the completion of the Backend Developer (Intern) assignment.
It implements a robust Express.js REST API with a dynamic React frontend.

## Features

- **Backend Architecture**: Scalable MVC Express app with MongoDB.
- **Advanced Querying**: Server-side filtering, multi-field sorting, and pagination.
- **Analytics Engine**: Real-time task metrics using MongoDB Aggregation pipelines.
- **High Performance**: In-memory API response caching (node-cache) for zero-latency data fetching.
- **Authentication**: JWT and `bcrypt` security with Role-Based Access (Admin/User).
- **Premium Frontend**: "Neon Dark Mode Trading Terminal" with Liquid Glassmorphism and animated backgrounds.
- **Mobile Responsive**: Fully optimized UI for tablet and mobile viewports.
- **Theme Engine**: Persistent Light/Dark mode switching.
- **Security**: Implementation of `helmet`, `cors`, and password visibility toggles.

## Prerequisites

- Node.js (v16+)
- MongoDB (running locally via Docker or externally, like Atlas)

## Getting Started

### 1. Database Setup
The easiest way to run the database is via Docker:

```bash
docker-compose up -d
```

Alternatively, you can skip this if you update `backend/.env` with your own `MONGO_URI`.

### 2. Start Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5000`

Swagger API Docs are available at `http://localhost:5000/api-docs`

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Local Setup From GitHub

If someone clones this repository from GitHub, they can run it with these steps.

### 1. Clone the repository

```bash
git clone https://github.com/adarshkshitij/Assignment.git
cd Assignment
```

### 2. Create backend environment variables

Create a file named `backend/.env` and add:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/primetrade_tasks
JWT_SECRET=your_jwt_secret_here
ADMIN_SECRET_CODE=your_admin_code_here
```

### 3. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:5000`

Swagger docs are available at `http://localhost:5000/api-docs`

### 4. Start the frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`

### 5. Registering as an admin

To create an admin account:

- Select `Admin` in the signup form
- Enter the same value used in `ADMIN_SECRET_CODE`

If the code does not match, admin registration will be rejected.

## Deliverables Check

- [x] Backend project hosted in GitHub with README setup
- [x] Working APIs for Auth and CRUD
- [x] Basic frontend UI that connects to APIs
- [x] API documentation (Swagger generated dynamically)
- [x] Short scalability note (`SCALABILITY.md`)
