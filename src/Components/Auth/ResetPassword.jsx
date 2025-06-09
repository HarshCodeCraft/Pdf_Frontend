import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { showAlert } from "../utils/ShowAlert";
import { ResetPasswordSchema } from "../Validation/EmailValidation";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const email = localStorage.getItem("adminEmail"); // Get email from localStorage

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      console.log("password", values.password);
      console.log("confirm_password", values.confirm_password);
      console.log("email", email);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL_API}/admin/reset-password`,
          {
            email,
            newPassword: values.password,
          }
        );
        showAlert("success", response.data.message);
        localStorage.setItem("login", JSON.stringify(response.data.data));
        window.location.href = "/";
      } catch (error) {
        showAlert(
          "error",
          error.response?.data?.message || "Password reset failed"
        );
      }
    },
  });

  return (
    <div className="center-center">
      <div className="glass-card">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold title mb-2">Reset Password</h1>
          <p className="text-white opacity-80">Enter your new password</p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="password" className="text-white text-sm opacity-80">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input-field"
              placeholder="Enter your new password"
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

          <div className="form-group mt-4">
            <label
              htmlFor="confirm_password"
              className="text-white text-sm opacity-80"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              className="input-field"
              placeholder="Re-enter your password"
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirm_password &&
              formik.errors.confirm_password && (
                <p className="text-danger text-xs mt-1">
                  {formik.errors.confirm_password}
                </p>
              )}
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
            {formik.isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
