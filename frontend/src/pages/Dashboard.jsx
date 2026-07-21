import { useCallback, useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FiActivity, FiBox, FiDollarSign, FiPercent, FiShoppingBag, FiTrendingUp, FiDatabase, FiClock, FiCheckCircle } from "react-icons/fi";
import ForecastChart from "../components/ForecastChart";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import PageHeader from "../components/PageHeader";
import RecentActivity from "../components/RecentActivity";
import SalesChart from "../components/SalesChart";
import StatCard from "../components/StatCard";
import { getForecast, getSales } from "../services/salesapi";
import "../styles/Dashboard.css";
import Layout from "../components/Layout";

ChartJS.register(ArcElement, Tooltip, Legend);
const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const labelCustomerType = (value) => Number(value) === 0 ? "New" : "Returning";

function Dashboard() {
  const [sales, setSales] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [salesData, forecastData] = await Promise.all([getSales(), getForecast()]);
      setSales(salesData);
      setForecast(forecastData);
    } catch (requestError) {
      setError(requestError.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

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
          <PageHeader 
            title="Business Overview" 
            subtitle="A consolidated view of sales performance and analytical model output." 
          />
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorState 
              title="Dashboard data could not be loaded" 
              message={error} 
              onRetry={loadDashboard} 
            />
          ) : (
            <>
              {/* Dataset Metadata Header */}
              <div style={{ display: 'flex', gap: '24px', padding: '16px 24px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiDatabase size={20} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Active Dataset</span>
                    <strong style={{ fontSize: '15px' }}>Q3_Sales_Master.csv</strong>
                  </div>
                </div>
                <div style={{ width: '1px', background: 'var(--color-border)' }} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-alt)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
                    <FiCheckCircle size={18} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Model Status</span>
                    <strong style={{ fontSize: '15px', color: 'var(--color-success)' }}>Models Synced</strong>
                  </div>
                </div>
                <div style={{ width: '1px', background: 'var(--color-border)' }} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-alt)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
                    <FiClock size={18} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Last Analysis</span>
                    <strong style={{ fontSize: '15px' }}>Today, 09:45 AM</strong>
                  </div>
                </div>
              </div>

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
            </>
          )}
        </div>
      </Layout>

 );
}

export default Dashboard;
