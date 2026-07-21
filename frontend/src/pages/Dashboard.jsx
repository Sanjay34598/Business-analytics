import { useCallback, useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FiActivity, FiBox, FiDollarSign, FiPercent, FiShoppingBag, FiTrendingUp, FiDatabase, FiClock, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import ForecastChart from "../components/ForecastChart";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import PageHeader from "../components/PageHeader";
import RecentActivity from "../components/RecentActivity";
import SalesChart from "../components/SalesChart";
import StatCard from "../components/StatCard";
import { getForecast, getSales, getRecommendations, getMetrics, retrainDataset } from "../services/salesapi";
import { useDataset } from "../contexts/DatasetContext";
import "../styles/Dashboard.css";
import Layout from "../components/Layout";

import DatasetSwitcher from "../components/DatasetSwitcher";

ChartJS.register(ArcElement, Tooltip, Legend);
const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const labelCustomerType = (value) => Number(value) === 0 ? "New" : "Returning";

function Dashboard() {
  const { activeDataset } = useDataset();
  const [sales, setSales] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  const handleRetrain = async () => {
    if (!activeDataset?.id) return;
    setRetraining(true);
    try {
      await retrainDataset(activeDataset.id);
      await loadDashboard();
    } catch (err) {
      alert("Failed to retrain: " + err.message);
    } finally {
      setRetraining(false);
    }
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [salesData, forecastData, recommendationData, metricsData] = await Promise.all([
        getSales(), 
        getForecast(),
        getRecommendations(),
        getMetrics()
      ]);
      setSales(salesData);
      setForecast(forecastData);
      setRecommendations(recommendationData);
      setModelMetrics(metricsData);
    } catch (requestError) {
      setError(requestError.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, activeDataset?.id]);

  const metrics = useMemo(() => {
    const totalSales = sales.reduce((sum, item) => sum + Number(item.Sales_Amount || 0), 0);
    const profit = sales.reduce((sum, item) => sum + Number(item.Profit || 0), 0);
    const products = new Set(sales.map((item) => item.Product_ID)).size;
    const mape = forecast.length 
      ? forecast.reduce((sum, item) => sum + Math.abs(Number(item.Actual_Sales) - Number(item.Predicted_Sales)) / Math.max(Math.abs(Number(item.Actual_Sales)), 1), 0) / forecast.length 
      : null;
    return {
      totalSales,
      profit,
      products,
      averageOrder: sales.length ? totalSales / sales.length : 0,
      margin: totalSales ? (profit / totalSales) * 100 : 0,
      accuracy: mape === null ? null : Math.max(0, 100 - (mape * 100))
    };
  }, [sales, forecast]);

  const customerDistribution = useMemo(() => 
    sales.reduce((result, item) => {
      const type = labelCustomerType(item.Customer_Type);
      result[type] = (result[type] || 0) + 1;
      return result;
    }, {}), [sales]);

  const customerChartData = {
    labels: Object.keys(customerDistribution),
    datasets: [
      {
        data: Object.values(customerDistribution),
        backgroundColor: ["#0d9488", "#94a3b8"],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const activities = [
    { title: "Sales dataset loaded", detail: `${sales.length} records available from /sales` },
    { title: "Forecast dataset processed", detail: `${forecast.length} model results available from /forecast` }
  ];

return (
  <Layout>
    <div className="content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
        <PageHeader 
          title="Business Overview" 
          subtitle="A consolidated view of sales performance and analytical model output." 
        />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {activeDataset?.id && (
            <button 
              onClick={handleRetrain}
              disabled={retraining}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: retraining ? "var(--color-surface-alt)" : "var(--primary-color)",
                border: "1px solid transparent",
                borderRadius: "var(--radius-md)",
                cursor: retraining ? "not-allowed" : "pointer",
                fontWeight: 500,
                fontSize: "14px",
                color: "white",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "background 0.2s"
              }}
            >
              {retraining ? (
                <div className="spinner" style={{ width: "16px", height: "16px", borderTopColor: "white" }} />
              ) : (
                <FiRefreshCw size={16} />
              )}
              {retraining ? "Retraining..." : "Retrain Model"}
            </button>
          )}
          <DatasetSwitcher />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState 
          title="Dashboard data could not be loaded" 
          message={error} 
          onRetry={loadDashboard} 
        />
      ) : (
        <div key={activeDataset?.id}>
          {modelMetrics && (
            <div style={{
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-md) var(--space-lg)',
              marginBottom: 'var(--space-lg)',
              display: 'flex',
              gap: 'var(--space-xl)',
              alignItems: 'center'
            }}>
              <div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Model Version</div>
                <div style={{fontWeight: 600}}>v1.0.0</div>
              </div>
              <div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Training Date</div>
                <div style={{fontWeight: 600}}>{modelMetrics.training_date || "Unknown"}</div>
              </div>
              <div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Forecast R²</div>
                <div style={{fontWeight: 600}}>{modelMetrics.forecast?.R2 ? (modelMetrics.forecast.R2 * 100).toFixed(1) + "%" : "N/A"}</div>
              </div>
              <div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Churn Accuracy</div>
                <div style={{fontWeight: 600}}>{modelMetrics.churn?.Accuracy ? (modelMetrics.churn.Accuracy * 100).toFixed(1) + "%" : "N/A"}</div>
              </div>
              <div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Model Status</div>
                <div style={{fontWeight: 600, color: 'var(--primary-color)'}}>Active</div>
              </div>
            </div>
          )}

          <div className="cards">
                    <StatCard 
                      title="Total Sales" 
                      value={`₹ ${currency.format(metrics.totalSales)}`} 
                      detail="Available sales records" 
                      icon={FiDollarSign} 
                      tone="teal"
                    />
                <StatCard 
                  title="Net Profit" 
                  value={`₹ ${currency.format(metrics.profit)}`} 
                  detail="Sales less product cost" 
                  icon={FiTrendingUp} 
                  tone="green" 
                />
                <StatCard 
                  title="Sales Records" 
                  value={sales.length.toLocaleString("en-IN")} 
                  detail="Records returned by the API" 
                  icon={FiShoppingBag} 
                  tone="slate" 
                />
                <StatCard 
                  title="Unique Products" 
                  value={metrics.products.toLocaleString("en-IN")} 
                  detail="Unique product IDs" 
                  icon={FiBox} 
                  tone="amber" 
                />
                <StatCard 
                  title="Average Order Value" 
                  value={`₹ ${currency.format(metrics.averageOrder)}`} 
                  detail="Mean sales amount" 
                  icon={FiActivity} 
                  tone="teal"
                />
                <StatCard 
                  title="Forecast Accuracy" 
                  value={metrics.accuracy === null ? "—" : `${metrics.accuracy.toFixed(1)}%`} 
                  detail="Calculated from forecast results" 
                  icon={FiPercent} 
                  tone="green" 
                />
              </div>

              <div className="dashboard-grid">
                <SalesChart sales={sales} />
                <ForecastChart forecast={forecast} />
              </div>

              <div className="dashboard-grid dashboard-grid--lower">
                <section className="chart-panel customer-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Customer Distribution</h2>
                      <p>Sales records by encoded customer type</p>
                    </div>
                  </div>
                  <div className="customer-chart-wrap">
                    {Object.keys(customerDistribution).length ? (
                      <Doughnut 
                        data={customerChartData} 
                        options={{
                          maintainAspectRatio: false,
                          cutout: "68%",
                          plugins: {
                            legend: {
                              position: "bottom",
                              labels: {
                                usePointStyle: true,
                                boxWidth: 8,
                                font: { family: "Inter", size: 11, weight: "500" }
                              }
                            }
                          }
                        }} 
                      />
                    ) : (
                      <p className="empty-state">No customer data is available.</p>
                    )}
                  </div>
                </section>
                <RecentActivity activities={activities} />
              </div>

              <section className="table-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Top Recommendations</h2>
                    <p>Product categories recommended for restock</p>
                  </div>
                  <span className="record-count">{recommendations.length} categories</span>
                </div>
                <div className="table-scroll">
                  {recommendations.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th className="numeric">Quantity Sold</th>
                          <th className="numeric">Average Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recommendations.slice(0, 5).map((row, index) => (
                          <tr key={`rec-${index}`}>
                            <td>Category {row.Product_Category}</td>
                            <td className="numeric">{Number(row.Total_Sold).toLocaleString()} units</td>
                            <td className={`numeric ${Number(row.Average_Profit) < 0 ? "negative-value" : "positive-value"}`}>
                              ₹ {currency.format(Number(row.Average_Profit))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="empty-state">No recommendations are available.</p>
                  )}
                </div>
              </section>

              <section className="table-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent Sales</h2>
                    <p>The most recent records returned by the sales API</p>
                  </div>
                  <span className="record-count">{sales.length} records</span>
                </div>
                <div className="table-scroll">
                  {sales.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Sale Date</th>
                          <th>Product</th>
                          <th>Region</th>
                          <th>Channel</th>
                          <th className="numeric">Sales</th>
                          <th className="numeric">Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sales.slice(0, 8).map((row, index) => (
                          <tr key={`${row.Product_ID}-${index}`}>
                            <td>{new Date(row.Sale_Date).toLocaleDateString("en-IN")}</td>
                            <td>#{row.Product_ID}</td>
                            <td>Region {Number(row.Region) + 1}</td>
                            <td>{Number(row.Sales_Channel) === 0 ? "Online" : "Retail"}</td>
                            <td className="numeric">₹ {currency.format(Number(row.Sales_Amount))}</td>
                            <td className={`numeric ${Number(row.Profit) < 0 ? "negative-value" : "positive-value"}`}>
                              ₹ {currency.format(Number(row.Profit))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="empty-state">No sales records are available.</p>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </Layout>

 );
}

export default Dashboard;
