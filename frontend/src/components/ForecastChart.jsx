import { Line } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import "../styles/chart.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function ForecastChart({ forecast = [], title = "Forecast performance" }) {
  const rows = forecast.slice(0, 24);
  const data = {
    labels: rows.map((_, index) => `Record ${index + 1}`),
    datasets: [
      {
        label: "Actual Sales",
        data: rows.map((item) => Number(item.Actual_Sales || 0)),
        borderColor: "#334155",
        backgroundColor: "#334155",
        tension: 0.32,
        pointRadius: 3,
        pointBackgroundColor: "#334155",
        borderWidth: 2
      },
      {
        label: "Predicted Sales",
        data: rows.map((item) => Number(item.Predicted_Sales || 0)),
        borderColor: "#0d9488",
        backgroundColor: "#0d9488",
        tension: 0.32,
        pointRadius: 3,
        pointBackgroundColor: "#0d9488",
        borderDash: [5, 4],
        borderWidth: 2
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          font: { family: "Inter", size: 11, weight: "500" },
          color: "#475569"
        }
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { family: "Inter", size: 12, weight: "bold" },
        bodyFont: { family: "Inter", size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ₹ ${Math.round(context.parsed.y).toLocaleString("en-IN")}`
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: "#f1f5f9"
        },
        ticks: {
          font: { family: "Inter", size: 10 },
          color: "#64748b",
          callback: (value) => `₹${Math.round(value).toLocaleString("en-IN")}`
        },
        border: { display: false }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { family: "Inter", size: 10 },
          color: "#64748b"
        },
        border: { display: false }
      }
    }
  };

  return (
    <section className="chart-panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>Actual sales compared with the current model output</p>
        </div>
      </div>
      <div className="chart-area">
        {rows.length ? (
          <Line data={data} options={options} />
        ) : (
          <p className="empty-state">No forecast results are available.</p>
        )}
      </div>
    </section>
  );
}

export default ForecastChart;
