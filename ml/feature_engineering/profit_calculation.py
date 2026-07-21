import os
import pandas as pd

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

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