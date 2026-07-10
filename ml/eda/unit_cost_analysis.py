import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

unit = sales.groupby("Product_Category")["Unit_Cost"].mean()

print("="*60)
print("Unit Cost analysis")
print("="*60)

print(unit)