import pandas as pd
import matplotlib.pyplot as plt

prediction = pd.read_csv("ml/data/processed/churn_prediction.csv")

prediction["Prediction"].value_counts().plot(
	kind="bar"
)

plt.title("Churn Prediction chart")
plt.xlabel("Predictions")
plt.ylabel("Customers")
plt.tight_layout()

plt.show()