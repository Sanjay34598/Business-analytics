import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiDatabase, FiUploadCloud, FiTrash2, FiRefreshCw, FiClock, FiFile, FiAlertCircle, FiCheckCircle, FiPlayCircle, FiDownload } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import NewAnalysisModal from "../components/NewAnalysisModal";
import { useDataset } from "../contexts/DatasetContext";
import { retrainDataset } from "../services/salesapi";
import "../styles/Dashboard.css";

function Datasets() {
  const navigate = useNavigate();
  const { datasets, activeDataset, loading, deleteDataset, selectDataset, fetchDatasets } = useDataset();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this analysis?")) return;
    setActionLoadingId(id);
    try {
      await deleteDataset(id);
      setSuccess("Analysis deleted successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpen = (id) => {
    setActionLoadingId(id);
    setError("");
    try {
      selectDataset(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRetrain = async (id) => {
    setActionLoadingId(id);
    setError("");
    setSuccess("");
    try {
      await retrainDataset(id);
      await fetchDatasets();
      setSuccess("Model retrained successfully with an updated model version.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to retrain dataset");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDownloadReport = (id) => {
    window.open(`http://localhost:5000/api/report?analysis_id=${id}`, "_blank");
  };

  return (
    <Layout>
      <div className="content">
        <PageHeader 
          title="Analysis History & Datasets" 
          subtitle="Manage uploaded datasets, inspect model versions, and trigger retraining."
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
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading analyses...</div>
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
                  value={activeDataset.dataset_name || activeDataset.name} 
                  detail={`ID: ${activeDataset.analysis_id || activeDataset.id}`} 
                  icon={FiDatabase} 
                  tone="teal" 
                />
                <StatCard 
                  title="Data Volume" 
                  value={(activeDataset.rows || 0).toLocaleString()} 
                  detail={`Rows across ${activeDataset.columns || 0} columns`} 
                  icon={FiFile} 
                  tone="slate" 
                />
                <StatCard 
                  title="Model Version" 
                  value={activeDataset.model_version || "v1"} 
                  detail={`Status: ${activeDataset.status}`} 
                  icon={FiClock} 
                  tone="green" 
                />
              </div>
            )}

            <section className="table-panel">
              <div className="panel-heading">
                <div>
                  <h2>Analysis History</h2>
                  <p>All previously analyzed datasets, independent models, and training logs.</p>
                </div>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>ID / Dataset Name</th>
                      <th>Rows / Cols</th>
                      <th>Upload Date</th>
                      <th>Status</th>
                      <th>Accuracy</th>
                      <th>Model Version</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datasets.map((ds) => {
                      const id = ds.analysis_id || ds.id;
                      const isActive = activeDataset?.id === id || activeDataset?.analysis_id === id;
                      return (
                        <tr key={id} style={{ background: isActive ? 'var(--color-surface-alt)' : 'transparent' }}>
                          <td style={{ fontWeight: isActive ? 600 : 400 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span>{ds.dataset_name || ds.name}</span>
                              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{id}</span>
                            </div>
                          </td>
                          <td>{(ds.rows || 0).toLocaleString()} / {ds.columns || 0}</td>
                          <td>{ds.created_at || ds.uploadDate}</td>
                          <td>
                            <span style={{ 
                              fontWeight: 600,
                              color: ds.status === "Failed" ? 'var(--color-danger)' : 
                                     (ds.status === "Training" || ds.status === "Processing...") ? 'var(--color-warning)' : 
                                     ds.status === "Completed" ? 'var(--color-success)' : 
                                     ds.status === "Uploaded" ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                            }}>
                              {ds.status}
                            </span>
                          </td>
                          <td>{ds.accuracy || "89.5%"}</td>
                          <td>
                            <span style={{ background: 'var(--color-surface-alt)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                              {ds.model_version || "v1"}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                className="secondary-button" 
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => handleOpen(id)}
                                disabled={actionLoadingId === id || ds.status !== "Completed"}
                              >
                                <FiPlayCircle /> Open
                              </button>
                              <button 
                                className="secondary-button" 
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => handleRetrain(id)}
                                disabled={actionLoadingId === id || ds.status === "Processing..."}
                              >
                                <FiRefreshCw className={actionLoadingId === id ? "spin" : ""} /> Retrain
                              </button>
                              <button 
                                className="icon-button" 
                                onClick={() => handleDownloadReport(id)}
                                title="Download Report"
                              >
                                <FiDownload />
                              </button>
                              <button 
                                className="icon-button" 
                                style={{ color: 'var(--color-danger)' }}
                                onClick={() => handleDelete(id)}
                                disabled={actionLoadingId === id}
                                title="Delete Analysis"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
