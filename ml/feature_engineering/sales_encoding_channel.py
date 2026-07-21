import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

encoder = LabelEncoder()

sales["Sales_Channel"] = encoder.fit_transform(
	sales["Sales_Channel"]
)

print(sales["Sales_Channel"].head())
print(encoder.classes_)