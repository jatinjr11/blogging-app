import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const { profile, setProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name || "");
  const [photo, setPhoto] = useState(null);
  console.log(photo);
  console.log(profile);
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (photo) formData.append("photo", profile.photo.url);

      console.log("profile photo 1", photo);
      console.log("profile photo 1", formData);
      const { data } = await axios.put(
        "http://localhost:4001/api/users/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("profile updated 2", data);
      
      toast.success("Profile updated");
      setProfile(data.updatedUser); // ✅ update context
      setEditing(false);
      toNavi
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden max-w-md w-full">
        <div className="relative">
          <img
            src={profile?.photo?.url}
            alt="cover"
            className="w-full h-40 object-cover brightness-90"
          />
          <div className="absolute inset-x-0 -bottom-12 flex justify-center">
            <img
              src={profile?.photo?.url}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        <div className="pt-16 pb-10 px-6 text-center">
          {editing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                placeholder="Enter your name"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="w-full"
              />
              <div className="flex justify-center space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900">
                {profile?.name}
              </h2>
              <p className="mt-2 text-gray-600 text-sm">{profile?.email}</p>
              <p className="mt-1 text-gray-600 text-sm">{profile?.phone}</p>
              <p className="mt-1 text-indigo-600 font-semibold text-sm">
                {profile?.role}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
