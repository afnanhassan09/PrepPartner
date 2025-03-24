import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/auth');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-72 bg-background-secondary/50 border-r border-border/50 overflow-y-auto">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-border/50">
          <h1 className="text-2xl font-bold text-teal">Interview AI</h1>
          <p className="text-sm text-muted">Professional Interview Assistant</p>
        </div>
        
        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 p-3 rounded-lg hover:bg-teal/10 text-muted hover:text-teal transition-colors ${
              location.pathname === '/dashboard' ? 'bg-teal/10 text-teal' : ''
            }`}
          >
            <DashboardIcon /> Dashboard
          </Link>
          <Link 
            to="/interview" 
            className={`flex items-center gap-2 p-3 rounded-lg hover:bg-teal/10 text-muted hover:text-teal transition-colors ${
              location.pathname === '/interview' ? 'bg-teal/10 text-teal' : ''
            }`}
          >
            <VideoIcon /> Interview
          </Link>
          <Link 
            to="/history" 
            className={`flex items-center gap-2 p-3 rounded-lg hover:bg-teal/10 text-muted hover:text-teal transition-colors ${
              location.pathname === '/history' ? 'bg-teal/10 text-teal' : ''
            }`}
          >
            <HistoryIcon /> History
          </Link>
          <Link 
            to="/settings" 
            className={`flex items-center gap-2 p-3 rounded-lg hover:bg-teal/10 text-muted hover:text-teal transition-colors ${
              location.pathname === '/settings' ? 'bg-teal/10 text-teal' : ''
            }`}
          >
            <SettingsIcon /> Settings
          </Link>
        </nav>

        {/* Pro Badge */}
        <div className="p-4 mx-4 mt-8 rounded-lg bg-secondary">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary text-primary-foreground">PRO</span>
            <span className="text-sm text-teal">Pro Account</span>
          </div>
          <p className="text-xs text-muted mt-2">Access to all premium features</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-border/50 bg-background-secondary/50 px-6 flex items-center justify-between">
          {/* Page Title */}
          <h2 className="text-lg font-semibold text-teal">
            {location.pathname === '/interview' ? 'Interview Session' : 'Dashboard'}
          </h2>

          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-teal/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <UserIcon />
              </div>
              <span className="text-sm font-medium">John Doe</span>
              <ChevronDownIcon />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-background border border-border shadow-lg py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors">Profile</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors">Settings</button>
                <div className="border-t border-border my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-secondary/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Icon components (you can replace with your preferred icon library)
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16M4 12h16M4 19h16"/>
  </svg>
);

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeWidth="2" d="M15 10l5-5v14l-5-5v-4zM13 6H3a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z"/>
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6l4 4 4-4"/>
  </svg>
);

export default DashboardLayout; 