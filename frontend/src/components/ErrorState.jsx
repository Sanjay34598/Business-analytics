import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import "../styles/Dashboard.css"; // Reuse existing generic styles

function ErrorState({ title = "Data Unavailable", message = "The dashboard data could not be loaded.", onRetry }) {
  return (
    <div className="error-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-3xl) var(--space-xl)', textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-danger-bg)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
        <FiAlertCircle size={24} />
      </div>
      <h3 style={{ margin: '0 0 var(--space-xs) 0', color: 'var(--color-text-primary)' }}>{title}</h3>
      <p style={{ margin: '0 0 var(--space-lg) 0', color: 'var(--color-text-secondary)', maxWidth: '400px' }}>{message}</p>
      {onRetry && (
        <button type="button" className="secondary-button" onClick={onRetry}>
          <FiRefreshCw /> Retry Connection
        </button>
      )}
    </div>
  );
}

export default ErrorState;
