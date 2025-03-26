import { useState } from "react";
import { Menu, X, LogOut, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo2.png";

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
    { name: "Find a PrepPartner", href: "/friends" },
  ];
  
  // Determine which nav items to show - only show protected items when logged in
  const navItems = userIsLoggedIn ? protectedNavItems : publicNavItems;

  return (
    <header className="py-4">
      <nav className="rounded-full shadow-sm px-8 py-4 transition-all duration-300 bg-white hover:shadow-md">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
          >
            <img src={logo} alt="PrepPartner Logo" className="w-30 h-12" />
       
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-primary font-medium relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <div className="flex items-center gap-4">
              {userIsLoggedIn ? (
                <>
                  <div className="relative group">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors duration-300"
                    >
                      <UserCircle size={20} />
                      <span className="sr-only md:not-sr-only">Profile</span>
                    </Link>
                    <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-background-secondary"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-background-secondary"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium 
                      hover:bg-primary/90 transition-all duration-300 
                      hover:shadow-lg hover:shadow-primary/20 
                      active:transform active:scale-95"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary"
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
                  className="block py-2 text-foreground hover:text-primary font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {userIsLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 w-full py-2 text-foreground hover:text-primary font-medium"
                  >
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 w-full py-2 text-foreground hover:text-primary font-medium"
                  >
                    <UserCircle size={18} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full py-2 text-foreground hover:text-primary font-medium"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block py-2 text-primary font-medium hover:text-primary/90"
                >
                  Login
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
