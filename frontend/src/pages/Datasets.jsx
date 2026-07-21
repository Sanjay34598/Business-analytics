import { useRef, useState } from "react";
import { FiDatabase, FiUploadCloud, FiTrash2, FiDownload, FiRefreshCw, FiClock, FiFile, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import Papa from "papaparse";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import "../styles/Dashboard.css";

function Datasets() {
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [datasetInfo, setDatasetInfo] = useState({
    name: "Q3_Sales_Master.csv",
    rows: 15420,
    columns: 12,
    size: "4.2 MB",
    uploadDate: "Oct 12, 2026, 09:41 AM",
    status: "Processed & Active",
    headers: ["ID", "Sale Date", "Product ID", "Region", "Sales Amount", "Customer Type"]
  });

  const [previewRows, setPreviewRows] = useState([
    { "ID": 1, "Sale Date": "2026-07-01", "Product ID": "PROD_948", "Region": "North", "Sales Amount": "₹4,520", "Customer Type": "New" },
    { "ID": 2, "Sale Date": "2026-07-02", "Product ID": "PROD_112", "Region": "South", "Sales Amount": "₹1,250", "Customer Type": "Returning" },
    { "ID": 3, "Sale Date": "2026-07-02", "Product ID": "PROD_395", "Region": "East", "Sales Amount": "₹8,900", "Customer Type": "New" },
    { "ID": 4, "Sale Date": "2026-07-03", "Product ID": "PROD_948", "Region": "West", "Sales Amount": "₹4,200", "Customer Type": "Returning" },
    { "ID": 5, "Sale Date": "2026-07-04", "Product ID": "PROD_112", "Region": "North", "Sales Amount": "₹2,100", "Customer Type": "Returning" },
  ]);

  const processFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setError("Please upload a valid CSV file.");
      setSuccess("");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsUploading(false);
        if (results.errors.length > 0) {
          setError("Error parsing CSV: " + results.errors[0].message);
          return;
        }

        const data = results.data;
        const headers = results.meta.fields || [];
        
        setDatasetInfo({
          name: file.name,
          rows: data.length,
          columns: headers.length,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          uploadDate: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          status: "Processed & Active",
          headers: headers
        });

        setPreviewRows(data.slice(0, 5));
        setSuccess(`Dataset '${file.name}' uploaded and processed successfully.`);
      },
      error: (err) => {
        setIsUploading(false);
        setError("Error reading file: " + err.message);
      }
    });
  };

  const handleFileUpload = (event) => {
    processFile(event.target.files?.[0]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleDelete = () => {
    setIsDeleting(false);
    setDatasetInfo(null);
    setPreviewRows([]);
    setSuccess("Dataset deleted successfully.");
    setError("");
  };

  return (
    <Layout>
      <div 
        className="content" 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{ border: isDragging ? '2px dashed var(--color-primary)' : 'none', minHeight: '100%' }}
      >
          <PageHeader 
            title="Dataset Management" 
            subtitle="View and manage the core data driving your analytics and machine learning models."
            actions={
              <>
                <input 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef} 
                  style={{ display: "none" }} 
                  onChange={handleFileUpload}
                />
                <button 
                  className="primary-button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <FiUploadCloud /> {isUploading ? "Uploading..." : "Upload Dataset"}
                </button>
              </>
            }
          />

          {error && (
            <div style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-danger)' }}>
              <FiAlertCircle /> <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-success)' }}>
              <FiCheckCircle /> <span>{success}</span>
            </div>
          )}

          {datasetInfo ? (
            <>
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
                  detail={datasetInfo.uploadDate.split(',').slice(1).join(',').trim()} 
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
                    <button className="secondary-button" style={{ minHeight: '32px', fontSize: '12px' }} onClick={() => fileInputRef.current?.click()}>
                      <FiRefreshCw /> Replace
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
                  <span className="record-count">{Math.min(5, datasetInfo.rows)} / {datasetInfo.rows.toLocaleString()} rows</span>
                </div>
                <div className="table-scroll" style={{ maxWidth: '100%', overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        {datasetInfo.headers.map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr key={i}>
                          {datasetInfo.headers.map((header, j) => (
                            <td key={j}>{row[header]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : (
            <div className="empty-state" style={{ padding: '64px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <FiUploadCloud size={32} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>No Dataset Active</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Upload a CSV file to begin analysis or use drag and drop.</p>
              <button className="primary-button" style={{ margin: '0 auto' }} onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </button>
            </div>
          )}

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
                  <button className="primary-button" style={{ background: 'var(--color-danger)' }} onClick={handleDelete}>Delete Dataset</button>
                </div>
              </div>
            </div>
          )}
        </div>
    </Layout>
  );
}

export default Datasets;
