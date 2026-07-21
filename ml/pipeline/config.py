import os
from pathlib import Path

PROJECT_ROOT	= Path(__file__).resolve().parents[2]

RAW_DATA = PROJECT_ROOT / "ml/data/raw/sales_data.csv"
CLEANED_DATA = PROJECT_ROOT / os.path.join(os.environ["ANALYSIS_DIR"], "cleaned.csv")
PROCESSED_DATA = PROJECT_ROOT / os.path.join(os.environ["ANALYSIS_DIR"], "processed", "sales_processed.csv")

REPORTS = PROJECT_ROOT / "ml/reports"