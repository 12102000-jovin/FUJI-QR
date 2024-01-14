import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode.react";
import axios from "axios";
import moment from "moment-timezone";
import "moment/locale/en-au";
import html2canvas from "html2canvas";

const PDC_QRCode = () => {
  const [numberOfCodes, setNumberOfCodes] = useState(1);
  const [startingNumber, setStartingNumber] = useState(1);
  const [qrCodes, setQRCodes] = useState([]);
  const [imageData, setImageData] = useState({});

  useEffect(() => {
    setImageData({});
  }, [numberOfCodes, startingNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const links = Array.from({ length: numberOfCodes }, (_, index) => ({
      link: `http://localhost:3000/PDC-Dashboard?id=PDC000${
        Number(startingNumber) + index
      }`,
      generatedDate: moment()
        .tz("Australia/Sydney")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    try {
      const response = await axios.post(
        "http://localhost:3001/api/qrcodes/generateQRCodes",
        {
          links,
        }
      );

      setQRCodes((prevQRCodes) => {
        setImageData({});
        return response.data.map((code, index) => ({
          ...code,
          displayNumber: prevQRCodes.length + index + 1,
          pdcID: `PDC000${Number(startingNumber) + index}`,
        }));
      });
    } catch (error) {
      console.error("Error saving QR codes:", error);
    }
  };

  const generateImage = (pdcID, ref, canvasWidth) => {
    if (ref && pdcID && !imageData[pdcID]) {
      const options = {
        width: canvasWidth, // Set the width of the canvas
      };

      html2canvas(ref, options).then((canvas) => {
        const dataUrl = canvas.toDataURL("image/png");
        setImageData((prevImageData) => ({
          ...prevImageData,
          [pdcID]: dataUrl,
        }));
      });
    }
  };

  return (
    <div>
      <h2>Generate PDC QR Code</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Number of QR Codes:
          <input
            type="number"
            min="1"
            value={numberOfCodes}
            onChange={(e) => setNumberOfCodes(e.target.value)}
          />
        </label>

        <br />
        <br />

        <label>
          Starting PDC ID:
          <input
            type="number"
            min="1"
            value={startingNumber}
            onChange={(e) => setStartingNumber(e.target.value)}
          />
        </label>
        <br />
        <br />
        <input type="submit" value="Generate QR Codes" />
      </form>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>Generated QR Codes:</h3>
        {qrCodes.map((code, index) => (
          <div
            key={index}
            className="qrcode-container"
            style={{ width: "fit-content" }}
          >
            <div
              ref={(ref) => generateImage(code.pdcID, ref)}
              style={{
                color: "#043f9d",
                fontFamily: "Avenir, sans-serif",
                fontSize: "20px",
                fontWeight: "bold",
                textAlign: "center", // Center the text
              }}
            >
              <div>
                <QRCode
                  value={code.link}
                  size={256}
                  imageSettings={{
                    src: "Images/FE-logo.png",
                    excavate: true,
                    width: 60,
                    height: 35,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ margin: 0 }}>{code.pdcID}</p>
              </div>
            </div>
            {imageData[code.pdcID] && (
              <div style={{ textAlign: "center" }}>
                <img
                  src={imageData[code.pdcID]}
                  alt={`Converted ${code.pdcID}`}
                  style={{ display: "block", margin: "0 auto" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDC_QRCode;
