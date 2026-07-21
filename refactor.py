import os

replacements = {
    '"ml/data/raw/sales/sales_data.csv"': 'os.path.join(os.environ["ANALYSIS_DIR"], "uploaded.csv")',
    '"ml/data/cleaned/sales_data_cleaned.csv"': 'os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv")',
    '"ml/data/processed/sales_processed.csv"': 'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales_processed.csv")',
    '"ml/data/processed/forecast_results.csv"': 'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "forecast_results.csv")',
    '"ml/data/processed/churn_prediction.csv"': 'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "churn_prediction.csv")',
    '"ml/data/processed/product_recommend.csv"': 'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "product_recommend.csv")',
    '"ml/data/processed/sales_clustered.csv"': 'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales_clustered.csv")',
    '"ml/data/processed/customer_segment_summary.csv"': 'os.path.join(os.environ["ANALYSIS_DIR"], "processed", "customer_segment_summary.csv")',
    '"ml/data/models/forecast_model.pkl"': 'os.path.join(os.environ["ANALYSIS_DIR"], "models", "forecast_model.pkl")',
    '"ml/data/models/churn_model.pkl"': 'os.path.join(os.environ["ANALYSIS_DIR"], "models", "churn_model.pkl")',
    '"ml/data/models/recommendation_model.pkl"': 'os.path.join(os.environ["ANALYSIS_DIR"], "models", "recommendation_model.pkl")',
    '"ml/data/reports/metrics.json"': 'os.path.join(os.environ["ANALYSIS_DIR"], "reports", "metrics.json")',
    '"report.pdf"': 'os.path.join(os.environ["ANALYSIS_DIR"], "reports", "report.pdf")'
}

for root, _, files in os.walk('ml'):
    for file in files:
        if file.endswith('.py') and file != 'run_pipeline.py' and file != 'utils.py':
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            modified = False
            for k, v in replacements.items():
                if k in content:
                    content = content.replace(k, v)
                    modified = True
                
                # Check for single quote versions
                kq = k.replace('"', "'")
                if kq in content:
                    content = content.replace(kq, v)
                    modified = True
                    
            if modified:
                if 'import os' not in content:
                    content = 'import os\n' + content
                # Clean up os.makedirs logic that used static paths
                content = content.replace('os.makedirs("ml/data/reports", exist_ok=True)', '')
                content = content.replace('os.makedirs("ml/data/models", exist_ok=True)', '')
                content = content.replace('os.makedirs("ml/data/processed", exist_ok=True)', '')
                content = content.replace('os.makedirs("ml/data/cleaned", exist_ok=True)', '')
                
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f'Updated {filepath}')
