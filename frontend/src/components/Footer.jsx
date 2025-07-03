import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";

const Footer = () => {
  return (
    <>
      <footer className="bg-customGray dark:bg-gray-900 border-t border-gray-700 text-black dark:text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Categories */}
          <div>
            <h2 className="text-lg font-semibold mb-4 uppercase">Categories</h2>
            <ul className="space-y-2 text-sm">
              {["Spiritual", "Technology", "Health", "Travel"].map((cat) => (
                <li key={cat}>
                  <a href="#" className="hover:text-blue-500 transition">
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-lg font-semibold mb-4 uppercase">Resources</h2>
            <ul className="space-y-2 text-sm">
              {["Write for us", "Become a Contributor", "Help Center"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-500 transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h2 className="text-lg font-semibold mb-4 uppercase">About</h2>
            <ul className="space-y-2 text-sm">
              {["About Us", "Privacy Policy", "Terms & Conditions"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-500 transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h2 className="text-lg font-semibold mb-4 uppercase">Connect</h2>
            <ul className="space-y-2 text-sm">
              <li>Email: <a href="mailto:support@cilliblog.com" className="hover:text-blue-500">support@cilliblog.com</a></li>
              <li>Phone: <a href="tel:+919876543210" className="hover:text-blue-500">+91 98765 43210</a></li>
            </ul>
            <div className="flex space-x-4 mt-4">
              {[
                {
                  icon: <FaGithub className="w-5 h-5" />,
                  label: "GitHub",
                  url: "https://github.com/jatinjr11",
                },
                {
                  icon: <BsYoutube className="w-5 h-5" />,
                  label: "YouTube",
                  url: "https://youtube.com",
                },
                {
                  icon: <FaLinkedin className="w-5 h-5" />,
                  label: "LinkedIn",
                  url: "https://www.linkedin.com/in/jatin-patel-6a334529b/",
                },
              ].map(({ icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 py-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="font-bold text-gray-800 dark:text-white">
            ssd<span className="text-blue-500">Blog</span>
          </p>
          <p className="mt-2 sm:mt-0 text-center sm:text-left">&copy; 2025 ssdBlog. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
