import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';
import api from '../apis/api';


const Verify = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile } = useAuth();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('activationToken');
  console.log("Token:", token);
  console.log("OTP: ",otp);
  

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Token not found. Please register again.');
      return navigate('/register');
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${api.verify_user}`,
        { otp, activationToken: token },
        { withCredentials: true }
      );

      console.log("Sending:", { otp, activationToken: token });

      // toast.success('');
      toast.success("User Registered Successfully")
      setProfile(data.user);
      setIsAuthenticated(true);
    //   localStorage.removeItem('activationToken'); // clear the token
      navigate('/');    
    } catch (err) {
        console.log(err);
        
      toast.error(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Verify Your Email
        </h2>
        <p className="text-sm text-center mb-4 text-gray-600">
          Enter the OTP sent to your email
        </p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded-md text-center"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-300"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
