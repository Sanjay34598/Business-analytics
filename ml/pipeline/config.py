import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import os
from pathlib import Path

PROJECT_ROOT	= Path(__file__).resolve().parents[2]

RAW_DATA = PROJECT_ROOT / "ml/data/raw/sales_data.csv"
CLEANED_DATA = PROJECT_ROOT / os.path.join(os.environ["ANALYSIS_DIR"], "dataset", "cleaned.csv")
PROCESSED_DATA = PROJECT_ROOT / os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales.csv")

REPORTS = PROJECT_ROOT / "ml/reports"