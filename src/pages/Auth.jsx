import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login
        await login({
          email: formData.email,
          password: formData.password
        });
        toast({
          title: "Success!",
          description: "You have been logged in successfully.",
          variant: "success",
        });
      } else {
        // Register
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        toast({
          title: "Account created!",
          description: "Your account has been created successfully. Please log in.",
          variant: "success",
        });
        // Switch to login after successful registration
        setIsLogin(true);
        setIsLoading(false);
        return;
      }
      
      // Redirect to home page after successful login
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
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
                isLogin ? 'bg-[#F3C178] text-white' : 'bg-gray-50 text-gray-600 hover:text-[#F3C178]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-sm font-medium transition-colors duration-300 ${
                !isLogin ? 'bg-[#F3C178] text-white' : 'bg-gray-50 text-gray-600 hover:text-[#F3C178]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 animate-fade-up">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative animate-fade-up" style={{ animationDelay: '200ms' }}>
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#F3C178]/20 focus:border-[#F3C178] transition-all duration-300"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="relative animate-fade-up" style={{ animationDelay: '400ms' }}>
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#F3C178]/20 focus:border-[#F3C178] transition-all duration-300"
                  required
                />
              </div>

              <div className="relative animate-fade-up" style={{ animationDelay: '600ms' }}>
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#F3C178]/20 focus:border-[#F3C178] transition-all duration-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#F3C178] text-white py-3 rounded-lg hover:bg-[#F3C178]/90 transition-all duration-300 flex items-center justify-center space-x-2 group animate-fade-up"
                style={{ animationDelay: '800ms' }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Login' : 'Sign Up'}</span>
                    <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-600 animate-fade-up" style={{ animationDelay: '1400ms' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#F3C178] font-medium hover:underline"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth; 