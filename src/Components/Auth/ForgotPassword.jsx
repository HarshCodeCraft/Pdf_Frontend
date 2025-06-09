import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { showAlert } from "../utils/ShowAlert"; // Your custom alert util
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL_API}/admin/forgot-password`,
          values
        );
        showAlert("success", response.data.message);

        // Save email in localStorage or context to use in verify step
        localStorage.setItem("adminEmail", values.email);

        // Navigate to OTP verification page
        navigate("/otp");
      } catch (error) {
        showAlert(
          "error",
          error.response?.data?.message || "OTP request failed. Try again."
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
            <h1 className="text-4xl font-bold title mb-2">Forgot Password</h1>
            <p className="text-white opacity-80">Enter your email to receive OTP</p>
          </div>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="form-design">
              <div className="form-group">
                <label htmlFor="email" className="text-white text-sm opacity-80">
                  Email Address
                </label>
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
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="btn-login font-medium w-100"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
