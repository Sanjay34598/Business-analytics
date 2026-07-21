import os
import pandas as pd 
import matplotlib.pyplot as plt

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])

sales["Year"] = sales["Sale_Date"].dt.year
sales["Month"] = sales["Sale_Date"].dt.month
sales["Month_Name"] = sales["Sale_Date"].dt.month_name()
sales["Quarter"] = sales["Sale_Date"].dt.quarter
sales["Day"] = sales["Sale_Date"].dt.day
sales["Day_Name"] = sales["Sale_Date"].dt.day_name()
sales["Weekday"]=sales["Sale_Date"].dt.weekday
sales["Is_Weekend"] = sales["Weekday"].apply(lambda x: 1 if x >=5 else 0)

print(sales.head())