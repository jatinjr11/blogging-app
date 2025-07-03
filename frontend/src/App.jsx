import React from 'react'
import Navbar from "../src/components/Navbar"
import Home from "../src/components/Home"
import Footer from "../src/components/Footer"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import Blogs from "../src/Pages/Blogs"
import About from "../src/Pages/About"
import Contact from "../src/Pages/Contact"
import Login from "../src/Pages/Login"
import Register from "../src/Pages/Register"
import Dashboard from "../src/Pages/Dashboard"
import { useAuth } from './context/AuthProvider'
import Creators from './Pages/Creators'
import { Toaster } from 'react-hot-toast';
import UpdateBlog from './dashbboard/UpdateBlog'
import Detail from './Pages/Detail'
import Verify from './Pages/Verify'
import NotFound from './Pages/Notfound'
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from './Pages/ResetPassword'
import UpdateProfile from "./dashbboard/UpdateProfile"

import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';
import AdminUserList from './Pages/AdminUserList'

function App() {
  const location = useLocation();
  const hideNavFooter = ["/dashboard", "/login", "/register"].includes(location.pathname);

  const {blogs, isAuthenticated} = useAuth();
  console.log(blogs);
  console.log(isAuthenticated);

  
useEffect(() => {
  AOS.init({
    duration: 1000,
    once: true,
  });
}, []);
  
  return (
    <div>
      {!hideNavFooter && <Navbar />}
      {/* Defining routes */}
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/blogs" element={<Blogs />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/creators" element={<Creators />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/blog/:id" element={<Detail />} />
        <Route exact path="/blog/update/:id" element={<UpdateBlog />} />
        <Route exact path='/verify' element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/update-profile' element= {<UpdateProfile />} />
        <Route path="/admin/users" element={<AdminUserList />} />

        {/* universal route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      {!hideNavFooter && <Footer />}
    </div>
  )
}

export default App
