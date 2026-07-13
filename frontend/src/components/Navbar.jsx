import React from "react";
import "../styles/Navbar.css";

function Navbar(){

    return(

        <div className="navbar">

            <h2>Dashboard</h2>

            <input
                type="text"
                placeholder="Search..."
            />

        </div>

    )

}

export default Navbar;