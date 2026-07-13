import { NavLink } from "react-router-dom";

import "../styles/Sidebar.css";

function Sidebar(){

    return(

        <div className="sidebar">

            <div className="logo">

                Business Analytics

            </div>

            <ul>

                <li>

                    <NavLink to="/">Dashboard</NavLink>

                </li>

                <li>

                    <NavLink to="/sales">Sales</NavLink>

                </li>

                <li>

                    <NavLink to="/forecast">Forecast</NavLink>

                </li>

                <li>

                    <NavLink to="/customers">Customers</NavLink>

                </li>

                <li>

                    <NavLink to="/inventory">Inventory</NavLink>

                </li>

                <li>

                    <NavLink to="/reports">Reports</NavLink>

                </li>

            </ul>

        </div>

    );

}

export default Sidebar;