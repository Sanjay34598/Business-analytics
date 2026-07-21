import os
import pandas as pd
import matplotlib.pyplot as plt

forecast =pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "processed", "forecast_results.csv"))

plt.figure(figsize=(10,5))

plt.plot(
	forecast["Actual_Sales"].values[:50],
	label = "Actual"
)

plt.plot(
	forecast["Predicted_Sales"].values[:50],
	label = "Predicted"
)

plt.title("Acutal vs Predicted Sales")
plt.xlabel("Samples")
plt.ylabel("Sales")

plt.legend()
plt.tight_layout()
plt.show()