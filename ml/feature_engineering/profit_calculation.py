import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv"))

sales["Profit"] = sales["Sales_Amount"] - (
    sales["Unit_Cost"] * sales["Quantity_Sold"]
)

print(sales[["Sales_Amount","Unit_Cost","Profit","Quantity_Sold"]].head())

print("Average Sales")
print(sales["Profit"].mean())

print("Maximum Sales")
print(sales["Profit"].max())

print("Minmum Sales")
print(sales["Profit"].min())