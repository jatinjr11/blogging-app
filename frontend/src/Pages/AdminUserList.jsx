import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import api from '../apis/api';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const { profile } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 600, once: true });

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${api.Get_all_users}`, {
          withCredentials: true,
        });
        setUsers(res.data.users);
      } catch (err) {
        toast.error('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  const toggleBlock = async (userId, isBlocked) => {
    try {
      const res = await axios.put(
        `${Apis.block_user}/${userId}/${isBlocked ? 'unblock' : 'block'}`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBlocked: !isBlocked } : u))
      );
    } catch (err) {
      toast.error('Action failed');
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <p className="text-center mt-10 text-red-600 dark:text-red-400 font-semibold">
        Access Denied
      </p>
    );
  }

  return (
    <div className="px-6 md:px-24 py-16 w-full dark:bg-gray-900 transition-colors duration-300">
      <h2
        className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white"
        data-aos="fade-down"
      >
        👥 Manage Users
      </h2>

      <div
        className="overflow-x-auto shadow-xl rounded-lg bg-white dark:bg-gray-800 transition duration-300"
        data-aos="fade-up"
      >
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-800 dark:text-gray-200 text-sm">
              <th className="px-6 py-4 border-b dark:border-gray-600">Name</th>
              <th className="px-6 py-4 border-b dark:border-gray-600">Email</th>
              <th className="px-6 py-4 border-b dark:border-gray-600">Status</th>
              <th className="px-6 py-4 border-b dark:border-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => user.role === 'user')
              .map((user, i) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-200"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <td className="px-6 py-4 border-b dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 border-b dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 border-b dark:border-gray-600">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.isBlocked
                          ? 'bg-red-100 text-red-600 dark:bg-red-400/20 dark:text-red-400'
                          : 'bg-green-100 text-green-600 dark:bg-green-400/20 dark:text-green-400'
                      }`}
                    >
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b dark:border-gray-600">
                    <button
                      onClick={() => toggleBlock(user._id, user.isBlocked)}
                      className={`px-5 py-2 rounded-md text-sm font-medium shadow-sm transition duration-300 ${
                        user.isBlocked
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-red-500 hover:bg-red-600'
                      } text-white`}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserList;
