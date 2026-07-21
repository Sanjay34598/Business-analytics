import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import json
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales.csv"))

x = sales[
	[
		"Quantity_Sold",
		"Unit_Price",
		"Profit",
		"Discount",
		"Month",
		"Region",
		"Product_Category",
		"Sales_Channel",
		"Customer_Type"
	]
]

y = sales["Sales_Amount"]

x_train , x_test , y_train , y_test = train_test_split(
	x,
	y,
	test_size=0.2,
	random_state=42
) 

model = LinearRegression()

model.fit(x_train,y_train)

prediction = model.predict(x_test)
forecast = x_test.copy()

forecast["Actual_Sales"] = y_test.values
forecast["Predicted_Sales"] = prediction

print(forecast.head())

forecast.to_csv(
	os.path.join(os.environ["ANALYSIS_DIR"], "processed", "forecast.csv"),
	index = False
)

import os
import joblib

joblib.dump(model, os.path.join(os.environ["ANALYSIS_DIR"], "models", f"forecast_{json.load(open(os.path.join(os.environ['ANALYSIS_DIR'], 'metadata.json')))['model_version']}.pkl"))

print("Forecast completed Succesfully")