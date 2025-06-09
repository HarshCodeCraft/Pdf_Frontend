import React from "react";
import { useFormik } from "formik";
import { pdfUploadSchema } from "../../Validation/PdfValidation";
import { showAlert } from "../../utils/ShowAlert";
import axios from "axios";

const PdfUploader = () => {
  const formik = useFormik({
    initialValues: {
      pdf: null,
      expiryTime: "",
      userLimit: "",
    },
    validationSchema: pdfUploadSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("pdf", values.pdf);
        formData.append("expiryTime", values.expiryTime);
        formData.append("userLimit", values.userLimit);

        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL_API}/pdf/upload`,
          formData
        );
        showAlert("success", response.data.message);
        resetForm();
      } catch (err) {
        showAlert("error", err.response?.data?.message || "Upload failed");
      }
    },
  });

  return (
    <div className="comman-design">
      <div className="">
        <div className="design-header">
          <h2>Upload PDF</h2>
        </div>
        <div className="design-body">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group mb-4">
                  <label htmlFor="pdf" className="text-white">
                    Select PDF File
                  </label>
                  <input
                    id="pdf"
                    name="pdf"
                    type="file"
                    className="input-field"
                    accept="application/pdf"
                    onChange={(event) =>
                      formik.setFieldValue("pdf", event.currentTarget.files[0])
                    }
                  />
                  {formik.errors.pdf && formik.touched.pdf && (
                    <div className="text-danger text-sm">
                      {formik.errors.pdf}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mb-4">
                  <label htmlFor="expiryTime" className="text-white">
                    Expiry Time
                  </label>
                  <input
                    type="datetime-local"
                    id="expiryTime"
                    name="expiryTime"
                    className="input-field"
                    onChange={formik.handleChange}
                    value={formik.values.expiryTime}
                  />
                  {formik.errors.expiryTime && formik.touched.expiryTime && (
                    <div className="text-danger text-sm">
                      {formik.errors.expiryTime}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mb-4">
                  <label htmlFor="userLimit" className="text-white">
                    User Limit
                  </label>
                  <input
                    type="number"
                    id="userLimit"
                    name="userLimit"
                    className="input-field"
                    onChange={formik.handleChange}
                    value={formik.values.userLimit}
                  />
                  {formik.errors.userLimit && formik.touched.userLimit && (
                    <div className="text-danger text-sm">
                      {formik.errors.userLimit}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn-login font-medium w-100">
              Upload PDF
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PdfUploader;
