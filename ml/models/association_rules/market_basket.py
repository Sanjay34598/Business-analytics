import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales.csv"))

basket = pd.get_dummies(sales["Product_Category"])

frequent = apriori(
	basket,
	min_support=0.20,
	use_colnames=True
)

rules = association_rules(
	frequent,
	min_threshold=0.50,
	metric="confidence"
)

print("Association Rules")
print(rules)

rules.to_csv(
	"ml/data/processed/association_rules.csv",
	index= False
)

print("Rules Saved Succesfully")
