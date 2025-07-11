import axios from "axios";
import React, { useEffect, useState } from "react";
import api from "../apis/api";

function Creator() {
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const { data } = await axios.get(`${api.admins}`,
        {
          withCredentials: true,
        }
      )
      console.log("Set Admin", data);
      setAdmin(data.admins);
    }
    fetchAdmins();
  }, [])
  return (
    <div className=" pl-10 container mx-auto p-4 dark:text-white dark:bg-gray-900">
      <h1 className="text-xl font-semibold  mb-9 ">Popular Creators</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-5 rounded-full my-5">
        {admin && admin.length > 0 ? (
          admin.slice(0, 4).map((element) => {
            return (
              <div key={element._id}>
                <div className="flex flex-col gap-4  ">
                  <img
                    src={element.photo.url}
                    alt="blog"
                    className="md:w-56 md:h-56 object-cover border border-black rounded-full items-center "
                  />
                  <div className="text-center md:ml-[-130px]">
                    <p>{element.name}</p>
                    <p className="text-gray-600 text-xs">{element.role}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

export default Creator;