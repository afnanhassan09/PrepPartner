import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import APIService from '../server';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        // Get token from URL query params
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (!token) {
          setVerificationStatus('error');
          setMessage('Verification token is missing.');
          return;
        }

        console.log('Verifying token:', token);
        
        // Use the existing APIService.verifyEmail method instead of making a direct fetch call
        const data = await APIService.verifyEmail({ token });
        
        setVerificationStatus('success');
        setMessage(data.message || 'Email verified successfully! You can now log in.');
        
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationStatus('error');
        setMessage(error.message || 'An unexpected error occurred during verification.');
      }
    };

    verifyEmailToken();
  }, [location.search]);

  const handleRedirect = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          {verificationStatus === 'verifying' && (
            <Loader2 size={64} className="text-[#09363E] animate-spin" />
          )}
          
          {verificationStatus === 'success' && (
            <CheckCircle size={64} className="text-green-500" />
          )}
          
          {verificationStatus === 'error' && (
            <AlertCircle size={64} className="text-red-500" />
          )}
          
          <h1 className="text-2xl font-bold text-center text-gray-800">
            {verificationStatus === 'verifying' ? 'Verifying Email' : 
             verificationStatus === 'success' ? 'Email Verified' : 'Verification Failed'}
          </h1>
          
          <p className="text-center text-gray-600">
            {message}
          </p>
          
          {verificationStatus !== 'verifying' && (
            <button
              onClick={handleRedirect}
              className="bg-[#09363E] text-white py-3 px-6 rounded-lg hover:bg-[#09363E]/90 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>{verificationStatus === 'success' ? 'Proceed to Login' : 'Return to Login'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 