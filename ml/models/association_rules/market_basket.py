import os
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales_processed.csv"))

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
