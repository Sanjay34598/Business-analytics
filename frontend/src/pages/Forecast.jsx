import { useCallback, useEffect, useMemo, useState } from "react";
import { FiActivity, FiTarget, FiTrendingUp, FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import Footer from "../components/Footer";
import ForecastChart from "../components/ForecastChart";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import { getForecast } from "../services/salesapi";
import "../styles/Dashboard.css";

const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const exportToExcel = (records) => {
  const data = records.map((row) => ({
    "Region": `Region ${Number(row.Region) + 1}`,
    "Category": `Category ${Number(row.Product_Category) + 1}`,
    "Month": row.Month,
    "Actual Sales": Number(row.Actual_Sales),
    "Predicted Sales": Number(row.Predicted_Sales),
    "Variance": Number(row.Predicted_Sales) - Number(row.Actual_Sales)
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Forecast Output");
  XLSX.writeFile(workbook, "forecast-export.xlsx");
};

function Forecast() {
  const [forecast, setForecast] = useState([]);
  const [horizon, setHorizon] = useState("30");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadForecast = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setForecast(await getForecast());
    } catch (requestError) {
      setError(requestError.message || "Unable to load forecast data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  const metrics = useMemo(() => {
    if (!forecast.length) return { accuracy: 0, mae: 0, variance: 0 };
    const errors = forecast.map((item) => Math.abs(Number(item.Actual_Sales) - Number(item.Predicted_Sales)));
    const mape = forecast.reduce((sum, item) => 
      sum + Math.abs(Number(item.Actual_Sales) - Number(item.Predicted_Sales)) / Math.max(Math.abs(Number(item.Actual_Sales)), 1), 0
    ) / forecast.length;
    
    return {
      accuracy: Math.max(0, 100 - mape * 100),
      mae: errors.reduce((sum, value) => sum + value, 0) / errors.length,
      variance: forecast.reduce((sum, item) => sum + (Number(item.Predicted_Sales) - Number(item.Actual_Sales)), 0) / forecast.length
    };
  }, [forecast]);

  // Adjust data length based on horizon to simulate zooming out
  const displayData = useMemo(() => {
    const limit = Number(horizon);
    return forecast.slice(0, limit);
  }, [forecast, horizon]);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Navbar />
        <div className="content">
          <PageHeader 
            title="Sales Forecast" 
            subtitle="Review the available regression model results against actual sales values."
            actions={
              <button 
                type="button"
                className="primary-button" 
                onClick={() => exportToExcel(forecast)} 
                disabled={!forecast.length}
              >
                <FiDownload /> Download Output
              </button>
            } 
          />
          {loading ? (
            <Loader label="Loading forecast results..." />
          ) : error ? (
            <div className="error-state">
              <strong>Forecast data could not be loaded.</strong>
              <span>{error}</span>
              <button type="button" className="secondary-button" onClick={loadForecast}>Try again</button>
            </div>
          ) : (
            <>
              <div className="filter-panel" style={{ marginBottom: 'var(--space-lg)', padding: '12px var(--space-md)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: 'row' }}>
                  <span style={{ marginTop: '0' }}>Forecast Horizon</span>
                  <select value={horizon} onChange={(e) => setHorizon(e.target.value)} style={{ width: 'auto', minWidth: '150px' }}>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </label>
              </div>

              <div className="cards cards--three">
                <StatCard 
                  title="Forecast Accuracy" 
                  value={`${metrics.accuracy.toFixed(1)}%`} 
                  detail="100% minus Mean Absolute Percentage Error (MAPE)" 
                  icon={FiTarget} 
                  tone="teal"
                />
                <StatCard 
                  title="Mean Absolute Error" 
                  value={`₹ ${currency.format(metrics.mae)}`} 
                  detail="Average absolute deviation from actual sales" 
                  icon={FiActivity} 
                  tone="amber" 
                />
                <StatCard 
                  title="Mean Prediction Error" 
                  value={`₹ ${currency.format(metrics.variance)}`} 
                  detail="Average prediction minus actual sales" 
                  icon={FiTrendingUp} 
                  tone="slate" 
                />
              </div>

              <ForecastChart forecast={displayData} title="Actual versus Predicted Sales" />

              <section className="table-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Prediction Results</h2>
                    <p>Individual records returned by the forecasting endpoint.</p>
                  </div>
                  <span className="record-count">{forecast.length} rows</span>
                </div>
                <div className="table-scroll">
                  {forecast.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Region</th>
                          <th>Product Category</th>
                          <th>Month</th>
                          <th className="numeric">Actual Sales</th>
                          <th className="numeric">Predicted Sales</th>
                          <th className="numeric">Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecast.slice(0, 50).map((row, index) => {
                          const variance = Number(row.Predicted_Sales) - Number(row.Actual_Sales);
                          return (
                            <tr key={index}>
                              <td>Region {Number(row.Region) + 1}</td>
                              <td>Category {Number(row.Product_Category) + 1}</td>
                              <td>{row.Month}</td>
                              <td className="numeric">₹ {currency.format(Number(row.Actual_Sales))}</td>
                              <td className="numeric">₹ {currency.format(Number(row.Predicted_Sales))}</td>
                              <td className={`numeric ${variance < 0 ? "negative-value" : "positive-value"}`}>
                                ₹ {currency.format(variance)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p className="empty-state">No forecast records are available.</p>
                  )}
                </div>
              </section>
            </>
          )}
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default Forecast;
