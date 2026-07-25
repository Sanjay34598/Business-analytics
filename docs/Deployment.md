# Deployment Manual

This document provides step-by-step instructions for deploying the **Business Analytics Platform** across local development, Docker containers, Render, Vercel, and production Gunicorn/Nginx infrastructure.

---

## Deployment Options Matrix

| Deployment Target | Environment | Configuration Manifest | Production Readiness |
|-------------------|-------------|------------------------|----------------------|
| **Docker Compose**| Containerized | `Dockerfile`, `docker-compose.yml` | High (One-command setup) |
| **Render** | Cloud PaaS | `render.yaml` | High (Auto-deploy on push) |
| **Vercel + Render** | Hybrid (Frontend + Backend) | `vercel.json`, `render.yaml` | High (Global CDN + API) |
| **Heroku** | PaaS | `Procfile`, `runtime.txt` | Medium |
| **Linux VM (Nginx + Gunicorn)** | Bare Metal / VPS | `gunicorn.conf.py`, Nginx config | Enterprise Production |

---

## 1. One-Command Docker Setup

```bash
# Clone repository
git clone https://github.com/your-username/Business-analytics.git
cd Business-analytics

# Build and start containerized application
docker-compose up --build
```

Access the application at `http://localhost:5000`.

---

## 2. Render Deployment (`render.yaml`)

1. Connect your GitHub repository to Render.
2. Select **New Blueprint Instance**.
3. Point Render to `render.yaml`. Render automatically provisions:
   - Python 3.11 web service executing `gunicorn -c gunicorn.conf.py backend.app:app`.
   - Static React site serving frontend assets.

---

## 3. Vercel Frontend Deployment (`vercel.json`)

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Vercel automatically detects `vercel.json` and builds the SPA using `frontend/package.json`.
4. Set the environment variable:
   `REACT_APP_API_URL=https://your-render-backend-url.onrender.com`

---

## 4. Production Gunicorn + Nginx Setup (Ubuntu/Debian)

### Install Dependencies
```bash
sudo apt update && sudo apt install -y python3-pip python3-venv nginx
```

### Setup Backend Service
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt gunicorn

# Test Gunicorn startup
gunicorn -c gunicorn.conf.py backend.app:app
```

### Configure Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name analytics.yourdomain.com;

    location / {
        root /var/www/business-analytics/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
