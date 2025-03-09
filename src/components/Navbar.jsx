import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const userIsLoggedIn = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Public nav items always visible
  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Plans & Pricing", href: "/pricing" },
    { name: "Contact Us", href: "/contact" },
  ];
  
  // Protected nav items only visible when logged in
  const protectedNavItems = [
    { name: "Interview Prep", href: "/interview-prep" },
    { name: "Friends", href: "/friends" },
  ];
  
  // Determine which nav items to show
  const navItems = [...publicNavItems, ...(userIsLoggedIn ? protectedNavItems : [])];

  return (
    <header className="py-4">
      <nav className="rounded-full shadow-sm px-8 py-4 transition-all duration-300 bg-white hover:shadow-md">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
          >
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                P
              </span>
            </div>
            <span className="text-xl font-semibold text-teal">PrepPartner</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-primary font-medium relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <div className="flex items-center gap-4">
              {userIsLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 font-medium hover:text-primary transition-colors duration-300"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="text-gray-700 font-medium hover:text-primary transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    className="bg-[#4169FB] text-white px-6 py-2.5 rounded-full font-medium 
                      hover:bg-[#4169FB]/90 transition-all duration-300 
                      hover:shadow-lg hover:shadow-[#4169FB]/20 
                      active:transform active:scale-95"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4">
            <div className="px-4 py-3 space-y-2 bg-white shadow-lg rounded-2xl">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block py-2 text-gray-700 hover:text-primary font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {userIsLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full py-2 text-gray-700 hover:text-primary font-medium"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="block py-2 text-[#4169FB] font-medium hover:text-[#4169FB]/90"
                >
                  Login/Signup
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
