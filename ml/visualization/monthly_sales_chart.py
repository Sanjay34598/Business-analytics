import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv"))
sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])

sales["Month"] = sales["Sale_Date"].dt.month_name()

month = sales.groupby("Month")["Sales_Amount"].sum()

month.plot(kind="line",marker="o")

plt.title("Monthly Sales")
plt.tight_layout
plt.show()