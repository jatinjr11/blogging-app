import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoCloseSharp } from 'react-icons/io5';
import axios from 'axios';
import toast from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../apis/api';

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { profile, isAuthenticated, setIsAuthenticated, setProfile } = useAuth();
  const navigateTo = useNavigate();

  // Prevent render until profile loads
  if (isAuthenticated && !profile) return null;

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
    // http://localhost:4001/api/users/logout
      const { data } = await axios.get(`${api.logout}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      setIsAuthenticated(false);
      setProfile(null);
      localStorage.removeItem('profile');
      navigateTo('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to logout');
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20, pointerEvents: 'none' },
    visible: { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto', transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: -10, pointerEvents: 'none', transition: { duration: 0.2 } },
  };

  const linkList = [
    { path: '/', label: 'Home' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/creators', label: 'Creators' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-50 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-800 dark:text-white">
              ssd<span className="text-blue-500">Blog</span>
            </Link>
          </motion.div>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-8 text-lg font-sans">
            {linkList.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="relative group transition-colors duration-300 text-gray-700 dark:text-white"
                >
                  {label}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                </Link>
              </li>
            ))}

            {isAuthenticated && (
              <>
                <li>
                  <Link to="/dashboard" className="hover:text-blue-700 duration-300 dark:text-white dark:hover:text-blue-500">
                    Dashboard
                  </Link>
                </li>
                {profile?.role === 'admin' && (
                  <li>
                    <Link to="/admin/users" className="hover:text-blue-500 transition-colors duration-300 dark:hover:text-blue-500 dark:text-white">
                      Manage Users
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-5 font-mono ">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-black px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-700 hover:to-pink-700 text-white hover:text-gray-200 px-5 py-2 rounded-full font-semibold duration-300  shadow-lg"
              >
                Logout
              </button>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setShow((prev) => !prev)}
              aria-label="Toggle Menu"
              className="focus:outline-none"
            >
              <motion.div
                initial={false}
                animate={{ rotate: show ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-black dark:text-white"
              >
                {show ? <IoCloseSharp size={28} /> : <AiOutlineMenu size={28} />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {show && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden fixed top-16 left-0 w-full bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl z-40 py-6"
            >
              <ul className="flex flex-col items-center text-lg font-medium space-y-6">
                {linkList.map(({ path, label }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={() => setShow(false)}
                      className="hover:text-blue-500 transition-colors duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}

                {isAuthenticated && (
                  <>
                    <li>
                      <Link
                        to="/dashboard"
                        onClick={() => setShow(false)}
                        className="hover:text-blue-500 transition-colors duration-300"
                      >
                        Dashboard
                      </Link>
                    </li>
                    {profile?.role === 'admin' && (
                      <li>
                        <Link
                          to="/admin/users"
                          onClick={() => setShow(false)}
                          className="hover:text-blue-500 transition-colors duration-300"
                        >
                          Manage Users
                        </Link>
                      </li>
                    )}
                  </>
                )}

                <li>
                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      onClick={() => setShow(false)}
                      className="bg-red-500 hover:bg-red-700 text-white px-8 py-3 rounded-full transition-all duration-300"
                    >
                      Login
                    </Link>
                  ) : (
                    <button
                      onClick={(e) => {
                        handleLogout(e);
                        setShow(false);
                      }}
                      className="bg-red-500 hover:bg-red-700 text-white px-8 py-3 rounded-full transition-all duration-300"
                    >
                      Logout
                    </button>
                  )}
                </li>

                <li>
                  <ThemeToggle />
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
