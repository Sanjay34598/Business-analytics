import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

encoder = LabelEncoder()

sales["Payment_Method"]=encoder.fit_transform(
	sales["Payment_Method"]
)

print(sales["Payment_Method"].head())
print(encoder.classes_)