import { useCallback, useEffect, useMemo, useState } from "react";
import { FiDownload, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import * as XLSX from "xlsx";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import PageHeader from "../components/PageHeader";
import SalesChart from "../components/SalesChart";
import { getSales } from "../services/salesapi";
import "../styles/Dashboard.css";

const currency = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const exportToCsv = (records) => {
  const headers = ["Sale Date", "Product ID", "Region", "Sales Rep", "Channel", "Sales Amount", "Profit"];
  const lines = records.map((row) => [
    row.Sale_Date,
    row.Product_ID,
    `Region ${Number(row.Region) + 1}`,
    `Rep ${Number(row.Sales_Rep) + 1}`,
    Number(row.Sales_Channel) === 0 ? "Online" : "Retail",
    row.Sales_Amount,
    row.Profit
  ].join(","));
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv" }));
  link.download = "sales-export.csv";
  link.click();
  URL.revokeObjectURL(link.href);
};

const exportToExcel = (records) => {
  const data = records.map((row) => ({
    "Sale Date": row.Sale_Date,
    "Product ID": row.Product_ID,
    "Region": `Region ${Number(row.Region) + 1}`,
    "Sales Rep": `Rep ${Number(row.Sales_Rep) + 1}`,
    "Channel": Number(row.Sales_Channel) === 0 ? "Online" : "Retail",
    "Sales Amount": Number(row.Sales_Amount),
    "Profit": Number(row.Profit)
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");
  XLSX.writeFile(workbook, "sales-export.xlsx");
};

function Sales() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [channel, setChannel] = useState("all");
  const [rep, setRep] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "Sale_Date", direction: "desc" });
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSales = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSales(await getSales());
    } catch (requestError) {
      setError(requestError.message || "Unable to load sales data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  // Handle pagination reset on filter change
  useEffect(() => {
    setPage(1);
  }, [search, region, channel, rep, dateRange]);

  const filtered = useMemo(() => {
    const today = new Date();
    return sales.filter((item) => {
      const query = search.toLowerCase();
      const matchesSearch = !query 
        || String(item.Product_ID).toLowerCase().includes(query) 
        || String(item.Sale_Date).toLowerCase().includes(query);
      
      const itemDate = new Date(item.Sale_Date);
      let matchesDate = true;
      if (dateRange === "7days") {
        const diff = (today - itemDate) / (1000 * 60 * 60 * 24);
        matchesDate = diff <= 7;
      } else if (dateRange === "30days") {
        const diff = (today - itemDate) / (1000 * 60 * 60 * 24);
        matchesDate = diff <= 30;
      }

      return matchesSearch 
        && matchesDate
        && (region === "all" || String(item.Region) === region) 
        && (channel === "all" || String(item.Sales_Channel) === channel)
        && (rep === "all" || String(item.Sales_Rep) === rep);
    });
  }, [sales, search, region, channel, rep, dateRange]);

  const sorted = useMemo(() => {
    let sortableItems = [...filtered];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === "Sale_Date") {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        } else if (["Sales_Amount", "Profit", "Region", "Sales_Rep", "Sales_Channel"].includes(sortConfig.key)) {
          aVal = Number(aVal);
          bVal = Number(bVal);
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filtered, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const total = sorted.reduce((sum, item) => sum + Number(item.Sales_Amount || 0), 0);
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const currentData = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Layout>
      <div className="content">
          <PageHeader 
            title="Sales Performance" 
            subtitle="Explore the sales records currently available to the analytics service." 
            actions={
              <>
                <button 
                  type="button"
                  className="secondary-button" 
                  onClick={() => exportToCsv(filtered)} 
                  disabled={!filtered.length}
                >
                  <FiDownload /> CSV
                </button>
                <button 
                  type="button"
                  className="primary-button" 
                  onClick={() => exportToExcel(filtered)} 
                  disabled={!filtered.length}
                >
                  <FiDownload /> Excel
                </button>
              </>
            } 
          />
          {loading ? (
            <Loader label="Loading sales records..." />
          ) : error ? (
            <ErrorState 
              title="Sales data could not be loaded" 
              message={error} 
              onRetry={loadSales} 
            />
          ) : (
            <>
              <section className="filter-panel" style={{ flexWrap: 'wrap' }}>
                <label className="search-field" style={{ minWidth: '260px' }}>
                  <FiSearch />
                  <input 
                    value={search} 
                    onChange={(event) => setSearch(event.target.value)} 
                    placeholder="Search product or date..." 
                    aria-label="Search sales records" 
                  />
                </label>
                <label>
                  Date Range
                  <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="all">All time</option>
                    <option value="30days">Last 30 days</option>
                    <option value="7days">Last 7 days</option>
                  </select>
                </label>
                <label>
                  Region
                  <select value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="all">All regions</option>
                    {[0, 1, 2, 3].map((value) => (
                      <option value={value} key={value}>Region {value + 1}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Channel
                  <select value={channel} onChange={(e) => setChannel(e.target.value)}>
                    <option value="all">All channels</option>
                    <option value="0">Online</option>
                    <option value="1">Retail</option>
                  </select>
                </label>
                <label>
                  Sales Rep
                  <select value={rep} onChange={(e) => setRep(e.target.value)}>
                    <option value="all">All Reps</option>
                    {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                      <option value={value} key={value}>Rep {value + 1}</option>
                    ))}
                  </select>
                </label>
                <div className="filter-summary" style={{ marginLeft: 'auto', paddingRight: '8px' }}>
                  <strong>₹ {currency.format(total)}</strong>
                  <span>{filtered.length.toLocaleString()} matching records</span>
                </div>
              </section>

              <SalesChart sales={filtered} variant="region" title="Sales by Region" />

              <section className="table-panel" style={{ paddingBottom: 0 }}>
                <div className="panel-heading">
                  <div>
                    <h2>Sales Records</h2>
                    <p>Filtered rows can be exported as CSV or Excel.</p>
                  </div>
                  <span className="record-count">Page {page} of {totalPages || 1}</span>
                </div>
                <div className="table-scroll">
                  {currentData.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => handleSort("Sale_Date")} style={{ cursor: 'pointer' }}>Sale Date {sortConfig.key === "Sale_Date" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                          <th onClick={() => handleSort("Product_ID")} style={{ cursor: 'pointer' }}>Product {sortConfig.key === "Product_ID" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                          <th onClick={() => handleSort("Region")} style={{ cursor: 'pointer' }}>Region {sortConfig.key === "Region" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                          <th onClick={() => handleSort("Sales_Rep")} style={{ cursor: 'pointer' }}>Sales Rep {sortConfig.key === "Sales_Rep" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                          <th onClick={() => handleSort("Sales_Channel")} style={{ cursor: 'pointer' }}>Channel {sortConfig.key === "Sales_Channel" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                          <th onClick={() => handleSort("Sales_Amount")} className="numeric" style={{ cursor: 'pointer' }}>Sales {sortConfig.key === "Sales_Amount" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                          <th onClick={() => handleSort("Profit")} className="numeric" style={{ cursor: 'pointer' }}>Profit {sortConfig.key === "Profit" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((row, index) => (
                          <tr key={`${row.Product_ID}-${index}`}>
                            <td>{new Date(row.Sale_Date).toLocaleDateString("en-IN")}</td>
                            <td>#{row.Product_ID}</td>
                            <td>Region {Number(row.Region) + 1}</td>
                            <td>Rep {Number(row.Sales_Rep) + 1}</td>
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
                    <p className="empty-state">No sales records match the selected filters.</p>
                  )}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', borderTop: '1px solid var(--color-border)', gap: '16px' }}>
                    <button 
                      className="secondary-button" 
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      <FiChevronLeft /> Previous
                    </button>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                      {page} / {totalPages}
                    </span>
                    <button 
                      className="secondary-button" 
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      style={{ flexDirection: 'row-reverse' }}
                    >
                      <FiChevronRight /> Next
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
    </Layout>
  );
}

export default Sales;
