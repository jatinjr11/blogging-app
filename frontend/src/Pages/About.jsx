import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../context/AuthProvider";
import PropagateLoader from "react-spinners/PropagateLoader";

const About = () => {
  const { profile } = useAuth();
  const [preview, setPreview] = useState(profile?.photo?.url || "");
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Simulate a loading delay (e.g., 2 seconds)
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (showLoader) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-opacity duration-300">
        <PropagateLoader color="#2563EB" size={15} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800 dark:from-gray-900 dark:to-gray-800 dark:text-white py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-12" data-aos="fade-up">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-300">
            About This Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sharing insights, stories, and tutorials about web development,
            technology, productivity, and life — one post at a time.
          </p>
        </div>

        {/* Author Section */}
        <div
          className="flex flex-col md:flex-row items-center gap-10"
          data-aos="fade-right"
        >
          <img
            src={preview}
            alt="Author"
            className="w-40 h-40 rounded-full shadow-md object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">Hi, I'm Jatin 👋</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              I'm a full-stack developer with a passion for clean code, great UI, and solving real-world problems. I started this blog to share my experiences and help others learn and grow in tech. Whether it's JavaScript, React, backend development, or cloud tools — you'll find honest tutorials and opinions here.
            </p>
          </div>
        </div>

        {/* Blog Goals */}
        <div className="space-y-4" data-aos="fade-up">
          <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400">
            🎯 What You’ll Find Here
          </h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            <li>Frontend & Backend development tutorials</li>
            <li>Tech opinions, reviews, and trends</li>
            <li>Tips on productivity & developer mindset</li>
            <li>Occasional personal stories & inspiration</li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="space-y-4" data-aos="fade-left">
          <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400">
            🛠️ Built With
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            This blog is built using React, Tailwind CSS, Node.js, and MongoDB.
            Hosting is powered by Vercel. I believe in keeping things fast,
            responsive, and simple — just like good code should be.
          </p>
        </div>

        {/* Closing Note */}
        <div className="text-center pt-8" data-aos="fade-in">
          <p className="text-md text-gray-600 dark:text-gray-400 italic">
            Thank you for reading and being a part of this journey. Whether
            you're a beginner or an experienced dev, I hope you find something
            valuable here.
          </p>
          <p className="mt-2 font-semibold">– Akhil K</p>
        </div>
      </div>
    </div>
  );
};

export default About;
