import { useState } from "react";
import { FiSave, FiUser, FiMonitor, FiGlobe, FiInfo } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/Dashboard.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("preferences");
  const { theme, setTheme } = useTheme();
  
  return (
    <Layout>
      <div className="content">
          <PageHeader 
            title="Settings" 
            subtitle="Manage your workspace preferences, profile, and system configurations."
            actions={
              <button className="primary-button">
                <FiSave /> Save Changes
              </button>
            }
          />

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
            
            <nav className="settings-nav">
              <button 
                className={`settings-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <FiMonitor /> Preferences
              </button>
              <button 
                className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FiUser /> Profile
              </button>
              <button 
                className={`settings-nav-item ${activeTab === 'localization' ? 'active' : ''}`}
                onClick={() => setActiveTab('localization')}
              >
                <FiGlobe /> Localization
              </button>
              <button 
                className={`settings-nav-item ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                <FiInfo /> About
              </button>
            </nav>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
              
              {activeTab === 'preferences' && (
                <section className="table-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Workspace Preferences</h2>
                      <p>Customize the look and feel of your dashboard.</p>
                    </div>
                  </div>
                  <div className="filter-panel" style={{ flexDirection: 'column', alignItems: 'stretch', boxShadow: 'none', border: 'none', padding: 0 }}>
                    <label>
                      Theme
                      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                      </select>
                    </label>
                    <label style={{ marginTop: '16px' }}>
                      Default View on Login
                      <select defaultValue="dashboard">
                        <option value="dashboard">Overview Dashboard</option>
                        <option value="sales">Sales Performance</option>
                        <option value="forecast">Forecast Results</option>
                      </select>
                    </label>
                  </div>
                </section>
              )}

              {activeTab === 'profile' && (
                <section className="table-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Profile Information</h2>
                      <p>Manage your personal details and account settings.</p>
                    </div>
                  </div>
                  <div className="filter-panel" style={{ flexDirection: 'column', alignItems: 'stretch', boxShadow: 'none', border: 'none', padding: 0 }}>
                    <label>
                      Full Name
                      <input type="text" defaultValue="PK Administrator" />
                    </label>
                    <label style={{ marginTop: '16px' }}>
                      Email Address
                      <input type="email" defaultValue="admin@businessanalytics.com" />
                    </label>
                    <label style={{ marginTop: '16px' }}>
                      Role
                      <input type="text" defaultValue="System Administrator" disabled style={{ background: 'var(--color-surface-alt)' }} />
                    </label>
                  </div>
                </section>
              )}

              {activeTab === 'localization' && (
                <section className="table-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Localization Settings</h2>
                      <p>Configure region, currency, and date formats.</p>
                    </div>
                  </div>
                  <div className="filter-panel" style={{ flexDirection: 'column', alignItems: 'stretch', boxShadow: 'none', border: 'none', padding: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <label>
                        Language
                        <select defaultValue="en">
                          <option value="en">English (US)</option>
                          <option value="en-gb">English (UK)</option>
                          <option value="es">Spanish</option>
                        </select>
                      </label>
                      <label>
                        Default Currency
                        <select defaultValue="inr">
                          <option value="inr">₹ Indian Rupee (INR)</option>
                          <option value="usd">$ US Dollar (USD)</option>
                          <option value="eur">€ Euro (EUR)</option>
                        </select>
                      </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                      <label>
                        Date Format
                        <select defaultValue="in">
                          <option value="in">DD/MM/YYYY</option>
                          <option value="us">MM/DD/YYYY</option>
                          <option value="iso">YYYY-MM-DD</option>
                        </select>
                      </label>
                      <label>
                        Export Format
                        <select defaultValue="csv">
                          <option value="csv">CSV Document</option>
                          <option value="xlsx">Excel (XLSX)</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'about' && (
                <section className="table-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>About Business Analytics</h2>
                      <p>System information and version details.</p>
                    </div>
                  </div>
                  <dl className="summary-list" style={{ marginTop: 0 }}>
                    <div>
                      <dt>Frontend Version</dt>
                      <dd style={{ fontSize: '15px' }}>v2.4.0 (React 19)</dd>
                    </div>
                    <div>
                      <dt>Backend API</dt>
                      <dd style={{ fontSize: '15px' }}>v1.8.0 (Flask)</dd>
                    </div>
                    <div>
                      <dt>ML Models</dt>
                      <dd style={{ fontSize: '15px' }}>Scikit-Learn v1.5</dd>
                    </div>
                  </dl>
                </section>
              )}

            </div>
          </div>
          
        </div>
    </Layout>
  );
}

export default Settings;
