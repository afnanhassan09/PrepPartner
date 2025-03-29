import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Redirect to dashboard after successful authentication
      if (activeTab === "login") {
        navigate("/dashboard");
      } else {
        // Show success message and switch to login
        alert("Account created successfully! Please log in.");
        setActiveTab("login");
      }
    }, 1500);
  };

  return (
    <div className="auth-container">
      {/* Left Column - Illustration/Branding */}
      <div className="auth-branding">
        <div className="branding-content">
          <div className="logo-container">
            <div className="logo-icon">
              <span className="logo-letter">P</span>
            </div>
            <h1 className="logo-text">PrepPartner</h1>
          </div>

          <h2 className="branding-tagline">Your Path to Interview Success</h2>

          <div className="illustration-container">
            <div className="illustration-blob"></div>
            <img
              src="https://media.datacamp.com/cms/74e82d72d2b6161c1fb1ddc40dc77bad.png"
              alt="PrepPartner Interview Preparation"
              className="branding-illustration"
            />
          </div>

          <div className="feature-badges">
            <div className="feature-badge">
              <span className="badge-icon">✓</span>
              <span className="badge-text">AI-Powered Practice</span>
            </div>
            <div className="feature-badge">
              <span className="badge-icon">✓</span>
              <span className="badge-text">Realtime Feedback</span>
            </div>
            <div className="feature-badge">
              <span className="badge-icon">✓</span>
              <span className="badge-text">Expert Guidance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`tab-button ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`tab-button ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-forms-wrapper">
            <div
              className={`auth-forms-slider ${
                activeTab === "signup" ? "slide-left" : ""
              }`}
            >
              {/* Login Form */}
              <div className="auth-form">
                <h2 className="form-title">Welcome Back</h2>
                <p className="form-subtitle">
                  Enter your credentials to access your account
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="floating-label">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder=" "
                      />
                      <span className="label-text">Email Address</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="floating-label">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder=" "
                      />
                      <span className="label-text">Password</span>
                    </label>
                  </div>

                  <div className="form-options">
                    <div className="remember-me">
                      <input
                        type="checkbox"
                        id="remember"
                        className="checkbox"
                      />
                      <label htmlFor="remember">Remember me</label>
                    </div>
                    <a href="#" className="forgot-password">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? <span className="spinner"></span> : "Login"}
                  </button>

                  <div className="auth-divider">
                    <span>Or continue with</span>
                  </div>

                  <div className="social-providers">
                    <button type="button" className="social-button google">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          fill="currentColor"
                          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                        />
                      </svg>
                      Google
                    </button>
                    <button type="button" className="social-button linkedin">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          fill="currentColor"
                          d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                        />
                      </svg>
                      LinkedIn
                    </button>
                  </div>

                  <p className="auth-switch">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("signup")}
                    >
                      Sign up
                    </button>
                  </p>
                </form>
              </div>

              {/* Signup Form */}
              <div className="auth-form">
                <h2 className="form-title">Create Account</h2>
                <p className="form-subtitle">
                  Fill in your details to get started with PrepPartner
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="floating-label">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder=" "
                      />
                      <span className="label-text">Full Name</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="floating-label">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder=" "
                      />
                      <span className="label-text">Email Address</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="floating-label">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder=" "
                      />
                      <span className="label-text">Password</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="floating-label">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder=" "
                      />
                      <span className="label-text">Confirm Password</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="spinner"></span>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <div className="auth-divider">
                    <span>Or continue with</span>
                  </div>

                  <div className="social-providers">
                    <button type="button" className="social-button google">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          fill="currentColor"
                          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                        />
                      </svg>
                      Google
                    </button>
                    <button type="button" className="social-button linkedin">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          fill="currentColor"
                          d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                        />
                      </svg>
                      LinkedIn
                    </button>
                  </div>

                  <p className="auth-switch">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setActiveTab("login")}>
                      Login
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
