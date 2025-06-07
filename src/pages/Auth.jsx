import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import APIService from "../server"; // Import the APIService
import { useToast } from "@/components/ui/use-toast"; // Import the toast hook
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo2.png";

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
  const [error, setError] = useState(""); // Add error state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const loginFormRef = useRef(null);
  const signupFormRef = useRef(null);
  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const loginBtnRef = useRef(null);
  const signupBtnRef = useRef(null);
  const loginSwitchRef = useRef(null);
  const signupSwitchRef = useRef(null);
  const loginFormGroupRefs = useRef([]);
  const signupFormGroupRefs = useRef([]);

  // Effect for initial page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Apply animations when page is loaded
  useEffect(() => {
    if (isPageLoaded) {
      // Card animation
      if (cardRef.current) {
        cardRef.current.classList.add("animate-in");
      }

      // Logo animation
      if (logoRef.current) {
        logoRef.current.classList.add("animate-in");
      }

      // Title animation
      if (titleRef.current) {
        titleRef.current.classList.add("animate-in");
      }

      // Login form groups animation
      loginFormGroupRefs.current.forEach((ref) => {
        if (ref) {
          ref.classList.add("animate-in");
        }
      });

      // Login button animation
      if (loginBtnRef.current) {
        loginBtnRef.current.classList.add("animate-in");
      }

      // Login switch text animation
      if (loginSwitchRef.current) {
        loginSwitchRef.current.classList.add("animate-in");
      }
    }
  }, [isPageLoaded]);

  // Trigger animations after component mounts
  useEffect(() => {
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

        // Show success message using toast
        toast({
          title: "Account created successfully!",
          description: "Please log in with your credentials.",
          variant: "success",
        });

        // Switch to login tab
        switchTab("login");
      }
    } catch (error) {
      console.error(
        `${activeTab === "login" ? "Login" : "Registration"} error:`,
        error
      );

      // Special handling for email verification error
      if (
        error.type === "EMAIL_NOT_VERIFIED" ||
        (error.message && error.message.includes("verify your email"))
      ) {
        setError(
          "Please verify your email first, then login. Check your inbox (including spam folder) for the verification email."
        );
      } else {
        setError(
          error.message ||
            `${
              activeTab === "login" ? "Login" : "Registration"
            } failed. Please try again.`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Switch between login and signup tabs with swipe animation
  const switchTab = (tab) => {
    if (activeTab === tab) return;

    // Determine animation direction
    const goingToSignup = tab === "signup";

    // Apply exit animation to current form
    const currentForm =
      activeTab === "login" ? loginFormRef.current : signupFormRef.current;
    const enteringForm =
      tab === "login" ? loginFormRef.current : signupFormRef.current;

    if (currentForm && enteringForm) {
      // Add exit animation class
      currentForm.classList.add(
        goingToSignup ? "swipe-left-exit" : "swipe-right-exit"
      );

      // Make entering form visible but with opacity 0
      enteringForm.style.display = "block";
      enteringForm.style.opacity = "0";

      // After exit animation completes, update state and start enter animation
      setTimeout(() => {
        setActiveTab(tab);
        setError("");

        // Remove exit animation class and hide exited form
        currentForm.classList.remove(
          goingToSignup ? "swipe-left-exit" : "swipe-right-exit"
        );
        currentForm.style.display = "none";

        // Add enter animation class to the new form
        enteringForm.classList.add(
          goingToSignup ? "swipe-left-enter" : "swipe-right-enter"
        );
        enteringForm.style.opacity = "1";

        // Apply animations to the new form elements if switching to signup
        if (goingToSignup) {
          // Animate signup form elements with slight delays
          const titleEl = enteringForm.querySelector(".form-title");
          if (titleEl) titleEl.classList.add("animate-in");

          // Animate form groups
          const formGroups = enteringForm.querySelectorAll(".form-group");
          formGroups.forEach((group, index) => {
            setTimeout(() => {
              group.classList.add("animate-in");
            }, index * 100);
          });

          // Animate button and switch text
          const btnEl = enteringForm.querySelector(".submit-button");
          const switchEl = enteringForm.querySelector(".auth-switch");

          if (btnEl) {
            setTimeout(() => {
              btnEl.classList.add("animate-in");
            }, formGroups.length * 100);
          }

          if (switchEl) {
            setTimeout(() => {
              switchEl.classList.add("animate-in");
            }, formGroups.length * 100 + 100);
          }
        }

        // Remove enter animation class after animation completes
        setTimeout(() => {
          enteringForm.classList.remove(
            goingToSignup ? "swipe-left-enter" : "swipe-right-enter"
          );
        }, 500);
      }, 500);
    }
  };

  // Save form group refs
  const setLoginFormGroupRef = (el, index) => {
    loginFormGroupRefs.current[index] = el;
  };

  const setSignupFormGroupRef = (el, index) => {
    signupFormGroupRefs.current[index] = el;
  };

  return (
    <div className="auth-container">
      <div ref={cardRef} className="auth-card">
        <img
          ref={logoRef}
          src={logo}
          alt="PrepPartner Logo"
          className="auth-logo"
        />

        <div className="auth-forms-wrapper">
          <div
            ref={loginFormRef}
            className={`auth-form ${activeTab === "login" ? "active" : ""}`}
            style={{ display: activeTab === "login" ? "block" : "none" }}
          >
            <h2 ref={titleRef} className="form-title">
              Welcome
            </h2>

            {error && activeTab === "login" && (
              <div className="error-message">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div
                ref={(el) => setLoginFormGroupRef(el, 0)}
                className="form-group"
              >
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="email" className="label-text">
                  Email
                </label>
              </div>

              <div
                ref={(el) => setLoginFormGroupRef(el, 1)}
                className="form-group"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="password" className="label-text">
                  Password
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                ref={loginBtnRef}
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? <span className="spinner"></span> : "LOGIN"}
              </button>
            </form>

            <p ref={loginSwitchRef} className="auth-switch">
              Don't have an account?{" "}
              <button type="button" onClick={() => switchTab("signup")}>
                Sign Up
              </button>
            </p>
          </div>

          <div
            ref={signupFormRef}
            className={`auth-form ${activeTab === "signup" ? "active" : ""}`}
            style={{ display: activeTab === "signup" ? "none" : "none" }}
          >
            <h2 className="form-title">Create Account</h2>

            {error && activeTab === "signup" && (
              <div className="error-message">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div
                ref={(el) => setSignupFormGroupRef(el, 0)}
                className="form-group"
              >
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="name" className="label-text">
                  Full Name
                </label>
              </div>

              <div
                ref={(el) => setSignupFormGroupRef(el, 1)}
                className="form-group"
              >
                <input
                  type="email"
                  name="email"
                  id="signup-email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="signup-email" className="label-text">
                  Email
                </label>
              </div>

              <div
                ref={(el) => setSignupFormGroupRef(el, 2)}
                className="form-group"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="signup-password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="signup-password" className="label-text">
                  Password
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div
                ref={(el) => setSignupFormGroupRef(el, 3)}
                className="form-group"
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirm-password"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label htmlFor="confirm-password" className="label-text">
                  Confirm Password
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <button
                ref={signupBtnRef}
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? <span className="spinner"></span> : "SIGN UP"}
              </button>
            </form>

            <p ref={signupSwitchRef} className="auth-switch">
              Already have an account?{" "}
              <button type="button" onClick={() => switchTab("login")}>
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
