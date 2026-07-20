import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card">
        <section className="login-left">
          <h1>Business Analytics</h1>
          <p>Review sales performance, forecasting output, customer insights, and product recommendations from one focused workspace.</p>
        </section>
        <section className="login-right">
          <h2>Open your workspace</h2>
          <p className="login-description">
            The dashboard uses the connected analytics services to present the latest available model results.
          </p>
          <button type="button" onClick={() => navigate("/")}>
            Open Dashboard
          </button>
          <p className="footer-text">Business Analytics &middot; Decision Intelligence Workspace</p>
        </section>
      </div>
    </div>
  );
}

export default Login;
