import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales_processed.csv"))

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
	os.path.join(os.environ["ANALYSIS_DIR"], "processed", "forecast_results.csv"),
	index = False
)

import os
import joblib

joblib.dump(model, os.path.join(os.environ["ANALYSIS_DIR"], "models", "forecast_model.pkl"))

print("Forecast completed Succesfully")