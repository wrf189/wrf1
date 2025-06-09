import React from "react";
import axios from "axios";
import { API_URL } from "../utils/constantApi";
import Cookies from "js-cookie";

const LoginPage = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // Hit endpoint /auth/login
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (loginResponse.status === 200) {
        const token = loginResponse.data.token;

        // Simpan token ke cookies
        Cookies.set("token", token, { expires: 1 }); // expires 1 day

        // Hit endpoint /auth/verify-token dengan token di header
        const verifyResponse = await axios.get(`${API_URL}/auth/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (verifyResponse.status === 200) {
          console.log("Token verified successfully!");

          // Simpan user ke localStorage
          localStorage.setItem(
            "claim",
            JSON.stringify(verifyResponse.data.user)
          );

          // Delay 1.5 detik lalu redirect ke /dashboard
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Login or verification failed:", error);
      // alert("Login gagal. Cek email/password kamu.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
