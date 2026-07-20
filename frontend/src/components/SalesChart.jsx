import { Bar, Line } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import "../styles/chart.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

const money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function SalesChart({ sales = [], variant = "trend", title = "Sales trend" }) {
  const groups = sales.reduce((result, item) => {
    const date = new Date(item.Sale_Date);
    const key = variant === "region" 
      ? `Region ${Number(item.Region) + 1}` 
      : `${date.toLocaleString("en-IN", { month: "short" })} ${date.getFullYear()}`;
    result[key] = (result[key] || 0) + Number(item.Sales_Amount || 0);
    return result;
  }, {});

  const labels = Object.keys(groups);
  const values = Object.values(groups);

  const data = {
    labels,
    datasets: [
      {
        label: "Sales Amount",
        data: values,
        borderColor: "#0d9488",
        backgroundColor: variant === "region" 
          ? "#0d9488" 
          : "rgba(13, 148, 136, 0.08)",
        fill: variant !== "region",
        borderWidth: 2,
        pointRadius: variant === "region" ? 0 : 4,
        pointHoverRadius: variant === "region" ? 0 : 6,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#0d9488",
        pointBorderWidth: 2,
        tension: 0.35,
        borderRadius: 6
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { family: "Inter", size: 12, weight: "bold" },
        bodyFont: { family: "Inter", size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ₹ ${money.format(context.parsed.y || 0)}`
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
          callback: (value) => `₹${money.format(value)}`
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
          <p>
            {variant === "region" 
              ? "Revenue distribution across sales regions" 
              : "Revenue captured from the available sales records"}
          </p>
        </div>
      </div>
      <div className="chart-area">
        {labels.length ? (
          variant === "region" ? (
            <Bar data={data} options={options} />
          ) : (
            <Line data={data} options={options} />
          )
        ) : (
          <p className="empty-state">No sales data is available for this chart.</p>
        )}
      </div>
    </section>
  );
}

export default SalesChart;
