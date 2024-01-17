import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LaunchIcon from "@mui/icons-material/Launch";
import html2canvas from "html2canvas";

const PDCDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customId = searchParams.get("id");
  const [subAssemblyName, setSubAssemblyName] = useState("");
  const [subAssemblies, setSubAssemblies] = useState([]);

  const [qrCodeData, setQrCodeData] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const captureRef = useRef(null);

  useEffect(() => {
    // Fetch sub-assemblies for the PDC based on the custom ID
    const fetchSubAssemblies = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/subAssembly/pdc/${customId}/getSubAssembly`
        );

        setSubAssemblies(response.data);
      } catch (error) {
        console.error(
          "Error fetching sub-assemblies:",
          error.response ? error.response.data.message : error.message
        );
      }
    };

    fetchSubAssemblies();
  }, [customId]);

  const handleSubAssemblySubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/subAssembly/pdc/${customId}/add-subassembly`,
        {
          name: subAssemblyName,
          link: `http://localhost:3000/subAssemblyDashboard?id=${customId}&subAssemblyName=${subAssemblyName}`,
        }
      );

      // Sub-assembly added successfully
      // You can handle the response or update the UI as needed
      console.log("Sub-assembly added:", response.data);

      // Fetch updated sub-assemblies after adding a new one
      const updatedResponse = await axios.get(
        `http://localhost:3001/api/subAssembly/pdc/${customId}/getSubAssembly`
      );
      setSubAssemblies(updatedResponse.data);
    } catch (error) {
      // Handle error cases
      console.error(
        "Error:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const showQrCodes = (link, name) => {
    setSubAssemblyName(name);
    setQrCodeData(link);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLinks = (link) => {
    window.location.href = link;
  };

  const captureImage = () => {
    html2canvas(captureRef.current)
      .then((canvas) => {
        // Convert canvas to data URL
        const imgData = canvas.toDataURL("image/png");

        // Generate a unique filename
        const fileName = `SubAssemblyQR_${customId}_${subAssemblyName}.png`;

        // Create a download link with the specified filename
        const a = document.createElement("a");
        a.href = imgData;
        a.download = fileName;
        a.click();
      })
      .catch((error) => {
        console.error("Error capturing image:", error);
      });
  };

  return (
    <div>
      <h2>PDC Dashboard</h2>
      <p>
        <strong>ID from URL:</strong> {customId}
      </p>
      <p>
        <strong>Generate Sub-Assembly QR Code Here</strong>
      </p>
      <form>
        <label>
          Sub-Assembly Name:
          <input
            type="text"
            value={subAssemblyName}
            onChange={(e) => setSubAssemblyName(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleSubAssemblySubmit}>
          Generate Sub-Assembly
        </button>
      </form>
      <br />
      <br /> <br />
      <br />
      <div>
        <h3>Sub-Assemblies for {customId}</h3>
        <Paper style={{ margin: "32px" }}>
          <TableContainer>
            <Table>
              <TableHead style={{ backgroundColor: "#043f9d" }}>
                <TableRow>
                  <TableCell style={{ width: "35%", color: "white" }}>
                    Sub-Assembly Name
                  </TableCell>
                  <TableCell style={{ width: "35%", color: "white" }}>
                    Link
                  </TableCell>
                  <TableCell style={{ width: "30%", color: "white" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subAssemblies.map((subAssembly) => (
                  <TableRow key={subAssembly._id}>
                    <TableCell>{subAssembly.name}</TableCell>
                    <TableCell>{subAssembly.link}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="QR"
                        size="small"
                        style={{ color: "navy" }}
                        onClick={() =>
                          showQrCodes(subAssembly.link, subAssembly.name)
                        }
                      >
                        {" "}
                        <QrCodeIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="links"
                        size="small"
                        style={{ color: "smokewhite" }}
                        onClick={() => handleLinks(subAssembly.link)}
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog open={openModal} onClose={handleCloseModal}>
              <DialogTitle style={{ textAlign: "center" }}>
                <strong>QR Code</strong>
              </DialogTitle>
              <DialogContent>
                <div ref={captureRef}>
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
                  <p
                    style={{
                      color: "#043f9d",
                      fontFamily: "Avenir, sans-serif",
                      fontSize: "20px",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginTop: "5px",
                    }}
                  >
                    {" "}
                    {
                      subAssemblies.find((sub) => sub.link === qrCodeData)?.name
                    }{" "}
                    - {customId}
                  </p>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => captureImage()}> Download </Button>
                <Button onClick={handleCloseModal} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default PDCDashboard;
