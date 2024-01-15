import React, { useState, useRef } from "react";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";

const Home = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [type, setType] = useState("");
  const [qrCodeData, setQRCodeData] = useState(null);
  const qrCodeRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if both fields are filled
    if (serialNumber.trim() === "" || type.trim() === "") {
      alert("Please fill in all fields before generating the QR code.");
      return;
    }

    // Create a JSON object with the form data
    const formData = {
      serialNumber,
      type,
    };

    // Convert the JSON object to a string
    const jsonData = JSON.stringify(formData);

    // Update state with the JSON data
    setQRCodeData(jsonData);
  };

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      // Use html2canvas to convert the QR code with image to a canvas
      html2canvas(qrCodeRef.current).then((canvas) => {
        // Convert canvas to image data URL
        const dataUrl = canvas.toDataURL("image/png");

        // Create a link element and trigger a download
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qrCode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  return (
    <div>
      <h2>Home</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Serial Number:
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </label>
        <br />
        <br />
        <label>
          Type:
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </label>
        <br />
        <br />
        <input type="submit" />
      </form>

      {qrCodeData && (
        <div>
          <h3>QR Code:</h3>
          <div ref={qrCodeRef}>
            <QRCode
              value={qrCodeData}
              size={256}
              imageSettings={{
                src: "Images/FE-logo.png",
                excavate: true,
                width: 60,
                height: 35,
              }}
            />
          </div>
          <br />
          <button onClick={downloadQRCode}>Download QR Code</button>
        </div>
      )}
    </div>
  );
};

export default Home;
