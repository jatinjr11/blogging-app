import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Hero = () => {
  const { blogs, profile, userId, isAuthenticated } = useAuth();
  const [blogList, setBlogList] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const navigateTo = useNavigate();

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      setBlogList(blogs);
    }
  }, [blogs]);

  return (
    <div className='container mx-auto py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pl-32 pr-32 animate-fadeInUp text-black dark:bg-gray-900 dark:text-white'>
      {blogList && blogList.length > 0 ? (
        blogList.slice(0, 4).map((element) => (
          <div
            key={element._id}
            style={{ borderBottom: '1px solid gray', borderLeft: '1px solid gray', borderRight: '1px solid gray' }}
            className="dark:bg-gray-900 dark:text-white rounded-lg shadow-lg border-gray-200 hover:shadow-xl bg-customGray transform hover:scale-105 transition-transform duration-300"
          >
            {/* 👇 Card Click Handler */}
            <div
              className="group relative cursor-pointer"
              onClick={() => {
                if (!isAuthenticated) {
                  setShowLoginPopup(true);
                } else {
                  navigateTo(`/blog/${element._id}`);
                }
              }}
            >
              <img src={element?.blogImage?.url} alt="" className='w-full h-56 object-cover' />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75"></div>
              <h1 className="absolute bottom-4 left-4 text-white text-xl font-bold">{element.title}</h1>
            </div>

            <div className="p-6">
              <div className="flex items-center">
                <img src={element.adminPhoto} alt="" className="w-12 h-12 rounded-full border-2 border-yellow-400" />
                <div className='ml-4'>
                  <p className='text-lg'>{element.adminName}</p>
                  <p className='text-xs text-gray-400'>New</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowLoginPopup(true);
                    } else {
                      navigateTo(`/blog/${element._id}`);
                    }
                  }}
                  className="text-sm bg-blue-400 px-3 py-1 rounded-lg text-white hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      )}

      {/* 👇 Login Popup for Unauthenticated Users */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-black">
            <h2 className="text-lg font-bold mb-4">Login Required</h2>
            <p>Please login first to view blog.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowLoginPopup(false)}
              >
                Close
              </button>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setShowLoginPopup(false)}
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
