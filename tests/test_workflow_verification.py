import requests
import json
import os
import shutil

BASE_URL = "http://127.0.0.1:5000"

def test_workflow():
    print("--- 1. Testing Validation Failure Responses ---")
    
    # Test 1.1: Dataset not in registry
    res = requests.post(f"{BASE_URL}/datasets/analyze", json={"dataset_id": "non_existent_999"})
    print(f"Non-existent dataset response ({res.status_code}):", res.json())
    assert res.status_code == 404
    assert res.json().get("reason") == "dataset not found in registry"
    print("[OK] 'dataset not found in registry' validation passed!")

    # Test 1.2: Analysis directory missing
    reg_path = "backend/data/datasets.json"
    with open(reg_path, "r") as f:
        registry = json.load(f)
    
    fake_id = "analysis_fake_dir"
    registry.append({"id": fake_id, "analysis_id": fake_id, "name": "fake", "status": "Uploaded"})
    with open(reg_path, "w") as f:
        json.dump(registry, f, indent=4)

    try:
        res = requests.post(f"{BASE_URL}/datasets/analyze", json={"dataset_id": fake_id})
        print(f"Missing analysis directory response ({res.status_code}):", res.json())
        assert res.status_code == 404
        assert res.json().get("reason") == "analysis directory missing"
        print("[OK] 'analysis directory missing' validation passed!")

        # Test 1.3: uploaded.csv missing
        fake_dir = f"backend/data/analysis_runs/{fake_id}"
        os.makedirs(os.path.join(fake_dir, "dataset"), exist_ok=True)
        res = requests.post(f"{BASE_URL}/datasets/analyze", json={"dataset_id": fake_id})
        print(f"Missing uploaded.csv response ({res.status_code}):", res.json())
        assert res.status_code == 404
        assert res.json().get("reason") == "uploaded.csv missing"
        print("[OK] 'uploaded.csv missing' validation passed!")

    finally:
        # Clean up fake entry
        registry = [d for d in registry if d.get("id") != fake_id]
        with open(reg_path, "w") as f:
            json.dump(registry, f, indent=4)
        if os.path.exists(f"backend/data/analysis_runs/{fake_id}"):
            shutil.rmtree(f"backend/data/analysis_runs/{fake_id}")

    print("\n--- 2. Testing End-to-End Dataset Lifecycle ---")
    
    sample_file = "ml/data/raw/sales/sales_data.csv"
    with open(sample_file, "rb") as f:
        res = requests.post(f"{BASE_URL}/datasets/upload", files={"file": ("test_lifecycle.csv", f)})
    
    assert res.status_code == 200, res.text
    ds_data = res.json()["dataset"]
    ds_id = ds_data["analysis_id"]
    print(f"[OK] Upload: Dataset uploaded with ID: {ds_id}, status: {ds_data['status']}")
    assert ds_data["status"] == "Uploaded"

    # Check registry
    datasets = requests.get(f"{BASE_URL}/datasets").json()
    match = next((d for d in datasets if d["id"] == ds_id), None)
    assert match is not None
    print(f"[OK] Registry: Verified dataset {ds_id} present in registry with status: {match['status']}")

    # Analyze dataset
    print(f"Running ML Analysis for {ds_id}...")
    res = requests.post(f"{BASE_URL}/datasets/analyze", json={"dataset_id": ds_id})
    assert res.status_code == 200, f"Analysis failed: {res.text}"
    analyze_json = res.json()
    assert analyze_json.get("success") == True
    print(f"[OK] Training: Pipeline executed successfully! Output metrics:", analyze_json.get("metrics"))

    # Verify outputs
    proc_dir = f"backend/data/analysis_runs/{ds_id}/processed"
    for req_file in ["sales.csv", "forecast.csv", "customers.csv", "recommendations.csv"]:
        assert os.path.exists(os.path.join(proc_dir, req_file))
    print(f"[OK] Outputs: All processed output CSVs verified on disk!")

    # Verify Dashboard API
    dash_res = requests.get(f"{BASE_URL}/api/dashboard?analysis_id={ds_id}")
    assert dash_res.status_code == 200
    dash_json = dash_res.json()
    assert dash_json["analysis"]["analysis_id"] == ds_id
    assert dash_json["analysis"]["status"] == "Completed"
    assert len(dash_json["sales"]) > 0
    print(f"[OK] Dashboard: Dashboard API returned complete visualization metrics for {ds_id}!")

    # Verify Dataset Status in list
    datasets = requests.get(f"{BASE_URL}/datasets").json()
    match = next((d for d in datasets if d["id"] == ds_id), None)
    assert match["status"] == "Completed"
    print(f"[OK] Dataset Status: Dataset status updated to 'Completed' in registry!")

    print("\n=======================================================")
    print("ALL VERIFICATION CHECKS PASSED PERFECTLY!")
    print("=======================================================")

if __name__ == "__main__":
    test_workflow()
