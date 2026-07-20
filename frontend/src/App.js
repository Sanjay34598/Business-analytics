import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Datasets from "./pages/Datasets";
import Forecast from "./pages/Forecast";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
