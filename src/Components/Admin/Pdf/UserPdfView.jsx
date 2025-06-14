import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { showAlert } from "../../utils/ShowAlert";
import { getDeviceId } from "../../utils/deviceId";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const UserPdfView = () => {
  const hasRun = useRef(false);
  const { pdfid } = useParams();
  const [pdfFileUrl, setPdfFileUrl] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suspicious, setSuspicious] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const getIpAddress = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL_API}/pdf/ip`);
    return res.data.ip;
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const checkAccess = async () => {
      try {
        setLoading(true);

        const ipRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL_API}/pdf/ip`
        );
        const ip = ipRes.data.ip;
        const deviceId = getDeviceId();

        console.log("Using IP:", ip);
        console.log("Device ID:", deviceId);

        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL_API}/pdf/view-one/${pdfid}`
        );
        const currentPdf = res.data.data;

        if (!currentPdf) {
          showAlert("error", "PDF not found");
          setLoading(false);
          return;
        }

        const accessedDevices = currentPdf.accessList || [];
        const userLimit = currentPdf.userLimit;
        const userExpiryDate = new Date(currentPdf.expiryTime).toLocaleString(
          "en-IN",
          {
            timeZone: "Asia/Kolkata",
            hour12: true,
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        const expiryDateUTC = new Date(currentPdf.expiryTime);
        const now = new Date();

        // Compare now with expiry
        if (now > expiryDateUTC) {
          setIsExpired(true);
          setLoading(false);
          return;
        }

        const alreadyAccessed = accessedDevices.some(
          (entry) => entry.deviceId === deviceId
        );

        if (!alreadyAccessed) {
          if (accessedDevices.length >= userLimit) {
            setBlocked(true);
            showAlert("error", "User limit exceeded. Access denied.");
            setLoading(false);
            return;
          }

          await axios.put(
            `${import.meta.env.VITE_BASE_URL_API}/pdf/add-ip/${pdfid}`,
            { ip, deviceId }
          );
        }

        const fullPdfUrl = `${import.meta.env.VITE_BASE_URL}public${
          currentPdf.filePath
        }`;
        setPdfFileUrl(fullPdfUrl);
        setLoading(false);
      } catch (err) {
        console.error("Access check failed:", err);
        showAlert("error", err.response?.data?.message || "Access error");
        setLoading(false);
      }
    };

    checkAccess();
  }, [pdfid]);

  // --- BLOCK SUSPICIOUS BEHAVIOR ---
  useEffect(() => {
    const blurContent = () => {
      document.body.style.filter = "blur(10px)";
    };

    const unblurContent = () => {
      document.body.style.filter = "none";
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setSuspicious(true);
        blurContent();
      } else {
        setSuspicious(false);
        unblurContent();
      }
    };

    const handleBlur = () => {
      setSuspicious(true);
      blurContent();
      // alert("Window focus lost. Access temporarily blocked.");
    };

    const handleFocus = () => {
      setSuspicious(false);
      unblurContent();
    };

    const handleKeyDown = (e) => {
      const blockedKeys = [
        "F12",
        "PrintScreen",
        "Control",
        "Alt",
        "Shift",
        "Meta",
        "Escape",
        "Tab",
        "CapsLock",
        "Insert",
        "Delete",
        "Home",
        "End",
        "PageUp",
        "PageDown",
        "window",
      ];

      if (
        blockedKeys.includes(e.key) ||
        (e.ctrlKey &&
          ["p", "s", "c", "x", "u", "a", "v"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        setSuspicious(true);
        blurContent();
        // alert("This key is blocked for security reasons.");
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "PrintScreen") {
        setSuspicious(true);
        blurContent();
        // alert("Screenshot attempt detected. Access temporarily blocked.");
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const disableCopy = (e) => {
      e.preventDefault();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", disableCopy);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", disableCopy);
    };
  },
   []);

  if (blocked) {
    return (
      <div className="no-internet-wrap">
        <div className="no-internet-box">
          <img src="/images/Dinosaur.png" alt="Dino" className="dino-img" />
          <h3 className="no-internet-title">User Limit Exceeded</h3>

          <p className="no-internet-tips">
            This PDF access Limit Exceeded no longer visible.
            <br />
            <strong>Please try one of the following:</strong>
            <ul>
              <li>Contact the admin to request a new access link</li>
              <li>Ensure you're using the most recent shared link</li>
            </ul>
          </p>

          <p className="error-code">ERR_LINK_EXPIRED</p>

          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            CHECK AGAIN LATER
          </button>

          <p className="notify-msg">
            This link was time-limited and user limited for security reasons.
            <br />
            If you believe this is an error, please{" "}
            <span className="cancel-text">contact support</span>.
          </p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="no-internet-wrap">
        <div className="no-internet-box">
          <img src="/images/Dinosaur.png" alt="Dino" className="dino-img" />
          <h1 className="no-internet-title">Link Expired</h1>

          <p className="no-internet-tips">
            This PDF access link has expired and is no longer available.
            <br />
            <strong>Please try one of the following:</strong>
            <ul>
              <li>Contact the admin to request a new access link</li>
              <li>Ensure you're using the most recent shared link</li>
            </ul>
          </p>

          <p className="error-code">ERR_LINK_EXPIRED</p>

          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            CHECK AGAIN LATER
          </button>

          <p className="notify-msg">
            This link was time-limited for security reasons.
            <br />
            If you believe this is an error, please{" "}
            <span className="cancel-text">contact support</span>.
          </p>
        </div>
      </div>
    );
  }

  if (!pdfFileUrl) {
    return null;
  }

  return (
    <>
      {/* Your PDF Viewer code here */}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
        <Viewer fileUrl={pdfFileUrl} />
      </Worker>

      {/* Suspicious modal */}
      {suspicious && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "black",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            zIndex: "9999",
          }}
        >
          <h1>Activity Blocked</h1>
          <p>
            Your actions were suspicious. Please refresh or contact support.
          </p>
        </div>
      )}
    </>
  );
};

export default UserPdfView;
