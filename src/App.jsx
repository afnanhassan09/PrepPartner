// Add global toast styles
const globalToastStyles = document.createElement("style");
globalToastStyles.innerHTML = `
  /* Global toast styling to ensure they're above everything */
  :root {
    --toast-z-index: 999999;
  }

  .toast-viewport, 
  div[data-radix-toast-viewport],
  div[data-sonner-toaster],
  [role="toast"],
  .toast-container {
    position: fixed !important;
    z-index: var(--toast-z-index) !important;
    top: 1rem !important;
    right: 1rem !important;
    left: auto !important;
    bottom: auto !important;
  }

  /* Toast elements themselves */
  [role="toast"],
  div[data-radix-toast],
  div[data-sonner-toast] {
    z-index: var(--toast-z-index) !important;
    position: relative !important;
  }
`;
document.head.appendChild(globalToastStyles); 

// Import the new component at the top
import VerifyEmail from './pages/VerifyEmail';

// ... existing imports ...

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        {/* Add the new verification route */}
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* Other existing routes */}
      </Routes>
    </Router>
  );
}

export default App; 