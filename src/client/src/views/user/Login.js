import axios from "axios";
import React, { useState } from "react";
import Cookies from "universal-cookie"

const Login = () => {
  const [formData, setFormData] = useState({
    mail: "",
    password: "",
  });

  const [err,setErr] = useState('');

  const handleChange = (e) => {
  const { name, value } = e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          // Add your form submission logic here
          const response = await axios.post("http://localhost:9000/api/auth/login", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
          });
    
          if (response.status >=200 && response.status<400) {
              setErr('');
              window.location.href = "http://localhost:3000/verify-otp"
          }
        } catch (error) {
          console.error("Failed to login user:", error);
          setErr(error.response.data.message)
          console.error("Error during form submission:", error);
        }
  };

  return (
    <section className="bg-gray-50 mx-auto">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto my-auto">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            {err!=='' && <div className="text-red font-bold">
                Error: {err}
            </div>}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="uid" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input type="input" name="mail" id="mail" value={formData.mail} onChange={handleChange} 
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="mail@example.com" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder="••••••••" 
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
              </div>
              <button type="submit" className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>
              <p className="text-sm font-light text-gray-500">
                Don’t have an account yet? <a href="/signup" className="font-medium text-gray-600 hover:underline">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
