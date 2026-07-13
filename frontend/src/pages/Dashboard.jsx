import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/dashboard.css";

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

        <div className="dashboard">

            <h1>Business Analytics Dashboard</h1>

            <div className="cards">

                <div className="card">
                    <h3>Total Sales</h3>
                    <p>₹ {totalSales.toFixed(2)}</p>
                </div>

                <div className="card">
                    <h3>Total Profit</h3>
                    <p>₹ {totalProfit.toFixed(2)}</p>
                </div>

                <div className="card">
                    <h3>Total Orders</h3>
                    <p>{totalOrders}</p>
                </div>

            </div>

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
                            <td>{item.Sales_Amount}</td>
                            <td>{item.Profit}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Dashboard;