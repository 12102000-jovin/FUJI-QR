const QRCodeWithID = ({ code, imageData }) => {
  return (
    <div className="qrcode-container">
      <p>{/* Any additional text you want to add */}</p>
      <div
        style={{
          color: "#043f9d",
          fontFamily: "Avenir, sans-serif",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {code.pdcID}
      </div>
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
      {imageData[code.pdcID] && (
        <div>
          <img
            src={imageData[code.pdcID]}
            alt={`Converted ${code.pdcID}`}
            style={{ display: "block", margin: "0 auto", width: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default QRCodeWithID;
