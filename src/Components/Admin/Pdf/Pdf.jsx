import React, { useEffect, useState } from "react";
import { FaCopy, FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
import axios from "axios";
import { showAlert, AreYouSure } from "../../utils/ShowAlert";
import { Link } from "react-router-dom";

const Pdf = () => {
  const [pdfData, setPdfData] = useState([]);

  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_API}/pdf/view`
        );
        setPdfData(response.data.data);
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

  return (
    <div>
      <div className="comman-design">
        <div className="design-header">
          <h2>PDF Management</h2>
        </div>
        <div className="design-body">
          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Sr.no</th>
                  <th>PDF</th>
                  <th>User Limit</th>
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
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-primary btn-sm"
                            title="Copy Link"
                            onClick={() => handleCopyLink(item._id)}
                          >
                            <FaCopy className="text-white" />
                          </button>
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
