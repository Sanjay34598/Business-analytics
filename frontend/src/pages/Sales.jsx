import { useEffect,useState } from "react";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

import { getSales } from "../services/salesApi";

import "../styles/Dashboard.css";

function Sales(){

    const [sales,setSales]=useState([]);

    const [search,setSearch]=useState("");

    useEffect(()=>{

        getSales().then((data)=>{

            setSales(data);

        });

    },[]);

    const filtered=sales.filter((item)=>{

        return(

            item.Region

            ?.toLowerCase()

            .includes(search.toLowerCase())

        );

    });

    return(

        <div className="layout">

            <Sidebar/>

            <div className="main">

                <Navbar/>

                <div className="content">

                    <h1>Sales</h1>

                    <input

                        placeholder="Search Region"

                        value={search}

                        onChange={(e)=>setSearch(e.target.value)}

                        style={{

                            padding:"10px",

                            width:"250px",

                            marginBottom:"20px"

                        }}

                    />

                    <table>

                        <thead>

                            <tr>

                                <th>Product</th>

                                <th>Region</th>

                                <th>Sales</th>

                                <th>Profit</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                filtered.map((item,index)=>(

                                    <tr key={index}>

                                        <td>{item.Product_ID}</td>

                                        <td>{item.Region}</td>

                                        <td>{item.Sales_Amount}</td>

                                        <td>{item.Profit}</td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Sales;