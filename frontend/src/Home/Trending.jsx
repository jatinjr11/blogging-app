import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function Trending() {
  const { blogs, isAuthenticated } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigateTo = useNavigate();

  const handleCardClick = (id) => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
    } else {
      navigateTo(`/blog/${id}`);
    }
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="container mx-auto px-10 animate-fadeInUp">
      <h1 className="text-2xl font-sans font-semibold mb-6 bg-customGray text-black dark:bg-gray-900 dark:text-white py-2">
        Trending
      </h1>

      <Carousel responsive={responsive}>
        {blogs && blogs.length > 0 ? (
          blogs.slice(0, 6).map((element) => (
            <div
              key={element._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg mx-3 cursor-pointer
                transform transition-transform duration-300 ease-in-out
                hover:scale-105 hover:shadow-xl will-change-transform will-change-shadow my-9 hover:dark:shadow-md hover:dark:shadow-blue-500"
              onClick={() => handleCardClick(element._id)}
            >
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={element.blogImage.url}
                  alt="blog"
                  className="w-full h-56 object-cover transition-transform duration-300 ease-in-out will-change-transform hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-blue-600 bg-opacity-75 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
                  {element.category}
                </div>
              </div>

              <div className="p-5 dark:bg-gray-900 dark:text-white bg-gray-50 rounded-b-2xl h-36 flex flex-col justify-between">
                <h1
                  className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2"
                  title={element.title}
                >
                  {element.title}
                </h1>
                <div className="flex items-center ">
                  <img
                    src={element.adminPhoto}
                    alt="author_avatar"
                    className="w-10 h-10 rounded-full border-2 border-blue-400"
                  />
                  <p className="ml-4 text-gray-600 dark:text-white text-sm font-medium">
                    {element.adminName}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-screen items-center justify-center text-gray-500 font-semibold text-lg">
            Loading....
          </div>
        )}
      </Carousel>

      {/* 👇 Login popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-black">
            <h2 className="text-lg font-bold mb-4">Login Required</h2>
            <p>Please login to view this blog.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowLoginPopup(false)}
              >
                Close
              </button>
              <Link
                to="/login"
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trending;
