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

sales["Payment_Method"]=encoder.fit_transform(
	sales["Payment_Method"]
)

print(sales["Payment_Method"].head())
print(encoder.classes_)