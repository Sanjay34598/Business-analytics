import "../styles/Navbar.css";

function Navbar() {

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (

        <nav className="navbar">

            <div className="navbar-left">

                <h2>Business Analytics Dashboard</h2>

                <p>Business Insights & Analytics</p>

            </div>

            <div className="navbar-right">

                <input
                    type="text"
                    placeholder="Search..."
                />

                <span className="date">
                    {today}
                </span>

                <div className="profile">

                    PK

                </div>

            </div>

        </nav>

    );

}

export default Navbar;