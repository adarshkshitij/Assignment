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

## Beginner-Friendly Setup

If you are starting from zero and do not have anything installed, follow these steps in order.

### 1. Install required software

You need these tools on your computer:

- **Git**: https://git-scm.com/downloads
- **Node.js** (version 16 or later): https://nodejs.org/
- **MongoDB Community Server**: https://www.mongodb.com/try/download/community

Optional:

- **Docker Desktop** if you want to run MongoDB with Docker instead of installing MongoDB directly:
  https://www.docker.com/products/docker-desktop/
- **VS Code** for editing and running the project:
  https://code.visualstudio.com/

### 2. Check that everything is installed

Open Command Prompt, PowerShell, or the VS Code terminal and run:

```bash
git --version
node -v
npm -v
```

If these commands show version numbers, the tools are installed correctly.

### 3. Download the project from GitHub

```bash
git clone https://github.com/adarshkshitij/Assignment.git
cd Assignment
```

### 4. Set up the backend environment file

Create a file named `backend/.env` and add:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/primetrade_tasks
JWT_SECRET=your_jwt_secret_here
ADMIN_SECRET_CODE=your_admin_code_here
```

You can replace:

- `your_jwt_secret_here` with any long random secret string
- `your_admin_code_here` with any secret code you want to use for admin signup

### 5. Start MongoDB

Choose one of these options:

#### Option A: If MongoDB is installed locally

Make sure the MongoDB service is running on your machine.

#### Option B: If you want to use Docker

From the project root, run:

```bash
docker-compose up -d
```

### 6. Start the backend

Open a terminal in the project folder and run:

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

`http://localhost:5000`

Swagger API docs are available at:

`http://localhost:5000/api-docs`

### 7. Start the frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

`http://localhost:5173`

### 8. Open the app

Open this URL in your browser:

`http://localhost:5173`

## Quick Run Guide

If your system is already ready, use these commands:

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Admin Signup

To create an admin account:

- Select `Admin` in the signup form
- Enter the same value used in `ADMIN_SECRET_CODE`

If the code does not match, admin registration will be rejected.

## Notes

- The frontend connects to the backend at `http://localhost:5000/api/v1`
- The default frontend development URL is `http://localhost:5173`
- If local MongoDB is not available, the backend may fall back to an in-memory MongoDB instance depending on your environment

## Deliverables Check

- [x] Backend project hosted in GitHub with README setup
- [x] Working APIs for Auth and CRUD
- [x] Basic frontend UI that connects to APIs
- [x] API documentation (Swagger generated dynamically)
- [x] Short scalability note (`SCALABILITY.md`)
