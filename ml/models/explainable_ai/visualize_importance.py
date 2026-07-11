import pandas as pd
import matplotlib.pyplot as plt

importance = pd.read_csv(
    "ml/data/processed/feature_importance.csv"
)

plt.figure(figsize=(8,5))

plt.bar(
    importance["Feature"],
    importance["Importance"]
)

plt.xticks(rotation=45)

plt.title("Feature Importance")

plt.tight_layout()

plt.show()