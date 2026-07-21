import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd
import matplotlib.pyplot as plt

prediction = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "customers.csv"))

prediction["Prediction"].value_counts().plot(
	kind="bar"
)

plt.title("Churn Prediction chart")
plt.xlabel("Predictions")
plt.ylabel("Customers")
plt.tight_layout()

plt.show()