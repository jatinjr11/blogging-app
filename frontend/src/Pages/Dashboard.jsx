import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Sidebar from "../dashbboard/Sidebar";
import MyProfile from "../dashbboard/MyProfile";
import CreateBlog from "../dashbboard/CreateBlog";
import UpdateBlog from "../dashbboard/UpdateBlog";
import MyBlogs from "../dashbboard/MyBlogs";
import { Navigate } from "react-router-dom";
const Dashboard = () => {
  const {profile, isAuthenticated} = useAuth();
  const [component, setComponent] = useState("My Blogs");
  
  // console.log("Profile",profile);
  // console.log("Authenticated",isAuthenticated);
  
  if(!isAuthenticated){
    return <Navigate to={"/"} />
  }

  

  return (
    <div data-aos="fade-down">
        <Sidebar component={component} setComponent={setComponent} />
        {component === "My Profile" ? (
          <MyProfile />
        ) : component === "Create Blog" ? (
          <CreateBlog />
        ) : component === "Update Blog" ? (
          <UpdateBlog />
        ) : (
          <MyBlogs />
        )}
    </div>
  )
}

export default Dashboard