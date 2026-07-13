import { useEffect, useState } from "react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import SalesChart from "../components/SalesChart";
import ForecastChart from "../components/ForecastChart";
import RecentActivity from "../components/RecentActivity";
import Footer from "../components/Footer";

import "../styles/Dashboard.css";

function Dashboard() {

    const [sales, setSales] = useState([]);

    useEffect(() => {

        api.get("/sales")
            .then((response) => {
                setSales(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    const totalSales = sales.reduce(
        (sum, item) => sum + Number(item.Sales_Amount || 0),
        0
    );

    const totalProfit = sales.reduce(
        (sum, item) => sum + Number(item.Profit || 0),
        0
    );

    const totalOrders = sales.length;

    const totalCustomers = new Set(
        sales.map(item => item.Customer_ID || item.Product_ID)
    ).size;

    return (

        <div className="layout">

            <Sidebar />

            <div className="main">

                <Navbar />

                <div className="content">

                    <PageHeader
                        title="Dashboard"
                        subtitle="Business Performance Overview"
                    />

                    <div className="cards">

                        <StatCard
                            title="Total Sales"
                            value={`₹ ${totalSales.toLocaleString()}`}
                        />

                        <StatCard
                            title="Total Profit"
                            value={`₹ ${totalProfit.toLocaleString()}`}
                        />

                        <StatCard
                            title="Orders"
                            value={totalOrders}
                        />

                        <StatCard
                            title="Customers"
                            value={totalCustomers}
                        />

                    </div>

                    <div className="chart-card">

                         <SalesChart sales={sales} />

                     </div>

                    <ForecastChart />

                    <RecentActivity />

                    <div className="table-section">

                        <h2>Recent Sales</h2>

                        <table>

                            <thead>

                                <tr>

                                    <th>Product ID</th>
                                    <th>Region</th>
                                    <th>Sales Rep</th>
                                    <th>Category</th>
                                    <th>Sales</th>
                                    <th>Profit</th>

                                </tr>

                            </thead>

                            <tbody>

                                {sales.slice(0, 15).map((row, index) => (

                                    <tr key={index}>

                                        <td>{row.Product_ID}</td>

                                        <td>{row.Region}</td>

                                        <td>{row.Sales_Rep}</td>

                                        <td>{row.Product_Category}</td>

                                        <td>
                                            ₹ {Number(row.Sales_Amount).toFixed(2)}
                                        </td>

                                        <td>
                                            ₹ {Number(row.Profit || 0).toFixed(2)}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                    <Footer />

                </div>

            </div>

        </div>

    );

}

export default Dashboard;