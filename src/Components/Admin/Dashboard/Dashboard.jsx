import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCopy, FaFilePdf, FaTrash } from "react-icons/fa";
import { showAlert, AreYouSure } from "../../utils/ShowAlert";

const Dashboard = () => {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL_API}/pdf/view`
      );
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];

      // Sort by createdAt descending
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPdfs(sorted);
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.message || "Dashboard load failed"
      );
    }
  };

  const handleCopyLink = (id) => {
    const link = `${window.location.origin}/pdf-view/${id}`;
    navigator.clipboard.writeText(link);
    showAlert("success", "Link copied to clipboard");
  };

  const handleDelete = async (id) => {
    const result = await AreYouSure(
      "Are you sure?",
      "This PDF will be deleted permanently"
    );
    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL_API}/pdf/delete/${id}`
        );
        showAlert("success", "PDF deleted successfully");
        fetchPdfs();
      } catch (err) {
        showAlert(
          "error",
          err.response?.data?.message || "Failed to delete PDF"
        );
      }
    }
  };

  // Metrics Calculation
  const totalLinks = pdfs.length;
  const now = new Date();

  const activePdfs = pdfs.filter(
    (pdf) => !pdf.expiryTime || new Date(pdf.expiryTime) > now
  );

  const expiredPdfs = pdfs.filter(
    (pdf) => pdf.expiryTime && new Date(pdf.expiryTime) <= now
  );

  const expiredLinks = expiredPdfs.length;

  return (
    <div className="container mt-2">
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card comman-design text-white p-3 shadow rounded">
            <h5>Total PDF Links Generated</h5>
            <h3>{totalLinks}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card comman-design text-white p-3 shadow rounded">
            <h5>Active Links</h5>
            <h3>{activePdfs.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card comman-design text-white p-3 shadow rounded">
            <h5>Expired Links</h5>
            <h3>{expiredLinks}</h3>
          </div>
        </div>
      </div>

      <div className="comman-design">
        <div className="design-header">
          <h4 className="text-white">Currently Active PDFs</h4>
        </div>
        <div className="design-body">
          <div className="table-responsive">
            <table className="table table-hover text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Sr. No.</th>
                  <th>PDF</th>
                  <th>User Limit </th>
                  <th>Expires at</th>
                  <th>IP Address(es)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activePdfs.length > 0 ? (
                  activePdfs.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="py-2 px-2 w-fit rounded bg-light mx-auto">
                          <FaFilePdf className="fs-4 text-dark" />
                        </div>
                      </td>
                      <td>
                        <div>{item.userLimit}</div>
                      </td>
                      <td>
                        <div className="small text-white">
                          {item.expiryTime ? (
                            <>
                              {new Date(item.expiryTime).toLocaleDateString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                }
                              )}
                              <br />
                              {new Date(item.expiryTime).toLocaleTimeString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                }
                              )}
                            </>
                          ) : (
                            "No Expiry"
                          )}
                        </div>
                      </td>
                      <td>
                        {item.accessList?.length > 0 ? (
                          item.accessList.map((access, i) => (
                            <div key={i}>{access.ip}</div>
                          ))
                        ) : (
                          <span>Not Accessed</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleCopyLink(item._id)}
                            title="Copy Link"
                          >
                            <FaCopy />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(item._id)}
                            title="Delete PDF"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No Active PDFs</td>
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

export default Dashboard;
