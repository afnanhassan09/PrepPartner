import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import APIService from "../server"; // Import the APIService
import { useToast } from "@/components/ui/use-toast"; // Import the toast hook

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); // Get the toast function
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [error, setError] = useState(""); // Add error state

  // Trigger animations after component mounts
  useEffect(() => {
    setAnimationLoaded(true);

    // Check if user is already authenticated
    if (APIService.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (activeTab === "login") {
        // Login user
        const credentials = {
          email: formData.email,
          password: formData.password,
        };

        const response = await APIService.login(credentials);
        console.log("Login successful:", response);

        // Redirect to dashboard after successful login
        navigate("/dashboard");
      } else {
        // Register user
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        const response = await APIService.register(userData);
        console.log("Registration successful:", response);

        // Show success message using toast instead of alert
        toast({
          title: "Account created successfully!",
          description: "Please log in with your credentials.",
          variant: "success",
        });

        // Switch to login tab
        setActiveTab("login");
        // Clear form data for login
        setFormData((prev) => ({
          ...prev,
          name: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      console.error(
        `${activeTab === "login" ? "Login" : "Registration"} error:`,
        error
      );
      setError(
        error.message ||
          `${
            activeTab === "login" ? "Login" : "Registration"
          } failed. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Column - Illustration/Branding */}
      <div className={`auth-branding ${animationLoaded ? "animate-in" : ""}`}>
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
      <div
        className={`auth-form-container ${animationLoaded ? "animate-in" : ""}`}
      >
        <div
          className={`auth-card ${animationLoaded ? "animate-bounce-in" : ""}`}
        >
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

                {/* Display error message if any */}
                {error && activeTab === "login" && (
                  <div className="error-message">{error}</div>
                )}

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

                {/* Display error message if any */}
                {error && activeTab === "signup" && (
                  <div className="error-message">{error}</div>
                )}

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
