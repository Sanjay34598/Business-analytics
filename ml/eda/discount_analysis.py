import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

discount = sales.groupby("Discount")["Sales_Amount"].sum()

print("="*50)
print("Discount Analysis")
print("="*50)

print(discount)