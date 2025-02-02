import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";

const RightSidebar = ({ otherUsers }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query
  const filteredUsers = otherUsers?.filter((user) =>
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[25%]">
      {/* Search Bar */}
      <div className="flex items-center p-2 bg-gray-100 rounded-full outline-none w-full shadow-md">
        <CiSearch size="20px" />
        <input
          type="text"
          className="bg-transparent outline-none px-2 w-full"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        />
      </div>

      {/* Who to follow section */}
      <div className="p-4 bg-gray-100 rounded-2xl my-4 shadow-lg">
        <h1 className="font-bold text-lg mb-4">Who to follow</h1>
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user?._id}
              className="flex items-center justify-between p-4 my-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <Avatar
                  src={user?.avatar}
                  name={user?.name || "User"}
                  size="40"
                  round={true}
                  color={Avatar.getRandomColor(user?.name, [
                    "#f56a00",
                    "#7265e6",
                    "#ffbf00",
                    "#00a2ae",
                  ])}
                />
                <div className="ml-3">
                  <Link
                    to={`/profile/${user?._id}`}
                    className="text-lg font-bold text-gray-800 hover:text-blue-500"
                  >
                    {user?.name}
                  </Link>
                  <p className="text-sm text-gray-500">{`@${user?.username}`}</p>
                </div>
              </div>
              <div>
                <Link to={`/profile/${user?._id}`}>
                  <button className="px-4 py-1 bg-black text-white rounded-full hover:bg-gray-800 transition">
                    Profile
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No users found</p> // Message for no results
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
