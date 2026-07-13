from flask import Flask

from backend.routes.sales import sales_bp
from backend.routes.forecast import forecast_bp
from backend.routes.churn import churn_bp
from backend.routes.recommendation import recommend_bp

app = Flask(__name__)

app.register_blueprint(sales_bp)
app.register_blueprint(forecast_bp)
app.register_blueprint(churn_bp)
app.register_blueprint(recommend_bp)

if __name__ == "__main__":
    app.run(debug=True)