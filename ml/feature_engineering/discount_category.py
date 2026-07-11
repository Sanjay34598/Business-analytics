import pandas as pd

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

bins = [-0.01,0.00,0.10,0.20,1.00]

labels =[
	"No Discount",
	"Low",
	"Medium",
	"High"
]

sales["Discount_Category"] = pd.cut(
	sales["Discount"],
	bins=bins,
	labels=labels
)

print(
	sales [
		["Discount","Discount_Category"]
	].head(20)
)