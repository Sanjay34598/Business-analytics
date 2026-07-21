import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd 

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "uploaded.csv"))

#convert sales_date to date time
sales["Sale_Date"] = pd.to_datetime(sales["Sale_Date"])

#save cleaned dataset to csv
sales.to_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv"), index=False)

print("Cleaned dataset saved to ml/data/cleaned/sales_data_cleaned.csv")