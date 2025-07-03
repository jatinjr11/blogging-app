import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';  // Import AOS styles

import Hero from "../Home/Hero"
import Trending from '../Home/Trending'
import Devotional from '../Home/Devotional'
import Creator from '../Home/Creator'
import PropagateLoader from "react-spinners/PropagateLoader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      AOS.refresh();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className='dark:bg-gray-900' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <PropagateLoader color="#2563EB"  />
      </div>
    );
  }

  return (
    <div className='bg-customGray text-black dark:bg-gray-900 dark:text-white py-2'>
      <div data-aos="fade-up"><Hero /></div>
      <div data-aos="fade-up" data-aos-delay="200"><Trending /></div>
      <div data-aos="fade-up" data-aos-delay="400"><Devotional /></div>
      <div data-aos="fade-up" data-aos-delay="600"><Creator /></div>
    </div>
  )
}

export default Home;
