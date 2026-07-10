import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")
sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])

sales["Month"] = sales["Sale_Date"].dt.month_name()

month = sales.groupby("Month")["Sales_Amount"].sum()

month.plot(kind="line",marker="o")

plt.title("Monthly Sales")
plt.tight_layout
plt.show()