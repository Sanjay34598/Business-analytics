import { useState, useMemo } from "react";
import { FiDatabase, FiChevronDown, FiSearch, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";
import { useDataset } from "../contexts/DatasetContext";

function DatasetSwitcher() {
  const { datasets, activeDataset, selectDataset } = useDataset();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const completedDatasets = useMemo(() => {
    let filtered = datasets.filter(d => d.status === "Completed");
    if (searchQuery.trim()) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Sort by most recent
    return filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  }, [datasets, searchQuery]);

  const otherDatasets = useMemo(() => {
    let filtered = datasets.filter(d => d.status !== "Completed");
    if (searchQuery.trim()) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  }, [datasets, searchQuery]);

  const handleSelect = (id) => {
    if (id === activeDataset?.id) {
      setIsOpen(false);
      return;
    }
    try {
      selectDataset(id);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 16px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: "14px",
          color: "var(--color-text)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          textAlign: "left"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-primary)" }}>
          <FiDatabase size={16} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
          <span style={{ fontSize: "11px", color: "var(--color-text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>
            Active Dataset
          </span>
          <span>{activeDataset ? activeDataset.name : "Switch Dataset"}</span>
        </div>
        <FiChevronDown size={16} style={{ color: "var(--color-text-secondary)", marginLeft: "8px" }} />
      </button>

      {/* Modal / Dropdown */}
      {isOpen && (
        <>
          <div 
            style={{ position: "fixed", inset: 0, zIndex: 998 }} 
            onClick={() => setIsOpen(false)} 
          />
          <div 
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: "8px",
              width: "400px",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
              zIndex: 999,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "500px"
            }}
          >
            {/* Header */}
            <div style={{ padding: "16px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Switch Dataset</h3>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-alt)" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <FiSearch style={{ position: "absolute", left: "12px", color: "var(--color-text-secondary)" }} />
                <input 
                  type="text" 
                  placeholder="Search datasets..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 36px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    fontSize: "14px",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {completedDatasets.length === 0 && otherDatasets.length === 0 ? (
                <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-text-secondary)" }}>
                  No datasets found.
                </div>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {completedDatasets.map((ds) => (
                    <li 
                      key={ds.id}
                      onClick={() => handleSelect(ds.id)}
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid var(--color-border)",
                        cursor: loadingId === ds.id ? "wait" : "pointer",
                        background: activeDataset?.id === ds.id ? "var(--color-primary-light)" : "transparent",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        transition: "background 0.2s"
                      }}
                      onMouseOver={(e) => {
                        if (activeDataset?.id !== ds.id) e.currentTarget.style.background = "var(--color-surface-alt)";
                      }}
                      onMouseOut={(e) => {
                        if (activeDataset?.id !== ds.id) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <strong style={{ fontSize: "14px", color: "var(--color-text)" }}>{ds.name}</strong>
                          {activeDataset?.id === ds.id && (
                            <span style={{ fontSize: "11px", background: "var(--color-primary)", color: "white", padding: "2px 6px", borderRadius: "10px", fontWeight: 600 }}>
                              Active
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", display: "flex", gap: "12px" }}>
                          <span>{ds.rows.toLocaleString()} rows</span>
                          <span>•</span>
                          <span>{ds.uploadDate.split(',')[0]}</span>
                        </div>
                      </div>
                      {loadingId === ds.id ? (
                        <div className="spinner" style={{ width: "20px", height: "20px", borderTopColor: "var(--color-primary)" }} />
                      ) : activeDataset?.id === ds.id ? (
                        <FiCheck size={20} style={{ color: "var(--color-primary)" }} />
                      ) : null}
                    </li>
                  ))}

                  {otherDatasets.map((ds) => (
                    <li 
                      key={ds.id}
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid var(--color-border)",
                        background: "var(--color-surface-alt)",
                        opacity: 0.7,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <strong style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>{ds.name}</strong>
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", display: "flex", gap: "12px" }}>
                          <span>{ds.rows.toLocaleString()} rows</span>
                          <span>•</span>
                          <span>{ds.uploadDate.split(',')[0]}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 500, color: ds.status === "Failed" ? "var(--color-danger)" : "var(--color-warning)" }}>
                        {ds.status === "Failed" ? <FiAlertCircle /> : null}
                        {ds.status}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DatasetSwitcher;
