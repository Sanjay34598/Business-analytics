import { useCallback, useEffect, useMemo, useState } from "react";
import { FiBox, FiLayers, FiTrendingUp } from "react-icons/fi";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/statcard";
import { getRecommendations } from "../services/salesapi";
import "../styles/Dashboard.css";

const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function Inventory() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRecommendations(await getRecommendations());
    } catch (requestError) {
      setError(requestError.message || "Unable to load product recommendations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const summary = useMemo(() => ({
    units: recommendations.reduce((sum, item) => sum + Number(item.Total_Sold || 0), 0),
    averageSales: recommendations.length 
      ? recommendations.reduce((sum, item) => sum + Number(item.Average_Sales || 0), 0) / recommendations.length 
      : 0
  }), [recommendations]);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Navbar />
        <div className="content">
          <PageHeader 
            title="Product Recommendations" 
            subtitle="Use product-category model output to inform inventory and assortment planning." 
          />
          {loading ? (
            <Loader label="Loading recommendation results..." />
          ) : error ? (
            <div className="error-state">
              <strong>Recommendation data could not be loaded.</strong>
              <span>{error}</span>
              <button type="button" className="secondary-button" onClick={loadRecommendations}>Try again</button>
            </div>
          ) : (
            <>
              <div className="cards cards--three">
                <StatCard 
                  title="Product Categories" 
                  value={recommendations.length.toLocaleString("en-IN")} 
                  detail="Categories ranked by average profit margins" 
                  icon={FiLayers} 
                  tone="teal"
                />
                <StatCard 
                  title="Units Sold" 
                  value={summary.units.toLocaleString("en-IN")} 
                  detail="Total quantities across recommendations" 
                  icon={FiBox} 
                  tone="amber" 
                />
                <StatCard 
                  title="Average Category Sales" 
                  value={`₹ ${currency.format(summary.averageSales)}`} 
                  detail="Mean of category average sales numbers" 
                  icon={FiTrendingUp} 
                  tone="green" 
                />
              </div>

              <section className="table-panel recommendation-table">
                <div className="panel-heading">
                  <div>
                    <h2>Recommendation Matrix</h2>
                    <p>Categories are ordered by the recommendation model's average-profit metric.</p>
                  </div>
                  <span className="record-count">{recommendations.length} categories</span>
                </div>
                <div className="table-scroll">
                  {recommendations.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Product Category</th>
                          <th className="numeric">Average Profit</th>
                          <th className="numeric">Average Sales</th>
                          <th className="numeric">Total Quantity Sold</th>
                          <th>Planning Signal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recommendations.map((row, index) => (
                          <tr key={row.Product_Category}>
                            <td>#{index + 1}</td>
                            <td>Category {Number(row.Product_Category) + 1}</td>
                            <td className={`numeric ${Number(row.Average_Profit) < 0 ? "negative-value" : "positive-value"}`}>
                              ₹ {currency.format(Number(row.Average_Profit))}
                            </td>
                            <td className="numeric">₹ {currency.format(Number(row.Average_Sales))}</td>
                            <td className="numeric">{Number(row.Total_Sold).toLocaleString("en-IN")}</td>
                            <td>
                              <span className={`status-badge ${index === 0 ? "status-badge--good" : "status-badge--neutral"}`}>
                                {index === 0 ? "Highest Ranked" : "Review Margin"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="empty-state">No recommendation results are available.</p>
                  )}
                </div>
              </section>
              <p className="data-note">Stock-on-hand data is not exposed by the current API. This page therefore presents the available recommendation results rather than inventory quantities.</p>
            </>
          )}
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default Inventory;
