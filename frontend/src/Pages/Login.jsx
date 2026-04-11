import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  // ✅ state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ handle change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8989/api/auth/login",
        formData,
      );

      console.log("Login Success:", res.data);

      // ✅ store token
      localStorage.setItem("token", res.data.token);

      alert("Login Successful ✅");

      // 👉 redirect (optional)
      // window.location.href = "/dashboard";
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">
      <div className="w-full max-w-xs bg-white rounded-xl shadow-lg p-5">
        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-xs text-slate-500 mt-1">Login to continue</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex items-center border border-slate-200 rounded-md px-2 focus-within:ring-1 focus-within:ring-blue-400">
            <Mail size={14} className="text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full p-2 text-xs outline-none"
            />
          </div>

          <div className="flex items-center border border-slate-200 rounded-md px-2 focus-within:ring-1 focus-within:ring-blue-400">
            <Lock size={14} className="text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 text-xs outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex justify-end">
            <span className="text-[10px] text-blue-600 cursor-pointer hover:underline">
              Forgot?
            </span>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-md text-xs font-medium hover:bg-slate-800 transition"
          >
            Login <ArrowRight size={14} />
          </button>
        </form>

        {/* SAME UI BELOW */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="px-2 text-[10px] text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1 border border-slate-200 rounded-md py-1.5 text-xs hover:bg-slate-100 transition">
            <FontAwesomeIcon icon={faGoogle} className="text-red-500 text-sm" />
            Google
          </button>

          <button className="flex items-center justify-center gap-1 border border-slate-200 rounded-md py-1.5 text-xs hover:bg-slate-100 transition">
            <FontAwesomeIcon icon={faGithub} className="text-black text-sm" />
            GitHub
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-500 mt-4">
          Don’t have an account?{" "}
          <span className="text-blue-600 cursor-pointer font-medium hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
