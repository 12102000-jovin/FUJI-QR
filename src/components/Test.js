import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

const Test = () => {
  const canvasRef = useRef(null);
  const [combinedImageUrl, setCombinedImageUrl] = useState(null);

  useEffect(() => {
    const image1 = new Image();
    image1.src = "Images/qrcode.png";

    const image2 = new Image();
    image2.src = "Images/download.png";

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    Promise.all([loadImage(image1), loadImage(image2)])
      .then((images) => {
        const maxWidth = Math.max(images[0].width, images[1].width);
        const maxHeight = Math.max(images[0].height, images[1].height);

        // Make the width and height equal to create a square for both images
        const squareSize = Math.max(maxWidth, maxHeight);

        canvas.width = squareSize;
        canvas.height = squareSize * 1.1;

        // Draw the first image with a square aspect ratio
        ctx.drawImage(images[0], 0, 0, squareSize, squareSize);

        // Draw the second image with its original width below the first image
        const scaleFactor = squareSize / images[1].width;
        const newWidth = images[1].width * scaleFactor;
        const newHeight = images[1].height * scaleFactor;
        ctx.drawImage(images[1], 0, squareSize, newWidth, newHeight);

        // Convert canvas content to data URL
        const dataUrl = canvas.toDataURL("image/png");
        setCombinedImageUrl(dataUrl);
      })
      .catch((error) => console.error("Error loading images:", error));
  }, []);

  const loadImage = (image) => {
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
    });
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = combinedImageUrl;
    link.download = "combined_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const textInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  const convertToImage = () => {
    const textInput = textInputRef.current;

    html2canvas(textInput).then((canvas) => {
      const dataUrl = canvas.toDataURL("image/png");
      setImageSrc(dataUrl);
    });
  };

  return (
    <>
      <div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <h2>Combined Images</h2>
        {combinedImageUrl && (
          <>
            <img src={combinedImageUrl} alt="Combined Image" width="30%" />
            <br />
            <button onClick={downloadImage}>Download Combined Image</button>
          </>
        )}
      </div>
      <div>
        <textarea
          ref={textInputRef}
          rows="4"
          cols="25"
          placeholder="Enter text here"
          style={{
            height: "20px",
            textAlign: "center",
            color: "#043f9d",
            fontFamily: "Arial, sans-serif",
            fontSize: "20px", // Change the font size to make it bigger
            fontWeight: "bold", // Add this to make it bold
            padding: "10px",
            border: 0,
          }}
        />
        <br />
        <button onClick={convertToImage}>Convert to Image</button>

        {imageSrc && (
          <div>
            <p>Converted Image:</p>
            <img
              src={imageSrc}
              alt="Converted"
              style={{ display: "block", margin: "0 auto" }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Test;
