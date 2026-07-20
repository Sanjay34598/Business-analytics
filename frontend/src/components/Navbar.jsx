import { useState, useRef, useEffect } from "react";
import { FiBell, FiChevronDown, FiSearch, FiPlus, FiSettings, FiUser, FiLogOut, FiInfo, FiCheckCircle, FiSun, FiMoon } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import NewAnalysisModal from "./NewAnalysisModal";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/Navbar.css";

const pageNames = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/datasets": "Datasets",
  "/sales": "Sales Performance",
  "/forecast": "Sales Forecast",
  "/customers": "Customer Insights",
  "/inventory": "Product Recommendations",
  "/reports": "Reports",
  "/settings": "Settings",
  "/login": "Workspace Login"
};

const mockNotifications = [
  { id: 1, text: "Dataset 'Q3_Sales.csv' uploaded successfully", time: "2m ago", read: false },
  { id: 2, text: "Forecast model processing completed", time: "1h ago", read: false },
  { id: 3, text: "Customer segments updated", time: "3h ago", read: true },
];

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const { theme, toggleTheme } = useTheme();
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <div className="navbar-context">
            <span>Analytics Workspace</span>
            <strong>{pageNames[pathname] || "Business Analytics"}</strong>
          </div>
        </div>

        <div className="navbar-center">
          <div className="global-search">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search data, reports, or settings..." />
            <span className="search-shortcut">⌘K</span>
          </div>
        </div>

        <div className="navbar-actions">
          <span className="reporting-date">{today}</span>
          
          <button 
            className="primary-button new-analysis-btn" 
            onClick={() => setIsAnalysisModalOpen(true)}
          >
            <FiPlus /> New Analysis
          </button>

          <div className="dropdown-container" ref={notificationRef}>
            <button 
              className="icon-button" 
              type="button" 
              aria-label="Notifications"
              onClick={() => {
                setShowNotificationMenu(!showNotificationMenu);
                setShowProfileMenu(false);
              }}
            >
              <FiBell />
              {unreadCount > 0 && <span className="notification-indicator" />}
            </button>
            
            {showNotificationMenu && (
              <div className="dropdown-menu notification-menu">
                <div className="dropdown-header">
                  <span>Notifications</span>
                  <div className="notification-actions">
                    <button onClick={markAllRead}>Mark read</button>
                    <button onClick={clearNotifications}>Clear</button>
                  </div>
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className={`notification-item ${!n.read ? "unread" : ""}`}>
                        <div className="notification-icon">
                          <FiCheckCircle />
                        </div>
                        <div className="notification-content">
                          <p>{n.text}</p>
                          <span>{n.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notification-empty">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="dropdown-container" ref={profileRef}>
            <button 
              className="profile-button" 
              type="button" 
              aria-label="Open profile menu"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotificationMenu(false);
              }}
            >
              <span>PK</span>
              <FiChevronDown aria-hidden="true" />
            </button>

            {showProfileMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  Administrator
                </div>
                <button className="dropdown-item" onClick={() => { navigate("/settings"); setShowProfileMenu(false); }}>
                  <FiUser /> Profile Info
                </button>
                <button className="dropdown-item" onClick={() => { navigate("/settings"); setShowProfileMenu(false); }}>
                  <FiSettings /> Settings
                </button>
                <button className="dropdown-item">
                  <FiInfo /> About Project
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={toggleTheme}>
                  {theme === "light" ? <FiMoon /> : <FiSun />} Toggle Theme
                </button>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isAnalysisModalOpen && (
        <NewAnalysisModal onClose={() => setIsAnalysisModalOpen(false)} />
      )}
    </>
  );
}

export default Navbar;
