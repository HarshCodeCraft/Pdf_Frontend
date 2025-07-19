import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaFilePdf, FaCopy } from "react-icons/fa";
import axios from "axios";
import { showAlert, AreYouSure } from "../../utils/ShowAlert";
import { Link } from "react-router-dom";

const Pdf = () => {
  const [pdfData, setPdfData] = useState([]);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_API}/pdf/details`
        );
        setPdfData(response.data.data.reverse());
        console.log(response.data.data);
      } catch (err) {
        showAlert(
          "error",
          err.response?.data?.message || "Failed to fetch PDF data"
        );
      }
    };

    fetchPdfData();
  }, []);

  const handleDelete = async (id) => {
    const result = await AreYouSure(
      "Are you sure?",
      "You won't be able to revert this!"
    );

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL_API}/pdf/delete/${id}`
        );
        showAlert("success", "PDF deleted successfully");
        setPdfData((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        showAlert(
          "error",
          err.response?.data?.message || "Failed to delete PDF"
        );
      }
    }
  };

   const handleCopyLink = (id) => {
      const link = `${window.location.origin}/pdf-view/${id}`;
      navigator.clipboard.writeText(link);
      showAlert("success", "Link copied to clipboard");
    };
  // function fallbackCopy(text) {
  //   const textarea = document.createElement("textarea");
  //   textarea.value = text;
  //   textarea.setAttribute("readonly", "");
  //   textarea.style.position = "absolute";
  //   textarea.style.left = "-9999px";
  //   document.body.appendChild(textarea);
  //   textarea.select();

  //   try {
  //     const success = document.execCommand("copy");
  //     if (success) {
  //       showAlert("success", "Link copied (fallback)");
  //     } else {
  //       showAlert("error", "Copy failed (fallback)");
  //     }
  //   } catch (err) {
  //     console.error("Fallback copy failed:", err);
  //     showAlert("error", "Clipboard not supported");
  //   }

  //   document.body.removeChild(textarea);
  // }
  return (
    <div>
      <div className="comman-design">
        <div className="design-header">
          <h2>PDF Management</h2>
          {/* <h2>PDF Management</h2> */}
        </div>
        <div className="design-body">
          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Sr.no</th>
                  <th>PDF</th>
                  <th>User Limit</th>
                  <th>Expiry Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pdfData.length > 0 ? (
                  pdfData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="py-2 px-2 w-fit rounded bg-light mx-auto">
                          <FaFilePdf className="fs-4 text-dark" />
                        </div>
                      </td>
                      <td>{item.userLimit}</td>
                      <td>
                        {new Date(item.expiryTime).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          hour12: true, // optional: for AM/PM
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          {/* <Link
                            target="_"
                            // to={`${import.meta.env.VITE_BASE_URL}${
                            //   item.filePath
                            // }`}
                            // to={/pdf-email/${item._id}}
                            to={/pdf-view/${item._id}}
                            className="btn btn-info btn-sm"
                            title="View"
                          >
                            <FaEye className="text-white" />
                          </Link> */}
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleCopyLink(item._id)}
                            title="Copy Link"
                          >
                            <FaCopy />
                          </button>
                          {/* <button
                            className="btn btn-warning btn-sm"
                            title="Edit"
                          >
                            <FaEdit className="text-white" />
                          </button> */}
                          <button
                            className="btn btn-danger btn-sm"
                            title="Delete"
                            onClick={() => handleDelete(item._id)}
                          >
                            <FaTrash className="text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pdf;