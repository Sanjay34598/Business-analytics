import { Line } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import "../styles/chart.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function ForecastChart({ forecast = [], title = "Forecast performance" }) {
  const rows = forecast.slice(0, 24);
  const data = { labels: rows.map((_, index) => `Record ${index + 1}`), datasets: [{ label: "Actual sales", data: rows.map((item) => Number(item.Actual_Sales || 0)), borderColor: "#334155", backgroundColor: "#334155", tension: 0.32, pointRadius: 2 }, { label: "Predicted sales", data: rows.map((item) => Number(item.Predicted_Sales || 0)), borderColor: "#0f766e", backgroundColor: "#0f766e", tension: 0.32, pointRadius: 2, borderDash: [5, 4] }] };
  const options = { maintainAspectRatio: false, responsive: true, plugins: { legend: { position: "top", align: "end", labels: { boxWidth: 9, usePointStyle: true } } }, scales: { y: { grid: { color: "#eef1f4" }, ticks: { callback: (value) => `₹${Math.round(value).toLocaleString("en-IN")}` } }, x: { grid: { display: false } } } };
  return <section className="chart-panel"><div className="panel-heading"><div><h2>{title}</h2><p>Actual sales compared with the current model output</p></div></div><div className="chart-area">{rows.length ? <Line data={data} options={options} /> : <p className="empty-state">No forecast results are available.</p>}</div></section>;
}

export default ForecastChart;
