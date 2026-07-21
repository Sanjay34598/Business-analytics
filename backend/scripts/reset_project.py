import os
import shutil
import json

def reset_project():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    dirs_to_clean = [
        os.path.join(base_dir, "backend", "data", "uploads"),
        os.path.join(base_dir, "backend", "data", "analysis_runs"),
        os.path.join(base_dir, "backend", "data", "cache"),
        os.path.join(base_dir, "ml", "data", "processed"),
        os.path.join(base_dir, "ml", "data", "cleaned"),
        os.path.join(base_dir, "ml", "data", "models"),
        os.path.join(base_dir, "ml", "data", "reports"),
    ]
    
    files_to_clean = [
        os.path.join(base_dir, "backend", "data", "datasets.json"),
        os.path.join(base_dir, "backend", "data", "config.json"),
    ]
    
    print("Cleaning directories...")
    for d in dirs_to_clean:
        if os.path.exists(d):
            shutil.rmtree(d, ignore_errors=True)
            print(f"Removed: {d}")
        os.makedirs(d, exist_ok=True)
        print(f"Recreated: {d}")
        
    print("Cleaning registry & config files...")
    for f in files_to_clean:
        if os.path.exists(f):
            os.remove(f)
            print(f"Removed: {f}")
            
    # Reset registry file with empty list
    registry_file = os.path.join(base_dir, "backend", "data", "datasets.json")
    with open(registry_file, "w") as f:
        json.dump([], f, indent=4)
    print(f"Reset: {registry_file}")
    
    # Reset config file
    config_file = os.path.join(base_dir, "backend", "data", "config.json")
    with open(config_file, "w") as f:
        json.dump({"active_analysis": None}, f, indent=4)
    print(f"Reset: {config_file}")

    print("\nProject reset completed successfully!")

if __name__ == "__main__":
    reset_project()
