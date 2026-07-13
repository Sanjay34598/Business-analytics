import "../styles/Navbar.css";

function Navbar() {

    const today = new Date().toLocaleDateString();

    return (

        <div className="navbar">

            <div>

                <h2>Business Analytics Dashboard</h2>

            </div>

            <div>

                {today}

            </div>

        </div>

    );

}

export default Navbar;