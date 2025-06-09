import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import { OtpSchema } from "../../Validation/EmailValidation";
import { showAlert } from "../../utils/ShowAlert";
import { useLocation } from "react-router-dom";

const PdfVerification = () => {
  const location = useLocation();
  const pdfId = location.state?.pdfId;

  if (!pdfId) {
    showAlert("error", "PDF ID not found. Please go back and try again.");
    return;
  }

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: OtpSchema,
    onSubmit: async (values) => {
      try {
        const email = localStorage.getItem("otpEmail");

        if (!email) {
          showAlert("error", "Email not found. Please go back and try again.");
          return;
        }
        console.log("Verifying OTP for email:", email);
        console.log("OTP:", values.otp);

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL_API}/users/verify-otp`,
          { email, otp: values.otp }
        );

        showAlert(
          "success",
          response.data.message || "OTP verified successfully"
        );

        // Clear storage or redirect as needed
        localStorage.removeItem("otpEmail");

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL_API}/pdf/access/${pdfId}`,
            { email }
          );

          // If successful, backend returns { filePath: "/uploads/..." }
          const pdfUrl = `${import.meta.env.VITE_BASE_URL}${
            response.data.filePath
          }`;

          // Show the PDF to user, e.g. open in new tab or embed
          window.open(pdfUrl, "_blank");
        } catch (error) {
          // Show error message from backend
          showAlert(
            "error",
            error.response?.data?.message || "Access to PDF denied"
          );
        }
      } catch (error) {
        showAlert(
          "error",
          error.response?.data?.message || "OTP verification failed"
        );
      }
    },
  });

  const handleOtpChange = (value, index) => {
    const currentOtp = formik.values.otp.padEnd(6, " ");
    const updatedOtp =
      currentOtp.substring(0, index) + value + currentOtp.substring(index + 1);
    formik.setFieldValue("otp", updatedOtp.replace(/\s/g, ""));
  };
  const getOtpDigit = (index) => formik.values.otp[index] || "";

  return (
    <div>
      <div className="center-center">
        <div className="sphere sphere-1" />
        <div className="sphere sphere-2" />
        <div className="sphere sphere-3" />
        <div className="glass-card">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold title mb-2">Welcome</h1>
            <p className="text-white opacity-80">
              Please Enter Your OTP To Send Your Email
            </p>
          </div>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="form-design">
              <div className="form-group">
                <label
                  htmlFor="email"
                  className="text-white text-sm opacity-80"
                >
                  Email Address
                </label>
                <div className="row">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="col-2 pe-0">
                      <input
                        type="text"
                        maxLength="1"
                        className="input-field text-center"
                        value={getOtpDigit(index)}
                        onChange={(e) =>
                          handleOtpChange(
                            e.target.value.replace(/\D/, ""),
                            index
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
                {formik.touched.otp && formik.errors.otp && (
                  <div className="text-danger text-xs mt-1">
                    {formik.errors.otp}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 pt-3">
              <button type="submit" className="btn-login font-medium w-100">
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PdfVerification;
