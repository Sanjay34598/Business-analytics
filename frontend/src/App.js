import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Forecast from "./pages/Forecast";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Dashboard />} />

                <Route path="/sales" element={<Sales />} />

                <Route path="/forecast" element={<Forecast />} />

                <Route path="/customers" element={<Customers />} />

                <Route path="/inventory" element={<Inventory />} />

                <Route path="/reports" element={<Reports />} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;