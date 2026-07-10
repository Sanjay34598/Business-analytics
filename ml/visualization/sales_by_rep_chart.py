import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv("ml/data/cleaned/sales_data_cleaned.csv")

rep = sales.groupby("Sales_Rep")["Sales_Amount"].sum()

rep.plot(kind="bar")

plt.title("Sales By Reps")
plt.tight_layout

plt.show()