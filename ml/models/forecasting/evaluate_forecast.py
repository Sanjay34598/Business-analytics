import pandas as pd
from sklearn.model_selection  import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
	mean_absolute_error,
	mean_squared_error,
	r2_score
)

sales = pd.read_csv("ml/data/processed/sales_processed.csv")

x = sales[
	[
		"Quantity_Sold",
		"Unit_Price",
		"Discount",
		"Profit"
	]
]

y = sales["Sales_Amount"]

x_train , x_test , y_train , y_test = train_test_split(
	x,
	y,
	test_size=0.2,
	random_state=42
)

import joblib
model = joblib.load("ml/data/models/forecast_model.pkl")

prediction = model.predict(x_test)

print("="*60)
print("Model evaluation")
print("="*60)

mae = mean_absolute_error(y_test,prediction)
mse = mean_squared_error(y_test,prediction)
r2 = r2_score(y_test,prediction)

print("MAE :", mae)
print("MSE :", mse)
print("r2 score :", r2)

import os
import json
os.makedirs("ml/data/reports", exist_ok=True)

metrics = {}
if os.path.exists("ml/data/reports/metrics.json"):
    with open("ml/data/reports/metrics.json", "r") as f:
        metrics = json.load(f)

metrics["forecast"] = {
    "MAE": mae,
    "MSE": mse,
    "R2": r2
}

with open("ml/data/reports/metrics.json", "w") as f:
    json.dump(metrics, f, indent=4)