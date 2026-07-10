import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

print("total sales")
print(sales["Sales_Amount"].sum())

print()

print("average sales")
print(sales["Sales_Amount"].mean())

print()

print("Highest sale")
print(sales["Sales_Amount"].max())

print()

print("Lowest sale")
print(sales["Sales_Amount"].min())