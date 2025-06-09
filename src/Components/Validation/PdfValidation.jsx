import * as Yup from "yup";

export const pdfUploadSchema = Yup.object().shape({
  pdf: Yup.mixed()
    .required("PDF file is required")
    .test("fileType", "Only PDF files are allowed", (value) => {
      return value && value.type === "application/pdf";
    }),
  expiryTime: Yup.string().required("Expiry time is required"),
  userLimit: Yup.number()
    .required("User limit is required")
    .min(1, "User limit must be at least 1")
    .max(100, "User limit can’t exceed 100"),
});
