import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv"))

product = sales.groupby("Product_Category")["Sales_Amount"].sum()

product.plot(kind="bar")

plt.title("Product charts")
plt.xlabel("Category")
plt.ylabel("Sales")
plt.tight_layout()

plt.show()