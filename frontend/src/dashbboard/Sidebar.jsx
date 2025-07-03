import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthProvider";
import { CiMenuBurger } from 'react-icons/ci';
import { BiSolidLeftArrowAlt } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaSun, FaMoon } from 'react-icons/fa';

const Sidebar = ({ setComponent }) => {
  const { profile, setIsAuthenticated } = useAuth();
  const navigateTo = useNavigate();
  const [show, setShow] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Set theme from localStorage on mount
  useEffect(() => {
    const darkPref = localStorage.getItem("theme") === "dark";
    setIsDark(darkPref);
    document.documentElement.classList.toggle("dark", darkPref);
  }, []);

  // Toggle Theme
  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  const handleComponents = (value) => setComponent(value);
  const goToHome = () => navigateTo("/");

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("http://localhost:4001/api/users/logout", {
        withCredentials: true,
      });
      toast.success(data.message);
      setIsAuthenticated(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to logout");
    }
  };

  return (
    <>
      {/* Menu Button */}
      <div
        className="sm:hidden fixed top-4 left-4 z-[99999] text-gray-800 dark:text-white"
        onClick={() => setShow(!show)}
      >
        <CiMenuBurger className="text-2xl" />
      </div>

      {/* Blur Overlay */}
      {show && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[9998]"
          onClick={() => setShow(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 md:w-72 h-full shadow-lg dark:shadow-xl dark:shadow-gray-500 bg-gray-50 dark:bg-gray-900 transition-transform duration-300 transform z-[9999] sm:translate-x-0 ${
          show ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div
          className="sm:hidden absolute top-4 right-4 text-xl text-gray-800 dark:text-white cursor-pointer"
          onClick={() => setShow(!show)}
        >
          <BiSolidLeftArrowAlt className="text-2xl" />
        </div>

        {/* Profile Info */}
        <div className="text-center mt-16">
          <img
            className="w-20 md:w-24 h-20 md:h-24 rounded-full mx-auto mb-2 object-cover border-2 border-gray-300 dark:border-gray-700"
            src={profile?.photo?.url || "/default-avatar.png"}
            alt="User Avatar"
          />
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {profile?.user?.name}
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-sm hover:scale-105 transition duration-200"
          >
            {isDark ? (
                <FaSun className="text-yellow-400" />
              
            ) : (
                <FaMoon className="text-blue-500" />
            )}
          </button>
        </div>

        {/* Navigation Buttons */}
        <ul className="space-y-5 md:space-y-6 mx-8 md:mx-10 md:mt-10 mt-10">
          <button
            onClick={() => handleComponents("My Blogs")}
            className="w-full px-4 py-2 md:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          >
            MY BLOGS
          </button>
          <button
            onClick={() => handleComponents("Create Blog")}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            CREATE BLOGS
          </button>
          <button
            onClick={() => handleComponents("My Profile")}
            className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300"
          >
            MY PROFILE
          </button>
          <button
            onClick={goToHome}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            HOME
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            LOGOUT
          </button>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
