import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

encoder = LabelEncoder()

sales["Region"] = encoder.fit_transform(
	sales["Region"]
)

print(sales["Region"].head())
print(encoder.classes_)