from flask import Flask
from flask_cors import CORS

from routes.sales import sales_bp
from routes.forecast import forecast_bp
from routes.churn import churn_bp
from routes.recommendation import recommendation_bp
from routes.datasets import datasets_bp
from routes.dashboard import dashboard_bp
from routes.reports import reports_bp

app = Flask(__name__)

# Allow requests from the React development server
CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})

app.register_blueprint(dashboard_bp)
app.register_blueprint(sales_bp)
app.register_blueprint(forecast_bp)
app.register_blueprint(churn_bp)
app.register_blueprint(recommendation_bp)
app.register_blueprint(datasets_bp)
app.register_blueprint(reports_bp)

if __name__ == "__main__":
    app.run(debug=True)