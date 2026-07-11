import pandas as pd
import matplotlib.pyplot as plt

rules = pd.read_csv(
    "ml/data/processed/association_rules.csv"
)

plt.figure(figsize=(8,5))

plt.scatter(
    rules["support"],
    rules["confidence"]
)

plt.xlabel("Support")
plt.ylabel("Confidence")
plt.title("Association Rules")

plt.tight_layout()
plt.show()