import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv"))

encoder = LabelEncoder()

sales["Sales_Channel"] = encoder.fit_transform(
	sales["Sales_Channel"]
)

print(sales["Sales_Channel"].head())
print(encoder.classes_)