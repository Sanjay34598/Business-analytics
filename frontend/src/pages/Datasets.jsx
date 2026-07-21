import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiDatabase, FiUploadCloud, FiTrash2, FiRefreshCw, FiClock, FiFile, FiAlertCircle, FiCheckCircle, FiPlayCircle } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import NewAnalysisModal from "../components/NewAnalysisModal";
import { useDataset } from "../contexts/DatasetContext";
import "../styles/Dashboard.css";

function Datasets() {
  const navigate = useNavigate();
  const { datasets, activeDataset, loading, deleteDataset, activateDataset, analyzeDataset } = useDataset();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dataset?")) return;
    setActionLoading(true);
    try {
      await deleteDataset(id);
      setSuccess("Dataset deleted successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async (id) => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      await activateDataset(id);
      setSuccess("Dataset set as active. Run analysis to update dashboards.");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAnalyze = async (id) => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      // First ensure it's active
      await activateDataset(id);
      // Then analyze
      await analyzeDataset(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setActionLoading(false);
    }
  };

  return (
    <Layout>
      <div className="content">
        <PageHeader 
          title="Dataset Management" 
          subtitle="Manage uploaded datasets, switch active models, and trigger new ML analysis."
          actions={
            <button 
              className="primary-button" 
              onClick={() => setIsUploadModalOpen(true)}
            >
              <FiUploadCloud /> Upload Dataset
            </button>
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

        {loading ? (
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading datasets...</div>
        ) : datasets.length === 0 ? (
          <div className="empty-state" style={{ padding: '64px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <FiDatabase size={32} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>No Datasets Available</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Upload a CSV file to begin analysis.</p>
            <button className="primary-button" style={{ margin: '0 auto' }} onClick={() => setIsUploadModalOpen(true)}>
              Upload Now
            </button>
          </div>
        ) : (
          <>
            {activeDataset && (
              <div className="cards cards--three" style={{ marginBottom: 'var(--space-2xl)' }}>
                <StatCard 
                  title="Active Dataset" 
                  value={activeDataset.name} 
                  detail={`Status: ${activeDataset.status}`} 
                  icon={FiDatabase} 
                  tone="teal" 
                />
                <StatCard 
                  title="Data Volume" 
                  value={activeDataset.rows.toLocaleString()} 
                  detail={`Rows across ${activeDataset.columns} columns`} 
                  icon={FiFile} 
                  tone="slate" 
                />
                <StatCard 
                  title="Uploaded On" 
                  value={activeDataset.uploadDate.split(',')[0]} 
                  detail={activeDataset.uploadDate} 
                  icon={FiClock} 
                  tone="green" 
                />
              </div>
            )}

            <section className="table-panel">
              <div className="panel-heading">
                <div>
                  <h2>Dataset History</h2>
                  <p>All previously uploaded datasets available for analysis.</p>
                </div>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Rows / Cols</th>
                      <th>Uploaded</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datasets.map((ds) => (
                      <tr key={ds.id} style={{ background: ds.active ? 'var(--color-surface-alt)' : 'transparent' }}>
                        <td style={{ fontWeight: ds.active ? 600 : 400 }}>
                          {ds.name} {ds.active && <span style={{ marginLeft: '8px', fontSize: '10px', background: 'var(--color-primary)', color: 'white', padding: '2px 6px', borderRadius: '10px' }}>ACTIVE</span>}
                        </td>
                        <td>{ds.size}</td>
                        <td>{ds.rows.toLocaleString()} / {ds.columns}</td>
                        <td>{ds.uploadDate}</td>
                        <td>
                          <span style={{ 
                            color: ds.status === "Failed" ? 'var(--color-danger)' : 
                                   ds.status === "Processing..." ? 'var(--color-warning)' : 
                                   ds.status === "Completed" ? 'var(--color-success)' : 'var(--color-text-secondary)'
                          }}>
                            {ds.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              className="secondary-button" 
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => handleAnalyze(ds.id)}
                              disabled={actionLoading || ds.status === "Completed" || ds.status === "Processing..."}
                            >
                              <FiPlayCircle /> {ds.status === "Completed" ? "✔ Already Processed" : ds.status === "Processing..." ? "Processing..." : "Analyze"}
                            </button>
                            <button 
                              className="icon-button" 
                              style={{ color: 'var(--color-danger)' }}
                              onClick={() => handleDelete(ds.id)}
                              disabled={actionLoading}
                              title="Delete Dataset"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>

      {isUploadModalOpen && (
        <NewAnalysisModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </Layout>
  );
}

export default Datasets;
