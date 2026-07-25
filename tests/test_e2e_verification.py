import requests
import json
import os
import time

BASE_URL = "http://127.0.0.1:5000"

def test_pipeline():
    print("1. Uploading Dataset A...")
    sample_file = "ml/data/raw/sales/sales_data.csv"
    with open(sample_file, "rb") as f:
        res = requests.post(f"{BASE_URL}/datasets/upload", files={"file": ("dataset_a.csv", f)})
    assert res.status_code == 200, res.text
    ds_a = res.json()["dataset"]
    id_a = ds_a["analysis_id"]
    print(f"   Uploaded Dataset A -> ID: {id_a}")
    assert id_a == "analysis_001", f"Expected analysis_001 but got {id_a}"

    print("2. Running Pipeline on Dataset A...")
    res = requests.post(f"{BASE_URL}/datasets/analyze", json={"dataset_id": id_a})
    assert res.status_code == 200, f"Analysis failed: {res.text}"
    print("   Pipeline A completed successfully!")

    print("3. Uploading Dataset B...")
    with open(sample_file, "rb") as f:
        res = requests.post(f"{BASE_URL}/datasets/upload", files={"file": ("dataset_b.csv", f)})
    assert res.status_code == 200, res.text
    ds_b = res.json()["dataset"]
    id_b = ds_b["analysis_id"]
    print(f"   Uploaded Dataset B -> ID: {id_b}")
    assert id_b == "analysis_002", f"Expected analysis_002 but got {id_b}"

    print("4. Running Pipeline on Dataset B...")
    res = requests.post(f"{BASE_URL}/datasets/analyze", json={"dataset_id": id_b})
    assert res.status_code == 200, f"Analysis failed: {res.text}"
    print("   Pipeline B completed successfully!")

    print("5. Verifying Dashboard API for Dataset A vs Dataset B...")
    dash_a = requests.get(f"{BASE_URL}/api/dashboard?analysis_id={id_a}").json()
    dash_b = requests.get(f"{BASE_URL}/api/dashboard?analysis_id={id_b}").json()

    assert dash_a["analysis"]["analysis_id"] == id_a
    assert dash_b["analysis"]["analysis_id"] == id_b
    print("   Dashboard endpoints returned isolated datasets!")

    print("6. Retraining Dataset A...")
    retrain_res = requests.post(f"{BASE_URL}/datasets/{id_a}/retrain").json()
    assert retrain_res["success"] == True
    
    meta_a = requests.get(f"{BASE_URL}/api/dashboard?analysis_id={id_a}").json()["metadata"]
    print(f"   Dataset A Retrained Model Version: {meta_a.get('model_version')}")
    assert meta_a.get("model_version") == "v2", f"Expected v2 but got {meta_a.get('model_version')}"

    print("\nALL ARCHITECTURAL REFACTOR TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_pipeline()
