# Multi-stage Dockerfile for Business Analytics Platform

# Stage 1: Build Frontend React Static Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy lockfiles and install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy source files and build production bundle
COPY frontend/ ./
ENV CI=false
RUN npm run build

# Stage 2: Production Python Backend Server
FROM python:3.11-slim
WORKDIR /app

# Install system build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application, ML pipeline, sample data, and configuration manifests
COPY backend/ ./backend/
COPY ml/ ./ml/
COPY docs/ ./docs/
COPY sample_datasets/ ./sample_datasets/
COPY gunicorn.conf.py Procfile ./

# Copy built frontend static assets
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Set runtime environment variables
# Note: PORT is injected dynamically by Railway/cloud host at runtime
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/backend:/app \
    FLASK_APP=backend/app.py \
    FLASK_ENV=production \
    HOST=0.0.0.0

EXPOSE 5000

# Run Gunicorn WSGI server
CMD ["gunicorn", "-c", "gunicorn.conf.py", "backend.app:app"]
