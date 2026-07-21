import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

sales["Profit"] = sales["Sales_Amount"] - (
	sales["Unit_Cost"]*sales["Quantity_Sold"]
)
sales["Profit_Margin"] = (
	sales["Profit"]/sales["Sales_Amount"]
)*100

print(
	sales[
		["Sales_Amount","Profit","Profit_Margin"]
    ].head()
)