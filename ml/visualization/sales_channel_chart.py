import os
import pandas as pd
import matplotlib.pyplot as plt

sales = pd.read_csv(os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv"))

channel = sales["Sales_Channel"].value_counts()

channel.plot(kind="pie",autopct="%1.1f%%")

plt.ylabel("")
plt.title("Sales Channel ")

plt.show()