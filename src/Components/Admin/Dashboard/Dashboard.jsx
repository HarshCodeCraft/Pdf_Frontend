import React, { useEffect, useState } from "react";
import {
  FaFilePdf,
  FaDownload,
  FaFileAlt,
  FaEye,
  FaCopy,
} from "react-icons/fa";
import Sidebar from "../SideBar/Sidebar";
import { showAlert } from "../../utils/ShowAlert";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL_API}/pdf/view`
        );
        setPdfs(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        showAlert(
          "error",
          err.response?.data?.message || "Dashboard load failed"
        );
      }
    };
    fetchPdfs();
  }, []);

  const now = new Date();
  const activePdfs = pdfs.filter(
    (pdf) => !pdf.expiryTime || new Date(pdf.expiryTime) > now
  );

  const expiredPdfs = pdfs.filter(
    (pdf) => pdf.expiryTime && new Date(pdf.expiryTime) <= now
  );

  const handleCopyLink = (id) => {
    const link = `${window.location.origin}/pdf-view/${id}`;
    navigator.clipboard.writeText(link);
    showAlert("success", "Link copied to clipboard");
  };

//  const handleCopyLink = (id) => {
//   const link = `${window.location.origin}/pdf-view/${id}`;

//   if (navigator?.clipboard?.writeText) {
//     navigator.clipboard.writeText(link)
//       .then(() => showAlert("success", "Link copied to clipboard"))
//       .catch((err) => console.error(err)); 
//   } else {
//     // Fallback for non-https
//     const text = document.createElement('input');
//     text.value = link;
//     document.body.appendChild(text);
//     text.select();

//     try {
//       document.execCommand('copy'); // Deprecated but fallback
//       showAlert("success", "Link copied to clipboard.");
//     } catch (err) {
//       console.error(err);
//       showAlert("error", "Failed to copy.");
//     }
//     document.body.removeChild(text);
//   }
// };


  return (
    <div>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="comman-design">
            <div className="design-body">
              <div className="row">
                <div className="col-md-8">
                  <h2 className="text-white fs-5">Total PDF</h2>
                  <h2 className="fs-1 text-white">{pdfs.length}</h2>
                </div>
                <div className="col-md-4">
                  <div className="h-100 d-flex align-items-center justify-content-end">
                    <FaFilePdf size={55} color="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="comman-design">
            <div className="design-body">
              <div className="row">
                <div className="col-md-8">
                  <h2 className="text-white fs-5">Total Active PDF</h2>
                  <h2 className="fs-1 text-white">{activePdfs.length}</h2>
                </div>
                <div className="col-md-4">
                  <div className="h-100 d-flex align-items-center justify-content-end">
                    <FaDownload size={55} color="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="comman-design">
            <div className="design-body">
              <div className="row">
                <div className="col-md-8">
                  <h2 className="text-white fs-5">Total Expired PDF</h2>
                  <h2 className="fs-1 text-white">{expiredPdfs.length}</h2>
                </div>
                <div className="col-md-4">
                  <div className="h-100 d-flex align-items-center justify-content-end">
                    <FaFileAlt size={55} color="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="comman-design">
            <div className="design-header">
              <h2 className="">Recent PDF</h2>
            </div>
            <div className="design-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Sr No.</th>
                      <th>PDF</th>
                      <th>User Limit</th>
                      <th>Ip Address</th>
                      <th>Expiry Time</th>
                      <th>Updated At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pdfs.length > 0 ? (
                      [...pdfs] // make a copy to avoid mutating original state
                        .sort(
                          (a, b) =>
                            new Date(b.updatedAt) - new Date(a.updatedAt)
                        ) // sort by most recent
                        .slice(0, 10) // take top 10
                        .map((item, index) => (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="d-flex justify-content-start ">
                                <div className="py-2 px-2 w-fit rounded bg-light">
                                  <FaFilePdf className="fs-4 text-dark" />
                                </div>
                              </div>
                            </td>
                            <td>{item.userLimit}</td>
                            <td>
                              {item.accessList && item.accessList.length > 0
                                ? item.accessList.map((entry, i) => (
                                    <div key={i}>{entry.deviceId}</div>
                                  ))
                                : "N/A"}
                            </td>
                            <td>
                              {new Date(item.expiryTime).toLocaleString()}
                            </td>
                            <td>{new Date(item.updatedAt).toLocaleString()}</td>
                            <td>
                              <div className="d-flex gap-2 justify-content-center">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleCopyLink(item._id)}
                                  title="Copy Link"
                                >
                                  <FaCopy />
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
      </div>
    </div>
  );
};

export default Dashboard;
