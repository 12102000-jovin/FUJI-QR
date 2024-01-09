import React, { useState } from "react";
import QRCode from "qrcode.react";
import axios from "axios";

import moment from "moment-timezone";
import "moment/locale/en-au";

const PDC_QRCode = () => {
  const [numberOfCodes, setNumberOfCodes] = useState(1);
  const [startingNumber, setStartingNumber] = useState(1);
  const [qrCodes, setQRCodes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate an array with sequential links starting from the user-input starting number
    const links = Array.from({ length: numberOfCodes }, (_, index) => ({
      link: `http://localhost:3000/PDC-Dashboard?id=PDC000${
        Number(startingNumber) + index
      }`,
      generatedDate: moment()
        .tz("Australia/Sydney")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    try {
      // Save QR codes to the server
      const response = await axios.post(
        "http://localhost:3001/api/qrcodes/generateQRCodes",
        {
          links,
        }
      );

      // Update the state with the updated links
      setQRCodes((prevQRCodes) =>
        response.data.map((code, index) => ({
          ...code,
          displayNumber: prevQRCodes.length + index + 1,
        }))
      );
    } catch (error) {
      console.error("Error saving QR codes:", error);
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

      <div>
        <h3>Generated QR Codes:</h3>
        {qrCodes.map((code, index) => (
          <div key={index} className="qrcode-container">
            <p>Link {Number(startingNumber) + index}:</p>
            <QRCode value={code.link} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDC_QRCode;
