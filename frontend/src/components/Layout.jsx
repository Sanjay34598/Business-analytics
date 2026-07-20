import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="layout-content">
        <Navbar />

        <main className="page-content">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;