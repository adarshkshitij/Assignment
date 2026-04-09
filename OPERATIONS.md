# Operations Guide

This document captures the runtime behavior that matters most when operating or reviewing the project locally.

## Service Endpoints

- Frontend: `http://127.0.0.1:5173`
- Swagger docs: `http://localhost:5000/api-docs`
- Health endpoint: `http://localhost:5000/api/v1/health`

## Start Order

1. Start MongoDB locally or via Docker.
2. Start the backend.
3. Start the frontend.
4. Open Swagger or the frontend in a browser.

## Health Check

The backend exposes:

`GET /api/v1/health`

Expected response shape:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 123.45,
    "timestamp": "2026-04-09T12:00:00.000Z",
    "environment": "development"
  }
}
```

## Verification Commands

### Backend

```bash
cd backend
npm run check
```

### Frontend

```bash
cd frontend
npm run build
```

## Logging

- request logging is enabled in development through `morgan`
- runtime errors are surfaced through centralized error middleware
- `application_logs.txt` is included as a local artifact from development runs and is not required for application behavior

## Expected Startup Output

Typical backend startup:

```text
MongoDB Connected: localhost
Server running in development mode on port 5000
```

If MongoDB is unavailable:

```text
Failed to connect to primary MongoDB. Spinning up In-Memory DB...
In-Memory MongoDB Connected: 127.0.0.1
```

## Troubleshooting

### Backend does not start

Check:

- `backend/.env` exists
- `JWT_SECRET` is set
- `MONGO_URI` is valid
- port `5000` is free

### Frontend cannot reach backend

Check:

- backend is running on `http://localhost:5000`
- `VITE_API_URL` points to the correct backend base URL
- browser console does not show CORS or network errors

### Admin registration fails

Check:

- the selected role is `admin`
- the provided code matches `ADMIN_SECRET_CODE`

### Authentication breaks after token issues

The frontend clears stored auth tokens automatically on `401` responses. Sign in again to restore the session.

