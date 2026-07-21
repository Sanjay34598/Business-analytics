import { useDataset } from "../contexts/DatasetContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiDownload, FiFileText, FiPrinter, FiTrendingUp } from "react-icons/fi";
import Layout from "../components/Layout";
import ForecastChart from "../components/ForecastChart";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import PageHeader from "../components/PageHeader";
import SalesChart from "../components/SalesChart";
import StatCard from "../components/StatCard";
import { getForecast, getRecommendations, getSales } from "../services/salesapi";
import "../styles/Dashboard.css";

const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const exportCsv = (sales) => {
  const headers = ["Sale Date", "Product ID", "Sales Amount", "Profit"];
  const rows = sales.map((row) => [
    row.Sale_Date,
    row.Product_ID,
    row.Sales_Amount,
    row.Profit
  ].join(","));
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" }));
  link.download = "business-summary.csv";
  link.click();
  URL.revokeObjectURL(link.href);
};

function Reports() {
  const { activeDataset } = useDataset();
  const [sales, setSales] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [salesData, forecastData, recommendationData] = await Promise.all([
        getSales(activeDataset?.id),
        getForecast(activeDataset?.id),
        getRecommendations(activeDataset?.id)
      ]);
      setSales(salesData);
      setForecast(forecastData);
      setRecommendations(recommendationData);
    } catch (requestError) {
      setError(requestError.message || "Unable to load report data.");
    } finally {
      setLoading(false);
    }
  }, [activeDataset?.id]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const summary = useMemo(() => ({
    sales: sales.reduce((sum, row) => sum + Number(row.Sales_Amount || 0), 0),
    profit: sales.reduce((sum, row) => sum + Number(row.Profit || 0), 0),
    forecastRows: forecast.length
  }), [sales, forecast]);

  const actions = (
    <>
      <button type="button" className="secondary-button" onClick={() => window.print()}>
        <FiPrinter /> Print / Save PDF
      </button>
      <button 
        type="button" 
        className="primary-button" 
        onClick={() => exportCsv(sales)} 
        disabled={!sales.length}
      >
        <FiDownload /> Download CSV
      </button>
    </>
  );

  return (
    <Layout>
      <div className="content report-content">
          <PageHeader 
            title="Business Reports" 
            subtitle="Prepare a concise report from the sales and model outputs supplied by the analytics API." 
            actions={actions}
          />
          {loading ? (
            <Loader label="Preparing business report..." />
          ) : error ? (
            <ErrorState 
              title="Report data could not be loaded" 
              message={error} 
              onRetry={loadReports} 
            />
          ) : (
            <>
              <div className="cards cards--three">
                <StatCard 
                  title="Reported Sales" 
                  value={`₹ ${currency.format(summary.sales)}`} 
                  detail="Sum of available sales records" 
                  icon={FiTrendingUp} 
                  tone="teal"
                />
                <StatCard 
                  title="Reported Profit" 
                  value={`₹ ${currency.format(summary.profit)}`} 
                  detail="Sales amount less product cost" 
                  icon={FiFileText} 
                  tone="green" 
                />
                <StatCard 
                  title="Analytical Outputs" 
                  value={(summary.forecastRows + recommendations.length).toLocaleString("en-IN")} 
                  detail="Total forecast and recommendation rows available" 
                  icon={FiFileText} 
                  tone="slate" 
                />
              </div>

              <section className="report-summary">
                <div>
                  <span>Business Summary</span>
                  <h2>Sales data, forecast output, and product recommendations are compiled and available for reporting.</h2>
                </div>
                <dl>
                  <div>
                    <dt>Sales Records</dt>
                    <dd>{sales.length}</dd>
                  </div>
                  <div>
                    <dt>Forecast Results</dt>
                    <dd>{forecast.length}</dd>
                  </div>
                  <div>
                    <dt>Recommended Categories</dt>
                    <dd>{recommendations.length}</dd>
                  </div>
                </dl>
              </section>

              <div className="dashboard-grid">
                <SalesChart sales={sales} title="Sales Revenue Trend" />
                <ForecastChart forecast={forecast} title="Forecast Performance" />
              </div>
            </>
          )}
        </div>
    </Layout>
  );
}

export default Reports;
