import os
import json

def get_version(analysis_dir):
    meta_path = os.path.join(analysis_dir, "metadata.json")
    if os.path.exists(meta_path):
        try:
            with open(meta_path, "r") as f:
                data = json.load(f)
                return data.get("model_version", "v1")
        except Exception:
            pass
    return "v1"

replacements = {
    # Dataset uploaded / cleaned
    'os.path.join(os.environ["ANALYSIS_DIR"], "uploaded.csv")': 'os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "uploaded.csv")',
    'os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv")': 'os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv")',
    
    # Processed CSVs
    'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales_processed.csv")': 'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales.csv")',
    'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "forecast_results.csv")': 'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "forecast.csv")',
    'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "churn_prediction.csv")': 'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "customers.csv")',
    'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "product_recommend.csv")': 'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "recommendations.csv")',
    
    # Models with versioning
    'os.path.join(os.environ["ANALYSIS_DIR"], "models", "forecast_model.pkl")': 'os.path.join(os.environ["ANALYSIS_DIR"], "models", f"forecast_{json.load(open(os.path.join(os.environ[\'ANALYSIS_DIR\'], \'metadata.json\')))[\'model_version\']}.pkl")',
    'os.path.join(os.environ["ANALYSIS_DIR"], "models", "churn_model.pkl")': 'os.path.join(os.environ["ANALYSIS_DIR"], "models", f"churn_{json.load(open(os.path.join(os.environ[\'ANALYSIS_DIR\'], \'metadata.json\')))[\'model_version\']}.pkl")',
    'os.path.join(os.environ["ANALYSIS_DIR"], "models", "recommendation_model.pkl")': 'os.path.join(os.environ["ANALYSIS_DIR"], "models", f"recommendation_{json.load(open(os.path.join(os.environ[\'ANALYSIS_DIR\'], \'metadata.json\')))[\'model_version\']}.pkl")',
}

for root, _, files in os.walk('ml'):
    for file in files:
        if file.endswith('.py') and file != 'run_pipeline.py' and file != 'utils.py':
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            modified = False
            for k, v in replacements.items():
                if k in content:
                    content = content.replace(k, v)
                    modified = True
                    
            if modified:
                if 'import os' not in content:
                    content = 'import os\n' + content
                if 'import json' not in content and 'json.load' in content:
                    content = 'import json\n' + content
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated {filepath}')
