import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { showAlert } from "../utils/ShowAlert"; // Your custom alert util
import { loginSchema } from "../Validation/EmailValidation";
import { Link } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    const loginData = localStorage.getItem("login");
    if (loginData) {
      window.location.href = "/";
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL_API}/admin/login`,
          values
        );
        showAlert("success", response.data.message);
        console.log("response.data", response.data);
        localStorage.setItem("login", JSON.stringify(response.data.data));
        window.location.href = "/";
      } catch (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Login failed. Try again."
        );
      }
    },
  });

  return (
    <div>
      <div className="center-center">
        <div className="sphere sphere-1" />
        <div className="sphere sphere-2" />
        <div className="sphere sphere-3" />
        <div className="glass-card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold title mb-2">Welcome</h1>
            <p className="text-white opacity-80">Sign in to your account</p>
          </div>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="form-design">
              <div className="form-group">
                <div className="flex items-center mb-1">
                  <label
                    htmlFor="email"
                    className="text-white text-sm opacity-80"
                  >
                    Email Address
                  </label>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-field"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-danger text-xs mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="form-group">
                <div className="flex items-center mb-1">
                  <label
                    htmlFor="password"
                    className="text-white text-sm opacity-80"
                  >
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="input-field"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-danger text-xs mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between py-3">
              <div className="checkbox-container">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" className="text-white cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-white">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-login font-medium w-100"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
