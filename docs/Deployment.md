# Deployment Guide

This guide describes how to deploy the **Business Analytics Platform** in both local development environments and production settings using standard WSGI servers and static file web servers.

---

## 1. Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and `npm` 9+
- Git

### Step-by-Step Instructions

1. **Clone Repository**:
   ```bash
   git clone https://github.com/your-username/Business-analytics.git
   cd Business-analytics
   ```

2. **Backend Setup**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate

   pip install -r requirements.txt
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

4. **Start Backend Server**:
   ```bash
   # From project root with virtualenv active
   python backend/app.py
   ```
   *Runs on `http://127.0.0.1:5000`*

5. **Start Frontend Server**:
   ```bash
   # In frontend/ directory
   npm start
   ```
   *Runs on `http://localhost:3000` or `http://localhost:3001`*

---

## 2. Production Deployment

### Backend Deployment (Gunicorn / Waitress)

For production Linux environments, use **Gunicorn** WSGI server behind an Nginx reverse proxy:

```bash
pip install gunicorn

# Run Gunicorn from root directory
gunicorn --workers 4 --bind 127.0.0.1:5000 backend.app:app
```

For Windows production environments, use **Waitress**:

```bash
pip install waitress

# Run Waitress server
waitress-serve --port=5000 backend.app:app
```

---

### Frontend Production Build

Compile the React frontend into static HTML/JS/CSS assets:

```bash
cd frontend
npm run build
```

This creates an optimized production bundle in `frontend/build/`.

---

### Nginx Reverse Proxy Configuration Example

```nginx
server {
    listen 80;
    server_name analytics.yourcompany.com;

    # Serve React Static Frontend
    location / {
        root /var/www/business-analytics/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy Flask Backend API Requests
    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env` and adjust settings:

```bash
cp .env.example .env
```

Key Production Variables:
- `FLASK_ENV=production`
- `FLASK_DEBUG=0`
- `CORS_ORIGINS=https://analytics.yourcompany.com`
- `REACT_APP_API_BASE_URL=https://analytics.yourcompany.com/api`
