import pandas as pd
rules = pd.read_csv("ml/data/processed/association_rules.csv")

print("Association rules Summary")
print("Total sales: ",len(rules))

print("Top 5 Rules")
print(
	rules[
		[
            "antecedents",
            "consequents",
            "support",
            "confidence",
            "lift"
		]
	].head()
)