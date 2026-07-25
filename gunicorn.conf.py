import os

# Server Socket Configuration
bind = f"0.0.0.0:{os.getenv('PORT', '5000')}"
backlog = 2048

# Worker Processes
workers = int(os.getenv("GUNICORN_WORKERS", "4"))
worker_class = "sync"
worker_connections = 1000
timeout = 120
keepalive = 5

# Logging Configurations
accesslog = "-"
errorlog = "-"
loglevel = os.getenv("LOG_LEVEL", "info").lower()
capture_output = True
enable_stdio_inheritance = True

# Process Naming
proc_name = "business-analytics-backend"
