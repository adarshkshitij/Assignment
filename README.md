# Primetrade AI Backend Developer (Intern) Assignment

This repository contains the completion of the Backend Developer (Intern) assignment.
It implements a robust Express.js REST API with a dynamic React frontend.

## 🚀 Features

- **Backend Architecture**: Scalable MVC Express app with MongoDB.
- **Advanced Querying**: Server-side filtering, multi-field sorting, and pagination.
- **Analytics Engine**: Real-time task metrics using MongoDB Aggregation pipelines.
- **High Performance**: In-memory API response caching (node-cache) for zero-latency data fetching.
- **Authentication**: JWT & `bcrypt` security with Role-Based Access (Admin/User).
- **Premium Frontend**: "Neon Dark Mode Trading Terminal" with Liquid Glassmorphism and animated backgrounds.
- **Mobile Responsive**: Fully optimized UI for Tablet and Mobile viewports.
- **Theme Engine**: Persistent Light/Dark mode switching.
- **Security**: Implementation of `helmet`, `cors`, and password visibility toggles.

## 🛠 Prerequisites

- Node.js (v16+)
- MongoDB (Running locally via Docker or externally, like Atlas)

## 🏃‍♂️ Getting Started

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
*(Runs on `http://localhost:5000`)*

> Swagger API Docs are available at: `http://localhost:5000/api-docs`

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

## 📚 Deliverables Check

- [x] Backend project hosted in GitHub with README setup
- [x] Working APIs for Auth & CRUD
- [x] Basic frontend UI that connects to APIs
- [x] API documentation (Swagger generated dynamically)
- [x] Short scalability note (`SCALABILITY.md`)
