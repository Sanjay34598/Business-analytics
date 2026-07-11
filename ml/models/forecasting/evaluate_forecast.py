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

model = LinearRegression()

model.fit(x_train,y_train)

prediction = model.predict(x_test)

print("="*60)
print("Model evaluation")
print("="*60)

print("MAE :",mean_absolute_error(y_test,prediction))
print("MSE :",mean_squared_error(y_test,prediction))
print("r2 score :",r2_score(y_test,prediction))