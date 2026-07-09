import pandas as pd 

sales = pd.read_csv("ml/data/raw/sales/sales_data.csv")

#convert sales_date to date time
sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])

#save cleaned dataset to csv
sales.to_csv("ml/data/cleaned/sales_data_cleaned.csv", index=False)

print("Cleaned dataset saved to ml/data/cleaned/sales_data_cleaned.csv")