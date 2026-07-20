import { useCallback, useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FiAlertTriangle, FiCheckCircle, FiUsers } from "react-icons/fi";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/statcard";
import { getChurn, getSales } from "../services/salesapi";
import "../styles/Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);
const customerType = (value) => Number(value) === 0 ? "New" : "Returning";

function Customers() {
  const [sales, setSales] = useState([]); const [churn, setChurn] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const loadCustomers = useCallback(async () => { setLoading(true); setError(""); try { const [salesData, churnData] = await Promise.all([getSales(), getChurn()]); setSales(salesData); setChurn(churnData); } catch (requestError) { setError(requestError.message || "Unable to load customer data."); } finally { setLoading(false); } }, []);
  useEffect(() => { loadCustomers(); }, [loadCustomers]);
  const segments = useMemo(() => sales.reduce((result, item) => { const key = customerType(item.Customer_Type); result[key] = (result[key] || 0) + 1; return result; }, {}), [sales]);
  const predictedChurn = churn.filter((item) => Number(item.Prediction) === 1).length;
  const churnRate = churn.length ? (predictedChurn / churn.length) * 100 : 0;
  const chartData = { labels: Object.keys(segments), datasets: [{ data: Object.values(segments), backgroundColor: ["#0f766e", "#94a3b8"], borderWidth: 0 }] };
  return <div className="layout"><Sidebar /><main className="main"><Navbar /><div className="content"><PageHeader title="Customer insights" subtitle="Customer-type distribution and churn model classifications from existing analytical datasets." />{loading ? <Loader label="Loading customer insights…" /> : error ? <div className="error-state"><strong>Customer data could not be loaded.</strong><span>{error}</span><button className="secondary-button" onClick={loadCustomers}>Try again</button></div> : <><div className="cards cards--three"><StatCard title="Customer-type records" value={sales.length.toLocaleString("en-IN")} detail="Sales records with a customer type" icon={FiUsers} /><StatCard title="Predicted churn" value={predictedChurn.toLocaleString("en-IN")} detail="Rows classified as churn by the model" icon={FiAlertTriangle} tone="amber" /><StatCard title="Churn rate" value={`${churnRate.toFixed(1)}%`} detail="Predicted churn share of available rows" icon={FiCheckCircle} tone="green" /></div><div className="dashboard-grid dashboard-grid--lower"><section className="chart-panel customer-panel"><div className="panel-heading"><div><h2>Customer segments</h2><p>Distribution of encoded customer types in sales data</p></div></div><div className="customer-chart-wrap">{Object.keys(segments).length ? <Doughnut data={chartData} options={{ maintainAspectRatio: false, cutout: "68%", plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 9 } } } }} /> : <p className="empty-state">No customer segments are available.</p>}</div></section><section className="summary-panel"><div className="panel-heading"><div><h2>Churn summary</h2><p>Classification output from the churn endpoint</p></div></div><dl className="summary-list"><div><dt>Predicted retained</dt><dd>{(churn.length - predictedChurn).toLocaleString("en-IN")}</dd></div><div><dt>Predicted churn</dt><dd>{predictedChurn.toLocaleString("en-IN")}</dd></div><div><dt>Model result rows</dt><dd>{churn.length.toLocaleString("en-IN")}</dd></div></dl></section></div><section className="table-panel"><div className="panel-heading"><div><h2>Customer model results</h2><p>Individual churn classifications; the API does not expose customer IDs.</p></div><span className="record-count">{churn.length} rows</span></div><div className="table-scroll">{churn.length ? <table><thead><tr><th>Customer type</th><th>Region</th><th>Channel</th><th>Quantity sold</th><th>Discount</th><th>Prediction</th></tr></thead><tbody>{churn.slice(0, 50).map((row, index) => <tr key={index}><td>{customerType(row.Customer_Type)}</td><td>Region {Number(row.Region) + 1}</td><td>{Number(row.Sales_Channel) === 0 ? "Online" : "Retail"}</td><td>{row.Quantity_Sold}</td><td>{(Number(row.Discount) * 100).toFixed(0)}%</td><td><span className={`status-badge ${Number(row.Prediction) === 1 ? "status-badge--risk" : "status-badge--good"}`}>{Number(row.Prediction) === 1 ? "Churn risk" : "Retained"}</span></td></tr>)}</tbody></table> : <p className="empty-state">No churn model results are available.</p>}</div></section></>}<Footer /></div></main></div>;
}

export default Customers;
