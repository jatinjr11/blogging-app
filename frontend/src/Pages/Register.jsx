import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';
import { auth } from "../Firebase";  // Make sure Firebase is configured
import { signInWithPopup } from "firebase/auth";
import api from '../apis/api';

const Register = () => {
  const { setIsAuthenticated, setProfile } = useAuth();
  const navigateTo = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [education, setEducation] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhoto(file);
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("education", education);
    formData.append("photo", photo);

    try {
      const { data } = await axios.post(
        `${api.Sign_up}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("activationToken", data.activationToken);
      setProfile(data.user);
      setIsAuthenticated(true);
      navigateTo("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  // ✅ Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user info to backend for login/signup
      const { data } = await axios.post(`${api.google_login}`, {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      }, {
        withCredentials: true,
      });

      setProfile(data.user);
      setIsAuthenticated(true);
      toast.success("Login with Google successful!");
      navigateTo("/");
    } catch (error) {
      toast.error("Google Sign-In failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <form onSubmit={handleRegister}>
          <div className="font-semibold text-xl text-center">
            &&& <span className="text-blue-500">Blog</span>
          </div>
          <h1 className="text-xl font-semibold mb-6">Register</h1>

          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 mb-4 border rounded-md">
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mb-4 border rounded-md" />
          <input type="text" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-4 border rounded-md" />
          <input type="number" placeholder="Your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 mb-4 border rounded-md" />
          <input type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded-md" />

          <select value={education} onChange={(e) => setEducation(e.target.value)} className="w-full p-2 mb-4 border rounded-md">
            <option value="">Select Your Education</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
            <option value="BBA">BBA</option>
          </select>

          <div className="flex items-center mb-4">
            <div className="photo w-20 h-20 mr-4">
              <img src={photoPreview || "photo"} alt="photo" />
            </div>
            <input type="file" onChange={changePhotoHandler} className="w-full p-2 border rounded-md" />
          </div>

          <p className="text-center mb-4">
            Already registered? Or If You Want Enter from Google login <Link to="/login" className="text-blue-600">Login Now</Link>
          </p>

          <button type="submit" className="w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
