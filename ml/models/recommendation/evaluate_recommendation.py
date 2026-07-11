import pandas as pd

recommend = pd.read_csv("ml/data/processed/product_recommend.csv")

print("Recomendation Summary")

print("Total Categories :",len(recommend))

print("highest profit category")
print(recommend.iloc[0])

print("loweset profit category ")
print(recommend.iloc[-1])