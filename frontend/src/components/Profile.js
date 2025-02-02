import React, { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { useSelector, useDispatch } from "react-redux";
import useGetProfile from "../hooks/useGetProfile";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { followingUpdate } from "../redux/userSlice";
import { getRefresh } from "../redux/tweetSlice";

const Profile = () => {
  const { user, profile } = useSelector((store) => store.user);
  const { id } = useParams();
  const dispatch = useDispatch();

  useGetProfile(id);

  const [backgroundImage, setBackgroundImage] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    if (profile) {
      setBackgroundImage(profile.backgroundImage || "");
      setAvatarImage(profile.avatarImage || "");
      setNewName(profile.name || "");
      setNewBio(profile.bio || "");
    }
  }, [profile]);

  const followAndUnfollowHandler = async () => {
    try {
      const url = `${USER_API_END_POINT}/${
        user.following.includes(id) ? "unfollow" : "follow"
      }/${id}`;
      const res = await axios.post(
        url,
        { id: user?._id },
        { withCredentials: true }
      );
      dispatch(followingUpdate(id));
      dispatch(getRefresh());
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update follow status.");
    }
  };

  const handleBackgroundUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/upload/background`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setBackgroundImage(res.data.imageUrl);
      toast.success("Background updated successfully!");
    } catch (error) {
      toast.error("Failed to upload background image.");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/upload/avatar`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setAvatarImage(res.data.imageUrl);
      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error("Failed to upload avatar image.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        `${USER_API_END_POINT}/profile/update`,
        { name: newName, bio: newBio },
        { withCredentials: true }
      );
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      dispatch(getRefresh());
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-300">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/"
          className="p-2 rounded-full hover:bg-gray-100 transition-all"
        >
          <IoMdArrowBack size="24px" />
        </Link>
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl text-gray-800">{profile?.name}</h1>
          <p className="text-gray-500 text-sm">{profile ? "10 posts" : ""}</p>
        </div>
      </div>
      <div className="relative mb-6">
        <img
          src={backgroundImage || "https://via.placeholder.com/1080x360"}
          alt="banner"
          className="w-full h-56 object-cover rounded-t-lg"
        />
        {profile?._id === user?._id && (
          <label className="absolute top-2 right-2 bg-white p-2 rounded-full text-xs cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="hidden"
            />
            Edit
          </label>
        )}
        <div className="absolute -bottom-16 left-6 border-4 border-white rounded-full shadow-lg">
          {avatarImage ? (
            <img
              src={avatarImage}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover"
            />
          ) : (
            <Avatar name={profile?.name || "User"} size="120" round={true} />
          )}
          {profile?._id === user?._id && (
            <label className="absolute top-20 right-1 bg-white p-2 rounded-full text-xs cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              Edit
            </label>
          )}
        </div>
      </div>
      <div className="pt-20 pl-4 mb-6">
        <h1 className="font-bold text-2xl text-gray-800">{profile?.name}</h1>
        <p className="text-gray-500">@{profile?.username}</p>
      </div>
      <div className="text-right mb-6">
        {profile?._id === user?._id ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 font-medium bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-all"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={followAndUnfollowHandler}
            className="px-5 py-2 font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-full transition-all"
          >
            {user.following.includes(id) ? "Following" : "Follow"}
          </button>
        )}
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="Bio"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 mr-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
