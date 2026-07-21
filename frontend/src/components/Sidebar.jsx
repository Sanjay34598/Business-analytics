import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiBarChart2, FiBox, FiFileText, FiGrid, FiTrendingUp, FiUsers, FiDatabase, FiSettings, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/Sidebar.css";

const analyticsNav = [
  { label: "Dashboard", to: "/", icon: FiGrid, end: true },
  { label: "Sales", to: "/sales", icon: FiTrendingUp },
  { label: "Forecast", to: "/forecast", icon: FiBarChart2 },
  { label: "Customers", to: "/customers", icon: FiUsers },
  { label: "Recommendations", to: "/inventory", icon: FiBox },
  { label: "Reports", to: "/reports", icon: FiFileText },
];

const dataNav = [
  { label: "Datasets", to: "/datasets", icon: FiDatabase },
];

const systemNav = [
  { label: "Settings", to: "/settings", icon: FiSettings },
];

function Sidebar({ isCollapsed, setIsCollapsed }) {

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} aria-label="Primary navigation">
      <div>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">BA</span>
          {!isCollapsed && (
            <div className="brand-info">
              <strong>Business Analytics</strong>
              <span>Enterprise Edition</span>
            </div>
          )}
          <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-group">
            {!isCollapsed && <p className="nav-label">Analytics</p>}
            {analyticsNav.map(({ label, to, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className="nav-link" title={isCollapsed ? label : ""}>
                <Icon aria-hidden="true" />
                {!isCollapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>

          <div className="nav-group" style={{ marginTop: 'var(--space-xl)' }}>
            {!isCollapsed && <p className="nav-label">Data Management</p>}
            {dataNav.map(({ label, to, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className="nav-link" title={isCollapsed ? label : ""}>
                <Icon aria-hidden="true" />
                {!isCollapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
          
          <div className="nav-group" style={{ marginTop: 'var(--space-xl)' }}>
            {!isCollapsed && <p className="nav-label">System</p>}
            {systemNav.map(({ label, to, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className="nav-link" title={isCollapsed ? label : ""}>
                <Icon aria-hidden="true" />
                {!isCollapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
      
      {!isCollapsed && (
        <div className="sidebar-footer">
          <span className="status-dot" aria-hidden="true" />
          <span>System Online</span>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
