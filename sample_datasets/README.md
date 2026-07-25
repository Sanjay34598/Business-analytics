# Sample Datasets

This directory contains standardized sample datasets for testing, demonstration, and evaluation of the **Business Analytics Platform**.

## Datasets Overview

| File | Rows | File Size | Description / Use Case |
|------|------|-----------|------------------------|
| `Small.csv` | ~100 | ~22 KB | Fast smoke testing, quick API verification, UI demonstration. |
| `Medium.csv` | ~500 | ~110 KB | Standard analysis run, feature engineering verification, ML forecasting & segmentation testing. |
| `Large.csv` | ~1,000 | ~215 KB | Benchmark dataset for model performance, churn training, RFM customer clustering, and full PDF/CSV report generation. |

## Data Schema

All CSV files follow the enterprise sales transaction schema:

| Column Name | Type | Description | Example |
|-------------|------|-------------|---------|
| `Order ID` | String | Unique order identifier | `ORD-100001` |
| `Sale_Date` | Date (`YYYY-MM-DD`) | Date of purchase transaction | `2024-10-16` |
| `Ship Date` | Date (`YYYY-MM-DD`) | Date of shipment fulfillment | `2024-10-17` |
| `Customer ID` | String | Unique customer identification code | `CUST-9935` |
| `Customer Name` | String | Customer display name | `Customer 179` |
| `Customer_Type` | Categorical | Customer category (`Consumer`, `Corporate`, `Home Office`) | `Home Office` |
| `Region` | Categorical | Geographic region (`North`, `South`, `East`, `West`) | `West` |
| `State` | String | Administrative state / province | `Maharashtra` |
| `City` | String | City name | `Nagpur` |
| `Product_Category` | Categorical | Main product line (`Technology`, `Furniture`, `Office Supplies`) | `Office Supplies` |
| `Sub-Category` | Categorical | Specific product sub-type (`Binders`, `Phones`, `Paper`) | `Binders` |
| `Product Name` | String | Item description | `Binders Model 132` |
| `Sales_Amount` | Float | Total gross sales value in local currency | `5735.63` |
| `Quantity_Sold` | Integer | Quantity of items purchased | `2` |
| `Discount` | Float | Percentage discount applied (0.0 to 1.0) | `0.3` |
| `Profit` | Float | Net profit generated from order | `643.45` |
| `Ship Mode` | Categorical | Shipping speed (`Standard Class`, `Second Class`, `First Class`, `Same Day`) | `Standard Class` |
| `Payment Mode` | Categorical | Transaction tender type (`Card`, `Cash`, `UPI`) | `Card` |
| `Sales_Channel` | Categorical | Sales channel (`Retail`, `Online`, `Wholesale`) | `Retail` |
| `Sales_Rep` | String | Sales representative name | `Eve` |
| `Payment_Method` | Categorical | Payment gateway / method (`PayPal`, `Bank Transfer`, `Credit Card`) | `PayPal` |
| `Unit_Cost` | Float | Production or procurement cost per unit | `3441.38` |
| `Unit_Price` | Float | Retail selling price per unit | `2867.82` |

## Usage

1. Open the Business Analytics web application.
2. Navigate to **Datasets** → **Upload New Dataset**.
3. Select `Small.csv`, `Medium.csv`, or `Large.csv` from this folder.
4. Click **Run Analysis** to trigger the automated machine learning pipeline.
