import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd
import matplotlib.pyplot as plt

recommend = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "recommendations.csv"))

plt.figure(figsize=(8,5))

plt.bar(
	recommend["Product_Category"],
	recommend["Average_Profit"]
)
plt.title("Product Recommendation")
plt.xlabel("category")
plt.ylabel("Average profit")

plt.tight_layout()
plt.show()