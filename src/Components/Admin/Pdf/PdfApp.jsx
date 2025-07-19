import React from "react";
import { Link } from "react-router-dom";

const PdfApp = () => {
  return (
    <div>
      <div className="no-internet-wrap">
        <div className="no-internet-box">

          <Link to="https://play.google.com/store/apps/details?id=com.harshu_07.boltexponativewindow" target="_blank"
            className="btn btn-primary btn-lg"
          >
            CHECK AGAIN LATER
          </Link>

          <p className="notify-msg text-dark">
            Open Link PDF in App
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default PdfApp;
