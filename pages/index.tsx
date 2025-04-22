"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useLoginQuery } from '../public/Login/useLoginQuery';
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from '../components/ThemeProvider';


interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { userLogin, loading, isSuccessLogin } = useLoginQuery();
  const [showPassword, setShowPassword] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();


  useEffect(()=>{
    if(isSuccessLogin){
      router.push('/DashBoard')
    }
  },[isSuccessLogin])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    const payload: any = {
      username: data.email,
      password: data.password,
    };
    userLogin(payload);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 px-4 relative">
    <button
      onClick={toggleTheme}
      className="absolute top-4 left-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md dark:shadow-indigo-500/20 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative w-8 h-8 flex items-center justify-center">
        <span className={`absolute transition-all duration-500 ${
          theme === 'light' 
            ? 'opacity-100 transform rotate-0' 
            : 'opacity-0 transform -rotate-90 scale-0'
        }`}>
          🌙
        </span>
        <span className={`absolute transition-all duration-500 ${
          theme === 'light' 
            ? 'opacity-0 transform rotate-90 scale-0' 
            : 'opacity-100 transform rotate-0'
        }`}>
          ☀️
        </span>
      </div>
    </button>
  
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-indigo-500/20 shadow-2xl dark:shadow-indigo-900/20 rounded-2xl p-8 sm:p-10 w-full max-w-md">
      <div className="flex justify-center mb-6">
        <img
          src={theme === 'light' ? "/AppIconBlack.png" : "/zoaverWhiteIcon.png"}
          alt="Logo"
          className="dark:h-14 dark:w-auto"
        />
      </div>
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-indigo-300 mb-8">
        Welcome Back!
      </h2>
  
      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-2">
            Email/User Name
          </label>
          <input
            type="text"
            className={`w-full p-3 border-2 ${
              errors.email
                ? "border-red-500 focus:border-red-500 dark:border-red-600 dark:focus:border-red-600"
                : "border-gray-200 focus:border-blue-500 dark:placeholder-slate-400 dark:border-indigo-500/30 dark:focus:border-indigo-500 dark:bg-gray-700 dark:text-indigo-100"
            } rounded-lg outline-none transition-colors`}
            placeholder="Enter your email"
            {...register("email", {
              required: "Email/User Name is required",
            })}
          />
          {errors.email && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.email.message}</p>
          )}
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-indigo-200 mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"} 
            className={`w-full p-3 border-2 ${
              errors.password
                ? "border-red-500 focus:border-red-500 dark:border-red-600 dark:focus:border-red-600"
                : "border-gray-200 focus:border-blue-500 dark:placeholder-slate-400 dark:border-indigo-500/30 dark:focus:border-indigo-500 dark:bg-gray-700 dark:text-indigo-100"
            } rounded-lg outline-none transition-colors`}
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-indigo-300 focus:outline-none"
          >
            {/* {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />} */}
          </button>
          {errors.password && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-2">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-indigo-600 dark:to-purple-700 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 dark:hover:from-indigo-700 dark:hover:to-purple-800 transition-all flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> 
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  </div>
  );
};

export default LoginForm;