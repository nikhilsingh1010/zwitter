import React, { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/userSlice";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = isLogin
        ? await axios.post(
            `${USER_API_END_POINT}/login`,
            { email, password },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          )
        : await axios.post(
            `${USER_API_END_POINT}/register`,
            { name, username, email, password },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
      if (res.data.success) {
        toast.success(res.data.message);
        if (isLogin) {
          dispatch(getUser(res.data.user));
          navigate("/");
        } else {
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loginSignupHandler = () => setIsLogin(!isLogin);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600">
      <div className="flex flex-col items-center w-[90%] max-w-md bg-white p-6 rounded-2xl shadow-2xl">
        <img
          className="w-16 mb-4"
          src="https://www.edigitalagency.com.au/wp-content/uploads/new-Twitter-logo-x-black-png-1200x1227.png"
          alt="twitter-logo"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Happening now.
        </h1>
        <h2 className="text-xl font-semibold text-gray-600 mb-4">
          {isLogin ? "Login" : "Signup"}
        </h2>
        <form onSubmit={submitHandler} className="flex flex-col w-full gap-3">
          {!isLogin && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            className={`w-full py-2 mt-2 rounded-lg text-lg font-semibold text-white transition-all ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
          </button>
          <p className="mt-2 text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={loginSignupHandler}
              className="font-bold text-blue-600 cursor-pointer hover:underline"
            >
              {isLogin ? "Signup" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
