import os
import pandas as pd 

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "uploaded.csv"))

#convert sales_date to date time
sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])

#save cleaned dataset to csv
sales.to_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"), index=False)

print("Cleaned dataset saved to ml/data/cleaned/sales_data_cleaned.csv")