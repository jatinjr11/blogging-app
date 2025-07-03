import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyBlogs = () => {
  const [myBlogs, setMyBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4001/api/blogs/my-blogs",
          { withCredentials: true }
        );
        setMyBlogs(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4001/api/blogs/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message || "Blog deleted successfully");
      setMyBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto pl-12 pr-12 pt-4">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:ml-72 md:mr-4">
          {myBlogs && myBlogs.length > 0 ? (
            myBlogs.map((element) => (
              <Link
                to={`/blog/${element._id}`}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 border border-gray-200 dark:border-gray-700"
                key={element._id}
              >
                {element?.blogImage && (
                  <img
                    src={element.blogImage.url}
                    alt="blogImg"
                    className="w-full h-44 object-cover"
                  />
                )}
                <div className="p-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {element.category}
                  </span>
                  <h4 className="text-xl font-semibold my-2 text-gray-900 dark:text-white">
                    {element.title}
                  </h4>
                  <div className="flex justify-between mt-4">
                    <Link
                      to={`/blog/update/${element._id}`}
                      className="text-sm flex justify-center items-center font-medium text-blue-600  border border-blue-600 dark:border-blue-400 px-4 py-1 rounded-md hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition"
                    >
                      UPDATE
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(element._id);
                      }}
                      className="text-sm flex justify-center items-center font-medium text-red-600  border border-red-600 dark:border-red-400 px-4 py-1 rounded-md hover:bg-red-600 dark:hover:bg-red-500 hover:text-white transition"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300">
              You have not posted any blog to see!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;
