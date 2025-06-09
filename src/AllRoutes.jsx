import { Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Admin/Dashboard/Dashboard";
import Login from "./Components/Auth/Login";
import Pdf from "./Components/Admin/Pdf/Pdf";
import PdfUploader from "./Components/Admin/Pdf/PdfUploader";
import PdfView from "./Components/Admin/Pdf/PdfView";
import PdfVerification from "./Components/Admin/Pdf/PdfVerification";
import UserPdfView from "./Components/Admin/Pdf/UserPdfView";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import Otp from "./Components/Auth/Otp";
import ResetPassword from "./Components/Auth/ResetPassword";
import ProtectiveRoutes from "./ProtectiveRoutes";

const AllRoutes = () => {
  // Define your routes
  const AllPage = [
    {
      path: "/",
      element: <Dashboard />,
    },
    { path: "/pdf", element: <Pdf /> },
    { path: "/pdf-uploader", element: <PdfUploader /> },
    { path: "/pdf-email/:pdfId", element: <PdfView /> },
    { path: "/pdf-verification", element: <PdfVerification /> },
    // { path: "/pdf-view/:pdfid", element: <UserPdfView /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/otp", element: <Otp /> },
    { path: "/reset-password", element: <ResetPassword /> },
  ];

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/pdf-view/:pdfid" element={<UserPdfView />} />
      <Route element={<ProtectiveRoutes />}>
        {AllPage.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
};

export default AllRoutes;
