import React, { useState } from "react";
import QRCode from "qrcode.react";

const CustomQRCode = ({ value, text, imageSrc }) => {
  const [canvas, setCanvas] = useState(null);

  const handleCanvasRef = (ref) => {
    if (ref) {
      setCanvas(ref);
      drawQRCode(ref, value, text, imageSrc);
    }
  };

  const drawQRCode = (canvas, value, text, imageSrc) => {
    const context = canvas.getContext("2d");

    // Draw QR code
    const qrCode = new Image();
    qrCode.src = QRCode.toDataURL(value, { width: 256 });
    qrCode.onload = () => {
      context.drawImage(qrCode, 0, 0, 256, 256);

      // Draw text
      context.fillStyle = "black";
      context.font = "16px Arial";
      context.textAlign = "center";
      context.fillText(text, 128, 220); // Adjust position as needed

      // Draw image
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        context.drawImage(img, 98, 170, 60, 35); // Adjust position and size as needed
      };
    };
  };

  return <canvas ref={handleCanvasRef} width={256} height={256} />;
};

export default CustomQRCode;
