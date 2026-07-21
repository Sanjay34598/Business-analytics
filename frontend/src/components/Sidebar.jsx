import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiBarChart2, FiBox, FiFileText, FiGrid, FiTrendingUp, FiUsers, FiDatabase, FiSettings, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
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

function Sidebar({ isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const closeMobileMenu = () => {
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileMenu} aria-hidden="true" />
      )}
      
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Primary navigation">
        <div>
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">BA</span>
            {!isCollapsed && (
              <div className="brand-info">
                <strong>Business Analytics</strong>
                <span>Enterprise Edition</span>
              </div>
            )}
            
            {/* Desktop Collapse Button */}
            <button className="collapse-btn desktop-only" onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
            
            {/* Mobile Close Button */}
            <button className="collapse-btn mobile-only" onClick={closeMobileMenu} aria-label="Close menu">
              <FiX />
            </button>
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-group">
              {!isCollapsed && <p className="nav-label">Analytics</p>}
              {analyticsNav.map(({ label, to, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className="nav-link" title={isCollapsed ? label : ""} onClick={closeMobileMenu}>
                  <Icon aria-hidden="true" />
                  {!isCollapsed && <span>{label}</span>}
                </NavLink>
              ))}
            </div>

            <div className="nav-group" style={{ marginTop: 'var(--space-xl)' }}>
              {!isCollapsed && <p className="nav-label">Data Management</p>}
              {dataNav.map(({ label, to, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className="nav-link" title={isCollapsed ? label : ""} onClick={closeMobileMenu}>
                  <Icon aria-hidden="true" />
                  {!isCollapsed && <span>{label}</span>}
                </NavLink>
              ))}
            </div>
            
            <div className="nav-group" style={{ marginTop: 'var(--space-xl)' }}>
              {!isCollapsed && <p className="nav-label">System</p>}
              {systemNav.map(({ label, to, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className="nav-link" title={isCollapsed ? label : ""} onClick={closeMobileMenu}>
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
    </>
  );
}

export default Sidebar;
