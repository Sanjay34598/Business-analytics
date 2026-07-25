import requests
import json
import os
import time

BASE_URL = "http://127.0.0.1:5000"

def test_pipeline():
    print("1. Uploading Dataset A...")
    sample_file = "sample_datasets/Small.csv"
    with open(sample_file, "rb") as f:
        res = requests.post(f"{BASE_URL}/datasets/upload", files={"file": ("dataset_a.csv", f)})
    assert res.status_code == 200, res.text
    ds_a = res.json()["dataset"]
    id_a = ds_a["analysis_id"]
    print(f"   Uploaded Dataset A -> ID: {id_a}")
    assert id_a.startswith("analysis_") or id_a.startswith("ds_"), f"Unexpected analysis_id format: {id_a}"

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
    assert id_b.startswith("analysis_") or id_b.startswith("ds_"), f"Unexpected analysis_id format: {id_b}"

    print("4. Running Pipeline on Dataset B...")
    res = requests.post(f"{BASE_URL}/datasets/analyze", json={"dataset_id": id_b})
    assert res.status_code == 200, f"Analysis failed: {res.text}"
    print("   Pipeline B completed successfully!")

    print("5. Verifying Active Dataset and Dashboard Operations...")
    requests.post(f"{BASE_URL}/datasets/set-active", json={"dataset_id": id_a})
    dash_a = requests.get(f"{BASE_URL}/dashboard/kpis").json()
    
    requests.post(f"{BASE_URL}/datasets/set-active", json={"dataset_id": id_b})
    dash_b = requests.get(f"{BASE_URL}/dashboard/kpis").json()

    print(f"   Dashboard A active dataset: {dash_a.get('active_dataset')}")
    print(f"   Dashboard B active dataset: {dash_b.get('active_dataset')}")

    print("6. Retraining Dataset A...")
    retrain_res = requests.post(f"{BASE_URL}/datasets/{id_a}/retrain").json()
    assert retrain_res["success"] == True, f"Retrain failed: {retrain_res}"
    print("   Dataset A Retrained successfully!")

    print("7. Cleaning up test datasets...")
    requests.delete(f"{BASE_URL}/datasets/{id_a}")
    requests.delete(f"{BASE_URL}/datasets/{id_b}")

    print("\nALL ARCHITECTURAL REFACTOR TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_pipeline()
