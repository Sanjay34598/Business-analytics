import { useEffect, useState } from "react";

import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";

import "../styles/Dashboard.css";

function Dashboard() {

    const [sales, setSales] = useState([]);

    useEffect(() => {

        api.get("/sales")

        .then((response)=>{

            setSales(response.data);

        });

    },[]);

    const totalSales = sales.reduce(

        (sum,item)=>sum+Number(item.Sales_Amount||0),

        0

    );

    const totalProfit = sales.reduce(

        (sum,item)=>sum+Number(item.Profit||0),

        0

    );

    return(

        <div className="layout">

            <Sidebar/>

            <div className="main">

                <Navbar/>

                <div className="content">

                    <PageHeader

                        title="Dashboard"

                        subtitle="Business Performance Overview"

                    />

                    <div className="cards">

                        <StatCard

                            title="Total Sales"

                            value={`₹ ${totalSales.toFixed(0)}`}

                        />

                        <StatCard

                            title="Total Profit"

                            value={`₹ ${totalProfit.toFixed(0)}`}

                        />

                        <StatCard

                            title="Orders"

                            value={sales.length}

                        />

                        <StatCard

                            title="Products"

                            value="1000"

                        />

                    </div>

                    <div className="table-section">

                        <table>

                            <thead>

                                <tr>

                                    <th>Product</th>

                                    <th>Region</th>

                                    <th>Sales Rep</th>

                                    <th>Sales</th>

                                    <th>Profit</th>

                                </tr>

                            </thead>

                            <tbody>

                                {sales.slice(0,10).map((row,index)=>(

                                    <tr key={index}>

                                        <td>{row.Product_ID}</td>

                                        <td>{row.Region}</td>

                                        <td>{row.Sales_Rep}</td>

                                        <td>{row.Sales_Amount}</td>

                                        <td>{row.Profit}</td>

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