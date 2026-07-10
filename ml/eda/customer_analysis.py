import pandas as pd

sales=pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

customer = sales.groupby("Customer_Type").agg(
	Total_Sales = ("Sales_Amount","sum"),
	Customers = ("Customer_Type","count") 
)

print("="*50)
print("Customer Analysis")
print("="*50)

print(customer)