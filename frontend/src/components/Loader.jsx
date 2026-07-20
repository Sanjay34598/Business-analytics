function Loader({ label = "Loading analytics..." }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span style={{ fontWeight: 500, fontSize: "13px", color: "var(--color-text-secondary)" }}>{label}</span>
    </div>
  );
}

export default Loader;
