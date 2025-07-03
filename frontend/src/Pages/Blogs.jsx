import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingThreeDotsJumping from "./LoadingThreeDotsJumping";  // assume ye file me hai
import PropagateLoader from "react-spinners/PropagateLoader";

function Blogs() {
  const [loading, setLoading] = useState(true);
  const { blogs } = useAuth();

  console.log(blogs);

  useEffect(() => {
    // Fake loading delay - 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className='dark:bg-gray-900' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <PropagateLoader color="#2563EB"/>
      </div>
    );
  }
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="dark:bg-gray-900"
    >
      <div className="container mx-auto bg-customGray p-12 dark:bg-gray-900 dark:text-white" data-aos="fade-up">
        <h1 className="text-2xl font-bold mb-6">All Blogs goes here!!!</h1>
        <p className="text-center mb-8">
          The concept of gods varies widely across different cultures,
          religions, and belief systems
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <Link
                to={`/blog/${blog._id}`}
                key={index}
                className="relative rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={blog?.blogImage?.url}
                  alt={blog?.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-lg font-semibold">{blog?.title}</h2>
                  <p className="text-sm">{blog?.category}</p>
                </div>
              </Link>
            ))
          ) : (
            <div>No blogs available.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Blogs;
