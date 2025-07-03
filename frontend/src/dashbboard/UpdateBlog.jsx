import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const UpdateBlog = () => {
  const navigateTo = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [blogImage, setBlogImage] = useState("");
  const [blogImagePreview, setBlogImagePreview] = useState("");

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBlogImagePreview(reader.result);
      setBlogImage(file);
    };
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4001/api/blogs/single-blog/${id}`,
          {
            withCredentials: true, 
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setTitle(data?.title);
        setCategory(data?.category);
        setAbout(data?.about);
        setBlogImage(data?.blogImage.url);
      } catch (error) {
        toast.error(error.message || "Please fill the required fields");
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !category || !about) {
      toast.error("Please fill all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("about", about);
    if (blogImage instanceof File) {
      formData.append("blogImage", blogImage);
    }
    try {
      const { data } = await axios.put(
        `http://localhost:4001/api/blogs/update/${id}`,
        formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(data.message || "Blog updated successfully");
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Please fill the required fields");
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, duration: 0.6 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white shadow-2xl rounded-xl max-w-5xl w-full p-10 md:p-16"
        layout
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigateTo(-1)}
          className="mb-6 flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        <motion.h3
          variants={itemVariants}
          className="text-4xl font-extrabold text-indigo-700 mb-10 text-center tracking-wide select-none"
        >
          Update Your Blog
        </motion.h3>

        <motion.form
          className="flex flex-col md:flex-row gap-12"
          onSubmit={handleUpdate}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left panel */}
          <motion.div variants={itemVariants} className="flex flex-col gap-8 flex-1">
            <div>
              <label className="block mb-3 font-semibold text-gray-700">Category</label>
              <select
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Devotion">Devotion</option>
                <option value="Sports">Sports</option>
                <option value="Coding">Coding</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div>
              <label className="block mb-3 font-semibold text-gray-700">Blog Title</label>
              <input
                type="text"
                placeholder="Blog Main Title"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </motion.div>

          {/* Right panel */}
          <motion.div variants={itemVariants} className="flex flex-col flex-1 gap-8">
            <div>
              <label className="block mb-3 font-semibold text-gray-700">Blog Image</label>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-[500px] max-w-full mb-6 rounded-xl overflow-hidden border border-gray-300 shadow-lg cursor-pointer transition-transform"
              >
                <img
                  src={
                    blogImagePreview
                      ? blogImagePreview
                      : blogImage
                        ? blogImage
                        : "/imgPL.webp"
                  }
                  alt="Blog Preview"
                  className="w-[500px] max-w-full h-60 object-cover"
                />
              </motion.div>
              <input
                type="file"
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
                onChange={changePhotoHandler}
              />
            </div>
            <div>
              <label className="block mb-3 font-semibold text-gray-700">About the Blog</label>
              <textarea
                // rows="10"
                // cols="20"
                rows={10}
                placeholder="Something about your blog, at least 200 characters!"
                className="w-[700px] max-w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(99, 102, 241, 0.7)" }}
              whileTap={{ scale: 0.95 }}
              className="self-start bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-5 rounded-lg shadow-lg transition"
            >
              Update Blog
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  )
}

export default UpdateBlog;
