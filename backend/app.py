import sys
import os
import logging
import datetime
from flask import Flask, jsonify
from flask_cors import CORS

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Ensure logs directory exists
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
logs_dir = os.path.join(project_root, "logs")
os.makedirs(logs_dir, exist_ok=True)
log_file_path = os.path.join(logs_dir, "app.log")

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler(log_file_path, encoding="utf-8"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

from routes.sales import sales_bp
from routes.forecast import forecast_bp
from routes.churn import churn_bp
from routes.recommendation import recommendation_bp
from routes.datasets import datasets_bp
from routes.dashboard import dashboard_bp
from routes.reports import reports_bp

app = Flask(__name__)

# Configurable CORS origins
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
CORS(app, resources={r"/*": {"origins": cors_origins}})

app.register_blueprint(dashboard_bp)
app.register_blueprint(sales_bp)
app.register_blueprint(forecast_bp)
app.register_blueprint(churn_bp)
app.register_blueprint(recommendation_bp)
app.register_blueprint(datasets_bp)
app.register_blueprint(reports_bp)

@app.route("/health", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "business-analytics-api",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }), 200

# Global Error Handler returning structured JSON
@app.errorhandler(Exception)
def handle_global_exception(e):
    logger.error(f"Global Exception Handled: {str(e)}", exc_info=True)
    status_code = getattr(e, "code", 500)
    return jsonify({
        "success": False,
        "message": getattr(e, "description", str(e)),
        "reason": type(e).__name__,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }), status_code

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    logger.info(f"Starting Business Analytics Flask Server on {host}:{port} (debug={debug})")
    app.run(host=host, port=port, debug=debug)