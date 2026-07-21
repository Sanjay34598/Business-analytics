import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales_processed.csv"))

sales["Churn"] = (
	sales["Profit"]<0
).astype(int)

x = sales[
	[
		"Quantity_Sold",
        "Discount",
        "Customer_Type",
        "Sales_Channel",
        "Region",
        "Month"
	]
]

y = sales["Churn"]

x_train , x_test , y_train , y_test = train_test_split(
	x,
	y,
	test_size=0.2,
	random_state=42
)

model = DecisionTreeClassifier(
	random_state=42
)

model.fit(x_train,y_train)

prediction = model.predict(x_test)
result = x_test.copy()

result["Actual"] = y_test.values
result["Prediction"] = prediction

print(result.head())

result.to_csv(
	os.path.join(os.environ["ANALYSIS_DIR"], "processed", "churn_prediction.csv"),
    index = False
)

import joblib

joblib.dump(model, os.path.join(os.environ["ANALYSIS_DIR"], "models", "churn_model.pkl"))

print(" Prediction Completed Succesfully")