import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

quantity = sales.groupby("Product_Category")["Quantity_Sold"].sum()

print("="*50)
print("Product Analysis")
print("="*50)

print(quantity)