import { useState } from "react";
import { FiX, FiUploadCloud, FiFileText, FiCheckCircle, FiLoader } from "react-icons/fi";
import Papa from "papaparse";
import { useDataset } from "../contexts/DatasetContext";

import { useNavigate } from "react-router-dom";

const steps = ["Choose Dataset", "Preview Data", "Validate", "Upload", "Processing", "Complete"];

function NewAnalysisModal({ onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const { uploadDataset, analyzeDataset, selectDataset, fetchDatasets } = useDataset();

  const handleNext = async () => {
    setError("");
    try {
      if (currentStep === 0 && file) {
        // Prepare preview
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setHeaders(results.meta.fields || []);
            setPreviewRows(results.data.slice(0, 5));
            setCurrentStep(1);
          },
          error: (err) => setError("Error reading CSV: " + err.message)
        });
        return;
      }

      if (currentStep === 2) {
        // Upload phase
        setCurrentStep(3);
        setIsUploading(true);
        try {
          const ds = await uploadDataset(file);
          setIsUploading(false);
          setCurrentStep(4);
          
          // Auto start processing
          setIsProcessing(true);
          await analyzeDataset(ds.id);
          selectDataset(ds.id);
          setIsProcessing(false);
          setCurrentStep(5);
        } catch (err) {
          setError(err);
          setIsUploading(false);
          setIsProcessing(false);
        }
        return;
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        await fetchDatasets();
        onClose(); // Finish
        navigate("/"); // Navigate to dashboard without refresh
      }
    } catch (err) {
      setError(err);
    }
  };

  const handleBack = () => {
    setError("");
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '800px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        
        <div className="modal-header">
          <h2>New Analysis Workflow</h2>
          <button className="modal-close" onClick={onClose} disabled={isUploading || isProcessing}><FiX /></button>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', padding: '24px', borderBottom: '1px solid var(--color-border)', gap: '8px', background: 'var(--color-surface-alt)', overflowX: 'auto' }}>
          {steps.map((step, index) => (
            <div key={step} style={{ flex: 1, minWidth: '100px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '4px', background: index <= currentStep ? 'var(--color-primary)' : 'var(--color-border)', borderRadius: '2px', transition: 'background 0.3s' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: index <= currentStep ? 'var(--color-text)' : 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Step {index + 1}
              </span>
              <span style={{ fontSize: '12px', color: index <= currentStep ? 'var(--color-text)' : 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="modal-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {error && (
            <div className="error-panel" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-danger)' }}>
                <FiX size={24} />
                <h3 style={{ fontSize: '18px', margin: 0 }}>Analysis Failed</h3>
              </div>
              
              {typeof error === 'object' ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '14px' }}>
                    <strong style={{ color: 'var(--color-text-secondary)' }}>Pipeline Stage:</strong>
                    <span>{error.failed_stage || 'Unknown'}</span>
                    
                    <strong style={{ color: 'var(--color-text-secondary)' }}>Reason:</strong>
                    <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>
                      {error.reason || (error.exception ? `${error.exception}: ${error.message}` : error.message || "Unknown error")}
                    </span>
                    
                    <strong style={{ color: 'var(--color-text-secondary)' }}>Suggestion:</strong>
                    <span style={{ color: 'var(--color-warning)' }}>
                      Check if the dataset contains all required columns (Sale_Date, Sales_Amount, Region, etc.) and valid data types.
                    </span>
                  </div>
                  
                  <details style={{ marginTop: '8px' }}>
                    <summary style={{ cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 500, userSelect: 'none', marginBottom: '8px' }}>
                      View Technical Details
                    </summary>
                    <div style={{ background: 'var(--color-background)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflowX: 'auto', maxHeight: '250px', overflowY: 'auto' }}>
                      <strong style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>Traceback:</strong>
                      <pre style={{ fontSize: '12px', fontFamily: 'monospace', margin: 0, color: 'var(--color-danger)' }}>{error.traceback || error.stderr || "No traceback available."}</pre>
                    </div>
                  </details>
                </>
              ) : (
                <p style={{ fontSize: '14px', color: 'var(--color-text)' }}>{error}</p>
              )}
              
              <div style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                <button className="primary-button" onClick={() => { setError(null); setCurrentStep(0); }} style={{ background: 'var(--color-danger)' }}>
                  Retry Upload
                </button>
              </div>
            </div>
          )}

          {currentStep === 0 && (
            <div 
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-alt)', padding: '40px' }}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <FiUploadCloud size={32} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Select or Drag Dataset</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Upload a CSV file for analysis.</p>
              
              <input type="file" id="file-upload" accept=".csv" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
              
              {file ? (
                <div style={{ padding: '12px 24px', background: 'var(--color-surface)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiFileText /> {file.name}
                  <button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', marginLeft: '8px' }}><FiX /></button>
                </div>
              ) : (
                <button className="primary-button" onClick={() => document.getElementById('file-upload').click()}>
                  Browse Files
                </button>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px' }}>Data Preview</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Review the first few rows of {file?.name}</p>
              
              <div className="table-panel" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border)' }}>
                <div className="table-scroll" style={{ margin: 0, overflow: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        {headers.map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr key={i}>
                          {headers.map(h => <td key={h}>{row[h]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px' }}>Validate Columns</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Ensuring dataset meets ML pipeline requirements.</p>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {headers.slice(0, 5).map((req, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px' }}>{req}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--color-success)' }}>Ready for processing</span>
                    </div>
                    <FiCheckCircle color="var(--color-success)" size={20} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {(currentStep === 3 || currentStep === 4) && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
              <FiLoader size={48} color="var(--color-primary)" className="loading-spinner" />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
                  {currentStep === 3 ? "Uploading Dataset..." : "Running ML Analysis..."}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {currentStep === 3 ? "Storing securely on the server." : "Processing sales forecasting and churn models. This may take a minute."}
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiCheckCircle size={40} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700 }}>Analysis Complete!</h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px' }}>Your dataset has been fully processed and set as the active dataset. The dashboard has been updated.</p>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', background: 'var(--color-surface)' }}>
          <div>
            {currentStep > 0 && currentStep < 3 && (
              <button className="secondary-button" onClick={handleBack}>Back</button>
            )}
          </div>
          <div>
            <button 
              className="primary-button" 
              onClick={handleNext}
              disabled={isUploading || isProcessing || (currentStep === 0 && !file)}
            >
              {currentStep === 2 ? "Upload & Analyze" : currentStep === 5 ? "View Dashboard" : "Continue"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NewAnalysisModal;
