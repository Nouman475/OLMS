import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css"; // Custom CSS for certificate styling

export default function Certificate({ courseName, studentName }) {
  const [signatureLoaded, setSignatureLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const img = new Image();
    img.src =
      "https://img.freepik.com/premium-vector/abstract-fake-signature-documents-contracts-isolated-white-background_608189-1150.jpg?semt=ais_hybrid";
    img.onload = () => setSignatureLoaded(true);
    img.onerror = () => setSignatureLoaded(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  console.log(windowWidth);
  const handleDownload = () => {
    const certificate = document.getElementById("certificate");
    html2canvas(certificate, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      let pdf = null;
      if (windowWidth <= 400) {
        window.toastify("for a better layout please use a laptop for downloading the certificate")
        return
      } else {
        pdf = new jsPDF("landscape", "px", [800, 450]); // Define custom dimensions
      }
      pdf.addImage(imgData, "PNG", 0, 0, 800, 450); // Use the defined dimensions
      pdf.save(`${studentName}_Certificate.pdf`);
    });
  };

  return (
    <div className="container mt-5">
      <h3 id="cong">Congrats for your Certificate</h3>
      <div id="certificate" className="certificate-container p-5">
        <div className="text-center">
          <h1 className="certificate-title">Certificate of Completion</h1>
          <p className="certificate-body mt-4">
            <i>This certifies that</i>
          </p>
          <h2 className="student-name mt-3">{studentName}</h2>
          <p className="certificate-body mt-3">
            <i>has successfully completed the course</i>
          </p>
          <h3 className="course-name mt-3">{courseName}</h3>
          <p className="certificate-body mt-4">
            Date: {new Date().toLocaleDateString()}
          </p>
          <p className="certificate-body">Instructor: Umair Ahmed</p>
          <div className="signature mt-5">
            <img
              src="https://img.freepik.com/premium-vector/abstract-fake-signature-documents-contracts-isolated-white-background_608189-1150.jpg?semt=ais_hybrid"
              alt="Institute Signature"
              className="signature-img"
              style={{ display: signatureLoaded ? "block" : "none" }}
            />
            <p className="signature-text">OLMS</p>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          className="mt-4"
          disabled={!signatureLoaded}
        >
          Download Certificate
        </Button>
      </div>
    </div>
  );
}
