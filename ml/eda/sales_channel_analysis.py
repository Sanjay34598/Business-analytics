import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")
channel = sales.groupby("Sales_Channel").agg(
	Total_Sales=("Sales_Amount","sum"),
	Orders = ("Sales_Channel","count")
)

print("="*50)
print("Sales Channel Analysis")
print("="*50)

print(channel)