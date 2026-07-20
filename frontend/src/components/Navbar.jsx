import { FiBell, FiChevronDown } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const pageNames = { "/": "Overview", "/dashboard": "Overview", "/sales": "Sales performance", "/forecast": "Sales forecast", "/customers": "Customer insights", "/inventory": "Product recommendations", "/reports": "Reports" };

function Navbar() {
  const { pathname } = useLocation();
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return (
    <header className="navbar">
      <div className="navbar-context"><span>Analytics workspace</span><strong>{pageNames[pathname] || "Business Analytics"}</strong></div>
      <div className="navbar-actions">
        <span className="reporting-date">Reporting date: {today}</span>
        <button className="icon-button" type="button" aria-label="Notifications"><FiBell /><span className="notification-indicator" /></button>
        <button className="profile-button" type="button" aria-label="Open profile menu"><span>PK</span><FiChevronDown aria-hidden="true" /></button>
      </div>
    </header>
  );
}

export default Navbar;
