import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';
import { Divider, Button } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../Firebase';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import AOS from 'aos';
import 'aos/dist/aos.css';
import api from '../apis/api';

const Login = () => {
  const { setIsAuthenticated, setProfile } = useAuth();
  const navigateTo = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    AOS.init({ duration: 800 });
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!role) return toast.error('Please select a role');

    try {
      const { data } = await axios.post(
        `${api.Sign_in}`,
        { email, password, role },
        { withCredentials: true }
      );

      toast.success('Login successful');
      setProfile(data.user);
      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
      setRole('');
      navigateTo('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch(`${api.google_login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Google login successful');

        // ✅ Profile fetch yahi turant kar le
        const profileRes = await axios.get(`${api.Get_my_profile}`, {
          withCredentials: true,
        });

        setProfile(profileRes.data.user);
        localStorage.setItem('profile', JSON.stringify(profileRes.data.user));

        setIsAuthenticated(true);
        navigateTo('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Google login failed');
      console.log(error);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-200 via-purple-100 to-pink-200 dark:from-gray-900 dark:to-gray-800 px-4 py-10 relative transition-all">

      {/* Toggle Theme Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md z-50 transition"
      >
        {theme === 'dark' ? (
          <MdLightMode className="text-yellow-400 text-xl" />
        ) : (
          <MdDarkMode className="text-gray-800 text-xl" />
        )}
      </button>

      {/* Login Card */}
      <div
        data-aos="zoom-in"
        className="w-full max-w-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-300 mb-6">
          ssd<span className="text-indigo-600">Blog</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-6 animate-fadeIn">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="">Choose...</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Enter your password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="text-sm text-center text-gray-700 dark:text-gray-400">
            New here?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register Now
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            Forgot password?{' '}
            <Link to="/forgot-password" className="text-indigo-600 underline">
              Click here
            </Link>
          </p>

          {role === 'user' && (
            <>
              <Divider className="!my-5 dark:!text-white dark:!border-gray-300">or</Divider>

              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleGoogleLogin}
                startIcon={
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    className="w-5 h-5"
                  />
                }
                sx={{
                  backgroundColor: 'white',
                  textTransform: 'none',
                  fontWeight: 500,
                  ':hover': { backgroundColor: '#f3f4f6' },
                }}
              >
                Sign in with Google
              </Button>
            </>
          )}



        </form>
      </div>
    </div>
  );
};

export default Login;
