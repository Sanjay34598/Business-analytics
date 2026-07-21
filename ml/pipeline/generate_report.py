import os
analysis_dir = os.environ.get("ANALYSIS_DIR", "")
if analysis_dir:
    for sub in ["dataset", "processed", "models", "reports", "reports/charts", "logs"]:
        os.makedirs(os.path.join(analysis_dir, sub), exist_ok=True)

import json
import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime


metrics_path = os.path.join(os.environ["ANALYSIS_DIR"], "reports", "metrics.json")

metrics = {}
if os.path.exists(metrics_path):
    with open(metrics_path, "r") as f:
        metrics = json.load(f)

pdf_path = "ml/data/reports/report.pdf"
c = canvas.Canvas(pdf_path, pagesize=letter)
width, height = letter

c.setFont("Helvetica-Bold", 16)
c.drawString(50, height - 50, "Machine Learning Validation Report")
c.setFont("Helvetica", 10)
c.drawString(50, height - 70, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
c.drawString(50, height - 85, f"Dataset ID: {os.environ.get('DATASET_ID', 'Unknown')}")

y = height - 120

def draw_section(title, data_dict):
    global y
    if y < 100:
        c.showPage()
        y = height - 50
        
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, title)
    y -= 20
    
    c.setFont("Helvetica", 10)
    for k, v in data_dict.items():
        if isinstance(v, list):
            c.drawString(60, y, f"{k}:")
            y -= 15
            for row in v:
                c.drawString(70, y, str(row))
                y -= 15
        else:
            c.drawString(60, y, f"{k}: {v}")
            y -= 15
    y -= 15

if "forecast" in metrics:
    draw_section("Sales Forecast Metrics", metrics["forecast"])
    
if "churn" in metrics:
    draw_section("Customer Churn Metrics", metrics["churn"])
    
if "recommendation" in metrics:
    draw_section("Recommendation Engine Metrics", metrics["recommendation"])

c.save()

print("="*60)
print("Report generated successfully: report.pdf")
print("="*60)
