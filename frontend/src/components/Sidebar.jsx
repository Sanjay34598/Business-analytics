import { NavLink } from "react-router-dom";
import { FiBarChart2, FiBox, FiFileText, FiGrid, FiTrendingUp, FiUsers, FiDatabase, FiSettings } from "react-icons/fi";
import "../styles/Sidebar.css";

const navigation = [
  { label: "Dashboard", to: "/", icon: FiGrid, end: true },
  { label: "Datasets", to: "/datasets", icon: FiDatabase },
  { label: "Sales", to: "/sales", icon: FiTrendingUp },
  { label: "Forecast", to: "/forecast", icon: FiBarChart2 },
  { label: "Customers", to: "/customers", icon: FiUsers },
  { label: "Recommendations", to: "/inventory", icon: FiBox },
  { label: "Reports", to: "/reports", icon: FiFileText },
];

const bottomNavigation = [
  { label: "Settings", to: "/settings", icon: FiSettings },
];

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">BA</span>
          <div className="brand-info">
            <strong>Business Analytics</strong>
            <span>Decision workspace</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <p className="nav-label">Workspace</p>
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="nav-link">
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
          
          <div style={{ marginTop: 'var(--space-2xl)' }}>
            <p className="nav-label">System</p>
            {bottomNavigation.map(({ label, to, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className="nav-link">
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
      <div className="sidebar-footer">
        <span className="status-dot" aria-hidden="true" />
        <span>Analytics services active</span>
      </div>
    </aside>
  );
}

export default Sidebar;
