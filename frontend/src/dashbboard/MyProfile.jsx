import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";

function MyProfile() {
  const { profile, setProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [education, setEducation] = useState(profile?.education || "");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(profile?.photo?.url || "");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("education", education);
      if (photo) formData.append("photo", photo);

      const { data } = await axios.put(
        "http://localhost:4001/api/users/update-profile",
        formData,
        { withCredentials: true }
      );
      toast.success(data.message || "Profile updated");
      setProfile(data.updatedUser);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:ml-72 flex justify-center items-center bg-gradient-to-tr from-purple-100 via-indigo-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 transition-colors duration-300">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden max-w-sm w-full relative"
      >
        {/* Cover */}
        <div className="relative h-32">
          <img
            src={preview || "https://source.unsplash.com/featured/?nature"}
            alt="cover"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-x-0 -bottom-12 flex justify-center">
            <motion.img
              key={preview}
              src={preview || "https://source.unsplash.com/featured/?portrait"}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover bg-white dark:bg-gray-700"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Form / Display */}
        <div className="pt-16 pb-8 px-6 text-center">
          <AnimatePresence mode="wait">
            {editMode ? (
              <motion.form
                key="edit"
                onSubmit={handleProfileUpdate}
                className="space-y-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="Education"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />

                <div className="flex flex-col items-center">
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition inline-flex items-center gap-2 select-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12h16M12 4v8m0 0l-3-3m3 3l3-3"
                      />
                    </svg>
                    {photo ? "Change Photo" : "Upload Photo"}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="mt-3 w-20 h-20 object-cover rounded-full border-2 border-indigo-500 dark:border-indigo-400 shadow-md"
                    />
                  )}
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                  >
                    {loading && (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    )}
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wide">
                  {profile?.name}
                </h2>
                <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">{profile?.email}</p>
                <p className="mt-1 text-gray-700 dark:text-gray-400 font-medium text-sm">
                  {profile?.phone || "Phone not added"}
                </p>
                <p className="mt-1 text-gray-700 dark:text-gray-400 font-medium text-sm">
                  {profile?.education || "Education not added"}
                </p>
                <p className="mt-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm tracking-wide">
                  {profile?.role}
                </p>
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-5 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-md transition transform hover:scale-105"
                >
                  Edit Profile
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default MyProfile;
