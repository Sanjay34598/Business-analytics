import React, { useEffect, useState } from "react";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

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

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">

                <Navbar />

                <div className="dashboard">

                    <h1>Business Analytics Dashboard</h1>

                    <p className="subtitle">
                        Overview of your business performance
                    </p>

                    <div className="cards">

                        <div className="card">

                            <h3>Total Sales</h3>

                            <h2>
                                ₹ {totalSales.toLocaleString(undefined, {
                                    maximumFractionDigits: 2
                                })}
                            </h2>

                        </div>

                        <div className="card">

                            <h3>Total Profit</h3>

                            <h2>
                                ₹ {totalProfit.toLocaleString(undefined, {
                                    maximumFractionDigits: 2
                                })}
                            </h2>

                        </div>

                        <div className="card">

                            <h3>Total Orders</h3>

                            <h2>{totalOrders}</h2>

                        </div>

                    </div>

                    <div className="table-container">

                        <h2>Recent Sales</h2>

                        <table>

                            <thead>

                                <tr>

                                    <th>Product ID</th>
                                    <th>Region</th>
                                    <th>Sales Rep</th>
                                    <th>Sales</th>
                                    <th>Profit</th>

                                </tr>

                            </thead>

                            <tbody>

                                {sales.slice(0, 20).map((item, index) => (

                                    <tr key={index}>

                                        <td>{item.Product_ID}</td>

                                        <td>{item.Region_and_Sales_Rep}</td>

                                        <td>{item.Sales_Rep}</td>

                                        <td>
                                            ₹ {Number(item.Sales_Amount).toFixed(2)}
                                        </td>

                                        <td>
                                            ₹ {Number(item.Profit).toFixed(2)}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;