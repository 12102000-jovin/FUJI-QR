import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode.react";
import axios from "axios";
import moment from "moment-timezone";
import "moment/locale/en-au";
import html2canvas from "html2canvas";
import JSZip from "jszip";

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
        const newQRCodes = response.data.map((code, index) => ({
          ...code,
          displayNumber: prevQRCodes.length + index + 1,
          pdcID: `PDC000${Number(startingNumber) + index}`,
        }));

        // Use the state updater callback to ensure that state is properly updated
        setImageData({});
        setNumberOfCodes(""); // Reset numberOfCodes to 0
        setStartingNumber("");

        return newQRCodes;
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

  const handleDownload = (pdcID) => {
    const a = document.createElement("a");
    a.href = imageData[pdcID];
    a.download = `PDCQR_${pdcID}.png`;
    a.click();
  };

  const handleDownloadAll = () => {
    const zip = new JSZip();

    Object.entries(imageData).forEach(([pdcID, dataUrl]) => {
      const imgData = dataUrl.split(",")[1];
      zip.file(`${pdcID}.png`, imgData, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "QRCodeImages.zip";
      a.click();
    });
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
        <button onClick={handleDownloadAll}> Download All </button>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {qrCodes.map((code, index) => (
            <div
              key={index}
              className="qrcode-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                margin: "10px",
                maxWidth: "300px",
                textAlign: "center",
              }}
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
                    style={{ display: "none", margin: "0 auto" }}
                  />
                  <button onClick={() => handleDownload(code.pdcID)}>
                    Download
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PDC_QRCode;
