import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

print("="*50)
print("Basic Statistics")
print("="*50)

print(sales.describe())