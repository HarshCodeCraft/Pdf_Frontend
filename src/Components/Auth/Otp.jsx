import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { showAlert } from "../utils/ShowAlert";
import { useNavigate } from "react-router-dom";
import { OtpSchema } from "../Validation/EmailValidation"; // use OTP schema

const Otp = () => {
  const navigate = useNavigate();

  const email = localStorage.getItem("adminEmail"); // Get email stored earlier

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: OtpSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL_API}/admin/verify-otp`,
          {
            email,
            otp: values.otp,
          }
        );
        showAlert("success", response.data.message);

        // On success, go to reset password page
        navigate("/reset-password");
      } catch (error) {
        showAlert(
          "error",
          error.response?.data?.message || "OTP verification failed"
        );
      }
    },
  });

  return (
    <div className="center-center">
      <div className="glass-card">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold title mb-2">OTP Verification</h1>
          <p className="text-white opacity-80">
            Enter the 6-digit OTP sent to your email
          </p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp" className="text-white text-sm opacity-80">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              className="input-field"
              placeholder="Enter your OTP"
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.otp && formik.errors.otp && (
              <p className="text-danger text-xs mt-1">{formik.errors.otp}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-login font-medium w-100 mt-5"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
