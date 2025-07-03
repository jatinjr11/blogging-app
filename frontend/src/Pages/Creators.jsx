import axios from "axios";
import React, { useEffect, useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import api from "../apis/api";

function Creators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const fetchCreators = async () => {
      try {
        const { data } = await axios.get(
          `${api.admins}`,
          { withCredentials: true }
        );
        setCreators(data?.admins || []);
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        console.error(error);
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchCreators();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setShowLoader(false), 1000);
    } else {
      setShowLoader(true);
    }
  }, [loading]);

  if (showLoader) {
    return (
      <div
        className={`flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-opacity duration-300 ${loading ? "opacity-100" : "opacity-0"
          }`}
      >
        <PropagateLoader color="#2563EB" size={15} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-900 py-12 px-6 overflow-hidden">

      {/* Heading */}
      <h1
        className="text-3xl font-extrabold text-center text-blue-900 dark:text-white mb-5 drop-shadow-sm"
        data-aos="fade-down"
      >
        Meet Our Creators
      </h1>
      <p
        className="text-center text-gray-600 dark:text-gray-300 mb-16  max-w-2xl mx-auto"
        data-aos="fade-up"
      >
        Empowering minds. Building the future. Here's the team that makes it all possible.
      </p>

      {/* Creator Cards */}
      <div className="flex flex-wrap justify-center gap-10">
        {creators.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 text-lg">No creators found.</p>
        ) : (
          creators.map((creator, i) => (
            <div
              key={creator._id}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl  max-w-[20rem] w-full overflow-hidden transform transition-all hover:scale-105 duration-300 group hover:shadow-xl dark:hover:shadow-blue-500/30"
            >
              {/* Cover Image */}
              <div className="relative h-32 bg-blue-100 dark:bg-gray-700 transition-colors">
                <img
                  src={creator.photo?.url || "/default-avatar.png"}
                  alt={`${creator.name} cover`}
                  className="w-full h-full object-cover"
                />
                {/* Avatar */}
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 transition-transform">
                  <img
                    src={creator.photo?.url || "/default-avatar.png"}
                    alt={`${creator.name} avatar`}
                    className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-700 shadow-md object-cover bg-white"
                  />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-11 pt-14 pb-6 text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {creator.name}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm flex items-center justify-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <FaEnvelope className="text-blue-500" /> {creator.email}
                </p>
                {creator.phone && (
                  <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center gap-2 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    <FaPhoneAlt className="text-blue-400" /> {creator.phone}
                  </p>
                )}
                <span className="inline-block mt-4 px-3 py-1 text-sm font-semibold text-white bg-blue-600 dark:bg-blue-500 rounded-full shadow-sm">
                  {creator.role.charAt(0).toUpperCase() + creator.role.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Creators;
