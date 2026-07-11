import pandas as pd
sales = pd.read_csv("ml/data/processed/sales_processed.csv")

recommend = (
	sales.groupby("Product_Category").agg(
		Average_Profit = ("Profit","mean"),
		Average_Sales = ("Sales_Amount","mean"),
		Total_Sold = ("Quantity_Sold","sum")
	)
)

recommend = recommend.sort_values(
	by="Average_Profit",
	ascending=False
) 

print("="*60)
print("Top Recommended product")
print("="*60)

print(recommend)

recommend.to_csv(
	"ml/data/processed/product_recommend.csv"
)

print("Saved Succesfully")