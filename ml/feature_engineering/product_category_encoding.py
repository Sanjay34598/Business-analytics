import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))
encoder = LabelEncoder()

sales["Product_Category"]=encoder.fit_transform(
	sales["Product_Category"]
)

print(sales["Product_Category"].head())
print(encoder.classes_)