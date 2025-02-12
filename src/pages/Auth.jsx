import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, Github, Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    navigate('/');
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
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#F3C178]/20 focus:border-[#F3C178] transition-all duration-300"
                  />
                </div>
              )}

              <div className="relative animate-fade-up" style={{ animationDelay: '400ms' }}>
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#F3C178]/20 focus:border-[#F3C178] transition-all duration-300"
                />
              </div>

              <div className="relative animate-fade-up" style={{ animationDelay: '600ms' }}>
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#F3C178]/20 focus:border-[#F3C178] transition-all duration-300"
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

              <div className="relative my-8 animate-fade-up" style={{ animationDelay: '1000ms' }}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '1200ms' }}>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  <Chrome className="w-5 h-5" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </button>
              </div>
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