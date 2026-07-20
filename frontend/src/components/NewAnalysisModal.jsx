import { useState, useEffect } from "react";
import { FiX, FiUploadCloud, FiFileText, FiCheckCircle, FiPlay, FiLoader } from "react-icons/fi";

const steps = ["Upload Dataset", "Preview Data", "Validate Columns", "Run Analysis", "Complete"];

function NewAnalysisModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleNext = () => {
    if (currentStep === 3) {
      // Step 4: Run Analysis
      setIsProcessing(true);
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose(); // Finish
      window.location.reload(); // Simulate dashboard refresh
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (isProcessing) {
      // Mock progress simulation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            setCurrentStep(4);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  // Handlers for mock file drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', height: '600px' }}>
        
        <div className="modal-header">
          <h2>New Analysis Workflow</h2>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', padding: '24px', borderBottom: '1px solid var(--color-border)', gap: '16px', background: 'var(--color-surface-alt)' }}>
          {steps.map((step, index) => (
            <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '4px', background: index <= currentStep ? 'var(--color-primary)' : 'var(--color-border)', borderRadius: '2px' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: index <= currentStep ? 'var(--color-text)' : 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Step {index + 1}
              </span>
              <span style={{ fontSize: '13px', color: index <= currentStep ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column' }}>
          {currentStep === 0 && (
            <div 
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-alt)' }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <FiUploadCloud size={32} />
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Drag and drop your dataset here</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>CSV, Excel, or JSON formats up to 50MB</p>
              
              {file ? (
                <div style={{ padding: '12px 24px', background: 'var(--color-surface)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiFileText /> {file.name}
                </div>
              ) : (
                <button className="secondary-button">Browse Files</button>
              )}
              {/* TODO: Connect to backend endpoint for actual file upload */}
            </div>
          )}

          {currentStep === 1 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px' }}>Data Preview</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Review the first few rows of your uploaded dataset to ensure correct parsing.</p>
              
              <div className="table-panel" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div className="table-scroll" style={{ margin: 0, overflowY: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Sale_Date</th><th>Product_ID</th><th>Region</th><th>Sales_Amount</th><th>Customer_Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Mock Data */}
                      <tr><td>2026-07-01</td><td>PROD_948</td><td>0</td><td>₹4,520</td><td>1</td></tr>
                      <tr><td>2026-07-02</td><td>PROD_112</td><td>2</td><td>₹1,250</td><td>0</td></tr>
                      <tr><td>2026-07-02</td><td>PROD_395</td><td>1</td><td>₹8,900</td><td>1</td></tr>
                      <tr><td>2026-07-03</td><td>PROD_948</td><td>3</td><td>₹4,200</td><td>0</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px' }}>Validate Columns</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Map the columns from your dataset to the required schema for analysis.</p>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {["Sale_Date (Date)", "Product_ID (String)", "Sales_Amount (Numeric)", "Customer_Type (Category)"].map((req, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px' }}>{req}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-success)' }}>Auto-mapped successfully</span>
                    </div>
                    <FiCheckCircle color="var(--color-success)" size={20} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
              {isProcessing ? (
                <>
                  <FiLoader size={48} color="var(--color-primary)" className="loading-spinner" />
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Processing Analytics...</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Running machine learning models and generating insights.</p>
                  </div>
                  <div style={{ width: '100%', maxWidth: '400px', height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--color-primary)', transition: 'width 0.3s ease' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>{progress}% Complete</span>
                </>
              ) : (
                <>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiPlay size={32} />
                  </div>
                  <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Ready for Analysis</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>The dataset is validated. We will now run the sales forecast, customer churn, and inventory recommendation models.</p>
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiCheckCircle size={40} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700 }}>Analysis Complete!</h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px' }}>Your dashboard is ready with the latest insights. You can view the full reports or start exploring the data immediately.</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {currentStep > 0 && currentStep < 4 && !isProcessing && (
            <button className="secondary-button" onClick={handleBack}>Back</button>
          )}
          <button 
            className="primary-button" 
            onClick={handleNext}
            disabled={isProcessing || (currentStep === 0 && !file)}
          >
            {currentStep === 3 ? "Run Analysis" : currentStep === 4 ? "View Dashboard" : "Continue"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default NewAnalysisModal;
