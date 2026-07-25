# Troubleshooting & FAQs

This document provides solutions for common issues, error messages, and operational questions when running or deploying the **Business Analytics Platform**.

---

## 1. Backend & Connection Issues

### Issue: `ConnectionRefusedError [WinError 10061]` or `Failed to establish a new connection`
- **Cause**: The React frontend or test scripts are attempting to connect to the Flask backend on port `5000`, but the Flask server is not running.
- **Solution**:
  1. Open a terminal in the project root.
  2. Activate your virtual environment (`venv\Scripts\activate` or `source venv/bin/activate`).
  3. Start Flask: `python backend/app.py`.
  4. Ensure port `5000` is free and not blocked by local firewalls.

---

### Issue: `CORS Policy Blocked Request`
- **Cause**: React frontend URL (e.g. `http://localhost:3001`) is not allowed in Flask CORS origins.
- **Solution**:
  Check `backend/app.py` line 15:
  ```python
  CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})
  ```
  Update `.env` `CORS_ORIGINS` to match your frontend port.

---

## 2. Dataset Upload & Pipeline Execution Issues

### Issue: `400 Bad Request: Only CSV files are allowed`
- **Cause**: Uploaded file extension is not `.csv` or MIME-type is misidentified.
- **Solution**: Ensure your input file has a `.csv` extension and is UTF-8 encoded.

---

### Issue: `Pipeline Execution Failed: Required columns missing`
- **Cause**: Uploaded CSV lacks expected headers.
- **Solution**: Ensure your CSV includes standard headers:
  - `Order ID`
  - `Sale_Date`
  - `Customer ID`
  - `Product_Category`
  - `Sales_Amount`
  - `Quantity_Sold`
  - `Profit`
  Refer to `sample_datasets/README.md` for complete schema specifications.

---

### Issue: `FileNotFoundError: analysis_runs/<id>/summary.json not found`
- **Cause**: The pipeline failed prior to writing JSON output artifacts.
- **Solution**:
  1. Inspect Flask server console logs for Python stack trace.
  2. Run pipeline manually via terminal to see output:
     ```bash
     python ml/pipeline/run_pipeline.py --data sample_datasets/Small.csv --analysis-id debug_run
     ```

---

## 3. Frontend & Build Issues

### Issue: `Module not found: Can't resolve 'recharts'` or `react-router-dom`
- **Cause**: Missing Node modules in `frontend/`.
- **Solution**:
  ```bash
  cd frontend
  npm install
  ```

---

### Issue: UI Dashboard displaying blank graphs or missing KPI values
- **Cause**: Active dataset cache is invalid or corrupt.
- **Solution**:
  1. Navigate to **Datasets** page in UI.
  2. Upload a sample CSV (`sample_datasets/Medium.csv`).
  3. Click **Run Analysis** and wait for completion message.
  4. Alternatively, execute system reset script:
     ```bash
     python backend/scripts/reset_project.py
     ```

---

## 4. Retraining & Cache Invalidation

### Issue: Retraining does not update UI metrics
- **Cause**: Browser or backend memory cache serving stale results.
- **Solution**:
  - The backend invalidates LRU cache automatically when `POST /datasets/<id>/retrain` is called.
  - Perform a hard refresh in your browser (`Ctrl + Shift + R` or `Cmd + Shift + R`).
