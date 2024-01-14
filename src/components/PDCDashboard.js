import React, { useState, useEffect } from "react";
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

const PDCDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customId = searchParams.get("id");
  const [subAssemblyName, setSubAssemblyName] = useState("");
  const [subAssemblies, setSubAssemblies] = useState([]);

  const [qrCodeData, setQrCodeData] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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

  const showQrCodes = (link) => {
    setQrCodeData(link);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLinks = (link) => {
    window.location.href = link;
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
                        onClick={() => showQrCodes(subAssembly.link)}
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
              </DialogContent>
              <DialogActions>
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
