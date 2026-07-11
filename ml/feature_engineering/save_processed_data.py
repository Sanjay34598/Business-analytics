import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

sales["Sale_Date"]=pd.to_datetime(sales["Sale_Date"])

sales["Year"] = sales["Sale_Date"].dt.year
sales["Month"] = sales["Sale_Date"].dt.month
sales["Quarter"] = sales["Sale_Date"].dt.quarter

sales["Profit"]=sales["Sales_Amount"]-(
	sales["Unit_Cost"]*sales["Quantity_Sold"]
)

sales["Profit_Margin"]=(
	sales["Profit"]/sales["Sales_Amount"]
) * 100

encoder = LabelEncoder()

for column in [
	"Customer_Type",
	"Payment_Method",
	"Sales_Channel",
	"Region",
	"Product_Category",
	"Sales_Rep",
]:
	sales[column]=encoder.fit_transform(sales[column])

sales.to_csv(
	"ml/data/processed/sales_processed.csv",
    index = False
)

print("Processed dataset saved Successfully")
