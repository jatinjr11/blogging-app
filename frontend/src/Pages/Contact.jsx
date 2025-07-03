import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from 'axios';
import PropagateLoader from "react-spinners/PropagateLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(true);

  const onSubmit = async (data) => {
    const userInfo = {
      access_key: "ab9a6787-fc95-4a7f-b535-959cff3cb8b5",
      name: data.username,
      email: data.email,
      message: data.message
    };
    try {
      await axios.post("https://api.web3forms.com/submit", userInfo);
      toast.success("Message sent successfully!", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      reset();
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <PropagateLoader color="#2563EB" />
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Contact Us</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          {/* Form Section */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Send us a message</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  {...register("username", { required: true })}
                />
                {errors.username && (
                  <span className="text-sm text-red-500 font-semibold">This field is required</span>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-sm text-red-500 font-semibold">This field is required</span>
                )}
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  {...register("message", { required: true })}
                />
                {errors.message && (
                  <span className="text-sm text-red-500 font-semibold">This field is required</span>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-black dark:bg-yellow-500 text-white dark:text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="w-full md:w-1/2 md:pl-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Contact Information</h3>
            <ul className="space-y-4 text-gray-800 dark:text-gray-200">
              <li className="flex items-center space-x-2">
                <FaPhone className="text-red-500" />
                <span>+91 123456789</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-pink-500" />
                <span>help@Kitty.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-green-500" />
                <span>Indore, MP, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
