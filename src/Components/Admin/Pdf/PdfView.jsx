import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { showAlert } from "../../utils/ShowAlert";
import { EmailSchema } from "../../Validation/EmailValidation";
import { useNavigate, useParams } from "react-router-dom";

const PdfView = () => {
  const { pdfId } = useParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: EmailSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("Submitted Email:", values.email);

        const formData = new FormData();
        formData.append("email", values.email);

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL_API}/users/add`,
          formData
        );
        showAlert("success", response.data.message);
        resetForm();
        navigate("/pdf-verification", { state: { pdfId: pdfId } });
        localStorage.setItem("otpEmail", values.email);
      } catch (err) {
        showAlert("error", err.response?.data?.message || "Upload failed");
      }
    },
  });

  return (
    <div className="center-center">
      <div className="sphere sphere-1" />
      <div className="sphere sphere-2" />
      <div className="sphere sphere-3" />
      <div className="glass-card">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold title mb-2">Welcome</h1>
          <p className="text-white opacity-80">
            Please Enter Your Email To Get OTP
          </p>
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
                <div className="text-danger text-xs mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 pt-3">
            <button type="submit" className="btn-login font-medium w-100">
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PdfView;
