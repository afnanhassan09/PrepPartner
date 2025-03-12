import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 bg-transparent transition-all duration-300">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          <Navbar />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
