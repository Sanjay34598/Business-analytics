import { useCallback, useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FiAlertTriangle, FiCheckCircle, FiUsers } from "react-icons/fi";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { getChurn, getSales } from "../services/salesapi";
import "../styles/Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);
const customerType = (value) => Number(value) === 0 ? "New" : "Returning";

function Customers() {
  const [sales, setSales] = useState([]);
  const [churn, setChurn] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [salesData, churnData] = await Promise.all([getSales(), getChurn()]);
      setSales(salesData);
      setChurn(churnData);
    } catch (requestError) {
      setError(requestError.message || "Unable to load customer data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const segments = useMemo(() => 
    sales.reduce((result, item) => {
      const key = customerType(item.Customer_Type);
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {}), [sales]);

  const predictedChurn = churn.filter((item) => Number(item.Prediction) === 1).length;
  const churnRate = churn.length ? (predictedChurn / churn.length) * 100 : 0;
  const chartData = {
    labels: Object.keys(segments),
    datasets: [
      {
        data: Object.values(segments),
        backgroundColor: ["#0d9488", "#94a3b8"],
        borderWidth: 0
      }
    ]
  };

  return (
    <Layout>
      <div className="content">
          <PageHeader 
            title="Customer Insights" 
            subtitle="Customer-type distribution and churn model classifications from existing analytical datasets." 
          />
          {loading ? (
            <Loader label="Loading customer insights..." />
          ) : error ? (
            <ErrorState 
              title="Customer data could not be loaded" 
              message={error} 
              onRetry={loadCustomers} 
            />
          ) : (
            <>
              <div className="cards cards--three">
                <StatCard 
                  title="Customer-Type Records" 
                  value={sales.length.toLocaleString("en-IN")} 
                  detail="Sales records containing customer segment identifiers" 
                  icon={FiUsers} 
                  tone="teal"
                />
                <StatCard 
                  title="Predicted Churn" 
                  value={predictedChurn.toLocaleString("en-IN")} 
                  detail="Rows classified as churn risk by the regression model" 
                  icon={FiAlertTriangle} 
                  tone="amber" 
                />
                <StatCard 
                  title="Average Churn Rate" 
                  value={`${churnRate.toFixed(1)}%`} 
                  detail="Predicted churn share of available rows" 
                  icon={FiCheckCircle} 
                  tone="green" 
                />
              </div>

              <div className="dashboard-grid dashboard-grid--lower">
                <section className="chart-panel customer-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Customer Segments</h2>
                      <p>Distribution of encoded customer types in sales data</p>
                    </div>
                  </div>
                  <div className="customer-chart-wrap">
                    {Object.keys(segments).length ? (
                      <Doughnut 
                        data={chartData} 
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
                      <p className="empty-state">No customer segments are available.</p>
                    )}
                  </div>
                </section>

                <section className="summary-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Churn Classification Summary</h2>
                      <p>Classification output details from the predictive model</p>
                    </div>
                  </div>
                  <dl className="summary-list">
                    <div>
                      <dt>Predicted Retained</dt>
                      <dd>{(churn.length - predictedChurn).toLocaleString("en-IN")}</dd>
                    </div>
                    <div>
                      <dt>Predicted Churn</dt>
                      <dd>{predictedChurn.toLocaleString("en-IN")}</dd>
                    </div>
                    <div>
                      <dt>Model Result Rows</dt>
                      <dd>{churn.length.toLocaleString("en-IN")}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <section className="table-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Customer Model Classifications</h2>
                    <p>Individual churn classifications; the API does not expose direct customer IDs.</p>
                  </div>
                  <span className="record-count">{churn.length} rows</span>
                </div>
                <div className="table-scroll">
                  {churn.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Customer Type</th>
                          <th>Region</th>
                          <th>Sales Channel</th>
                          <th>Quantity Sold</th>
                          <th>Discount Applied</th>
                          <th>Prediction Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {churn.slice(0, 50).map((row, index) => (
                          <tr key={index}>
                            <td>{customerType(row.Customer_Type)}</td>
                            <td>Region {Number(row.Region) + 1}</td>
                            <td>{Number(row.Sales_Channel) === 0 ? "Online" : "Retail"}</td>
                            <td>{row.Quantity_Sold}</td>
                            <td>{(Number(row.Discount) * 100).toFixed(0)}%</td>
                            <td>
                              <span className={`status-badge ${Number(row.Prediction) === 1 ? "status-badge--risk" : "status-badge--good"}`}>
                                {Number(row.Prediction) === 1 ? "Churn Risk" : "Retained"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="empty-state">No churn model results are available.</p>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
    </Layout>
  );
}

export default Customers;
