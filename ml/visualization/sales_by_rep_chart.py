import os
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

rep = sales.groupby("Sales_Rep")["Sales_Amount"].sum()

rep.plot(kind="bar")

plt.title("Sales By Reps")
plt.tight_layout

plt.show()