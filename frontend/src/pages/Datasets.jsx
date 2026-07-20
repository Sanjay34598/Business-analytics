import { useState } from "react";
import { FiDatabase, FiUploadCloud, FiTrash2, FiDownload, FiRefreshCw, FiClock, FiFile } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import "../styles/Dashboard.css";

function Datasets() {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Mock dataset data
  const datasetInfo = {
    name: "Q3_Sales_Master.csv",
    rows: 15420,
    columns: 12,
    size: "4.2 MB",
    uploadDate: "Oct 12, 2026, 09:41 AM",
    status: "Processed & Active"
  };

  const mockRows = [
    { id: 1, date: "2026-07-01", prod: "PROD_948", region: "North", amount: "₹4,520", type: "New" },
    { id: 2, date: "2026-07-02", prod: "PROD_112", region: "South", amount: "₹1,250", type: "Returning" },
    { id: 3, date: "2026-07-02", prod: "PROD_395", region: "East", amount: "₹8,900", type: "New" },
    { id: 4, date: "2026-07-03", prod: "PROD_948", region: "West", amount: "₹4,200", type: "Returning" },
    { id: 5, date: "2026-07-04", prod: "PROD_112", region: "North", amount: "₹2,100", type: "Returning" },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Navbar />
        <div className="content">
          <PageHeader 
            title="Dataset Management" 
            subtitle="View and manage the core data driving your analytics and machine learning models."
            actions={
              <button className="primary-button">
                <FiUploadCloud /> Upload Dataset
              </button>
            }
          />

          <div className="cards cards--three">
            <StatCard 
              title="Current Dataset" 
              value={datasetInfo.name} 
              detail={`Status: ${datasetInfo.status}`} 
              icon={FiDatabase} 
              tone="teal" 
            />
            <StatCard 
              title="Volume" 
              value={datasetInfo.rows.toLocaleString()} 
              detail={`Rows across ${datasetInfo.columns} columns`} 
              icon={FiFile} 
              tone="slate" 
            />
            <StatCard 
              title="Last Updated" 
              value={datasetInfo.uploadDate.split(',')[0]} 
              detail={datasetInfo.uploadDate.split(',')[1].trim()} 
              icon={FiClock} 
              tone="green" 
            />
          </div>

          <section className="table-panel" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="panel-heading">
              <div>
                <h2>Dataset Information</h2>
                <p>Metadata and management controls for the active dataset.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="secondary-button" style={{ minHeight: '32px', fontSize: '12px' }}>
                  <FiRefreshCw /> Replace
                </button>
                <button className="secondary-button" style={{ minHeight: '32px', fontSize: '12px' }}>
                  <FiDownload /> Download
                </button>
                <button 
                  className="secondary-button text-danger" 
                  style={{ minHeight: '32px', fontSize: '12px', borderColor: 'var(--color-danger-bg)' }}
                  onClick={() => setIsDeleting(true)}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
            
            <dl className="summary-list">
              <div>
                <dt>File Name</dt>
                <dd style={{ fontSize: '15px' }}>{datasetInfo.name}</dd>
              </div>
              <div>
                <dt>File Size</dt>
                <dd style={{ fontSize: '15px' }}>{datasetInfo.size}</dd>
              </div>
              <div>
                <dt>Processing Status</dt>
                <dd style={{ fontSize: '15px', color: 'var(--color-success)' }}>{datasetInfo.status}</dd>
              </div>
            </dl>
          </section>

          <section className="table-panel">
            <div className="panel-heading">
              <div>
                <h2>Data Preview</h2>
                <p>Top 5 rows of the currently loaded dataset.</p>
              </div>
              <span className="record-count">5 / {datasetInfo.rows.toLocaleString()} rows</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sale Date</th>
                    <th>Product ID</th>
                    <th>Region</th>
                    <th className="numeric">Sales Amount</th>
                    <th>Customer Type</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRows.map(row => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.date}</td>
                      <td>{row.prod}</td>
                      <td>{row.region}</td>
                      <td className="numeric">{row.amount}</td>
                      <td>{row.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Delete Modal Mock */}
          {isDeleting && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: '400px' }}>
                <div className="modal-header" style={{ borderBottom: 'none' }}>
                  <h2 style={{ color: 'var(--color-danger)' }}>Delete Dataset?</h2>
                </div>
                <div className="modal-body" style={{ paddingTop: 0 }}>
                  <p>Are you sure you want to delete <strong>{datasetInfo.name}</strong>? This action will disable all analytics until a new dataset is uploaded.</p>
                </div>
                <div className="modal-footer" style={{ background: 'transparent', borderTop: 'none' }}>
                  <button className="secondary-button" onClick={() => setIsDeleting(false)}>Cancel</button>
                  <button className="primary-button" style={{ background: 'var(--color-danger)' }} onClick={() => setIsDeleting(false)}>Delete Dataset</button>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
}

export default Datasets;
