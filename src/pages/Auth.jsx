import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Clear any existing messages
    setMessage(null);

    try {
      if (isLogin) {
        // Login
        await login({
          email: formData.email,
          password: formData.password,
        });
        setMessage("You have been logged in successfully.");
        setMessageType("success");

        // Redirect to home page after short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // Register
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        setMessage(
          "Your account has been created successfully. Please check your email for a verification link."
        );
        setMessageType("success");

        // Stay on registration page to show the verification message
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setMessage(error.message || "Authentication failed");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-sm font-medium transition-colors duration-300 ${
                isLogin
                  ? "bg-[#09363E] text-white"
                  : "bg-gray-50 text-gray-600 hover:text-[#09363E]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-sm font-medium transition-colors duration-300 ${
                !isLogin
                  ? "bg-[#09363E] text-white"
                  : "bg-gray-50 text-gray-600 hover:text-[#09363E]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 animate-fade-up">
              {isLogin ? "Welcome back!" : "Create your account"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div
                  className="relative animate-fade-up"
                  style={{ animationDelay: "200ms" }}
                >
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#09363E]/20 focus:border-[#09363E] transition-all duration-300"
                    required={!isLogin}
                  />
                </div>
              )}

              <div
                className="relative animate-fade-up"
                style={{ animationDelay: "400ms" }}
              >
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#09363E]/20 focus:border-[#09363E] transition-all duration-300"
                  required
                />
              </div>

              <div
                className="relative animate-fade-up"
                style={{ animationDelay: "600ms" }}
              >
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#09363E]/20 focus:border-[#09363E] transition-all duration-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#09363E] text-white py-3 rounded-lg hover:bg-[#09363E]/90 transition-all duration-300 flex items-center justify-center space-x-2 group animate-fade-up"
                style={{ animationDelay: "800ms" }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? "Login" : "Sign Up"}</span>
                    <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Message display area */}
              {message && (
                <div
                  className={`mt-4 p-3 rounded-lg text-sm animate-fade-up ${
                    messageType === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {messageType === "success" && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {message}
                    </div>
                  )}

                  {messageType === "error" && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {message}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-6 text-gray-600 animate-fade-up"
          style={{ animationDelay: "1400ms" }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#09363E] font-medium hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
