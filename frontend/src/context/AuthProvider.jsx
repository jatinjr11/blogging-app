import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import api from "../apis/api";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [blogs, setBlogs] = useState();
    const [profile, setProfile] = useState(() => {
        const stored = localStorage.getItem('profile');
        return stored ? JSON.parse(stored) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // <-- ADD THIS
    console.log("My-Profile", profile);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // let token = Cookies.get("token");
                // let parsedToken = token?JSON.parse(token) : undefined;
                // console.log("parsed",parsedToken);
                // if (parsedToken) {
                const { data } = await axios.get(`${api.Get_my_profile}`,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                console.log(data);

                setProfile(data.user);
                localStorage.setItem('profile', JSON.stringify(data.user));
                setIsAuthenticated(true);
                // } else {
                // console.log("No token");
                // }
            } catch (error) {
                setIsAuthenticated(false);
                console.log(error);
                setProfile(null);
                localStorage.removeItem('profile');
            } finally {
                setLoading(false); // <-- SET loading false when done
            }
        };

        const fetchBlogs = async () => {
            try {
                const { data } = await axios.get(`${api.Get_all_blogs}`, {
                    withCredentials: true
                });

                console.log(data);
                console.log(data)
                setBlogs(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchBlogs();
        fetchProfile()
    }, []);

    return (
        <AuthContext.Provider value={{ blogs, profile, setProfile, userId: profile?._id, isAuthenticated, setIsAuthenticated, loading }} > {children} </AuthContext.Provider>
    );
};
// blogs ki value ko access krne ke liye custom hook banaya
export const useAuth = () => useContext(AuthContext);