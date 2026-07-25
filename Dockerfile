# Multi-stage Dockerfile for Business Analytics Platform

# Stage 1: Build Frontend React Static Assets
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend Server
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy backend code, ML pipeline, datasets, and docs
COPY backend/ ./backend/
COPY ml/ ./ml/
COPY docs/ ./docs/
COPY sample_datasets/ ./sample_datasets/
COPY gunicorn.conf.py Procfile ./

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    FLASK_APP=backend/app.py \
    FLASK_ENV=production \
    PORT=5000 \
    HOST=0.0.0.0

EXPOSE 5000

# Run Gunicorn WSGI server
CMD ["gunicorn", "-c", "gunicorn.conf.py", "backend.app:app"]
