import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

unit = sales.groupby("Product_Category")["Unit_Price"].sum()

print("="*50)
print("Unit price Analysis")
print("="*50)

print(unit)