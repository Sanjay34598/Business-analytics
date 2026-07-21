import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv"))

sales["Sale_Date"]=pd.to_datetime(sales["Sale_Date"])

sales["Year"] = sales["Sale_Date"].dt.year
sales["Month"] = sales["Sale_Date"].dt.month
sales["Quarter"] = sales["Sale_Date"].dt.quarter

sales["Profit"]=sales["Sales_Amount"]-(
	sales["Unit_Cost"]*sales["Quantity_Sold"]
)

sales["Profit_Margin"]=(
	sales["Profit"]/sales["Sales_Amount"]
) * 100

encoder = LabelEncoder()

for column in [
	"Customer_Type",
	"Payment_Method",
	"Sales_Channel",
	"Region",
	"Product_Category",
	"Sales_Rep",
]:
	sales[column]=encoder.fit_transform(sales[column])

sales.to_csv(
	os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales.csv"),
    index = False
)

print("Processed dataset saved Successfully")
