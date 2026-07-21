import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

encoder = LabelEncoder()

sales["Customer_Type"] = encoder.fit_transform(
	sales["Customer_Type"]
)
print(sales["Customer_Type"].head())
print(encoder.classes_)