import pandas as pd

sales = pd.read_csv("ml/data/raw/sales/sales_data.csv")

print("First 5 Rows")
print(sales.head())

print("\nDataset Shape")
print(sales.shape)

print("\nColumn Names")
print(sales.columns)

print("\nDataset Information")
print(sales.info())