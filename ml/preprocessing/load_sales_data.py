import pandas as pd

sales_df = pd.read_csv("ml/data/raw/sales/sales_data.csv")

print(sales_df.head())

print("\nRows and Columns:")
print(sales_df.shape)

print("\nColumn Names:")
print(sales_df.columns)
