import pandas as pd

sales = pd.read_csv("ml/data/processed/sales_clustered.csv")

print("="*50)
print("Cluster summary")
print("="*50)

summary = sales.groupby("Customer_Segment").agg(
	Customers = ("Customer_Segment","count"),
	Average_Sales = ("Sales_Amount","mean"),
	Average_Profit=("Profit","mean"),
	Average_Quantity=("Quantity_Sold","mean")
)

print(summary)

summary.to_csv(
	"ml/data/processed/customer_segment_summary.csv"
)

print("Summary Saved Succesfully")