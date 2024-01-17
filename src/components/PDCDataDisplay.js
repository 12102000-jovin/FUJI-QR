import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import moment from "moment";
import html2canvas from "html2canvas";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LaunchIcon from "@mui/icons-material/Launch";

const CustomQRCode = ({ value, text }) => (
  <div>
    <QRCode
      value={value}
      size="400"
      imageSettings={{
        src: "Images/FE-logo.png",
        excavate: true,
        width: 60,
        height: 35,
      }}
    />
    <p style={{ textAlign: "center" }}>{text}</p>
  </div>
);

const PDCDataDisplay = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState({});

  const [qrCodeData, setQrCodeData] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const captureRef = useRef(null);
  const [modalPdcID, setModalPdcID] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:3001/api/qrcodes/getAllQRCodes")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const showQRCodes = (data, row) => {
    setQrCodeData(data.link);
    setModalPdcID(extractIdFromLink(data.link));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLinks = (link) => {
    window.location.href = link;
  };

  const extractIdFromLink = (link) => {
    const match = link.match(/id=PDC(\d+)/);
    return match ? `PDC${match[1]}` : null;
  };

  const captureImage = (pdcID) => {
    html2canvas(captureRef.current)
      .then((canvas) => {
        // Convert canvas to data URL
        const imgData = canvas.toDataURL("image/png");

        // Generate a unique filename
        const fileName = `PDCQR_${pdcID}.png`;

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
    <Paper style={{ margin: "32px" }}>
      <TableContainer>
        <Table>
          <TableHead style={{ backgroundColor: "#043f9d" }}>
            <TableCell style={{ width: "50%", color: "white" }}>Link</TableCell>
            <TableCell style={{ width: "10%", color: "white" }}>PDC</TableCell>
            <TableCell style={{ width: "20%", color: "white" }}>
              Generated Date{" "}
            </TableCell>
            <TableCell style={{ width: "20%", color: "white" }}>
              Action
            </TableCell>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    {editMode === row._id ? (
                      <TextField
                        value={editedData.link}
                        // onChange={(e) => handleInputChange(e, "link")}
                      />
                    ) : (
                      row.link
                    )}
                  </TableCell>

                  <TableCell>{extractIdFromLink(row.link)}</TableCell>
                  <TableCell>
                    {moment(row.generatedDate)
                      .tz("Australia/Sydney")
                      .format("DD MMMM YYYY")}
                    <br />
                    {moment(row.generatedDate)
                      .tz("Australia/Sydney")
                      .format("h:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {editMode === row._id ? (
                      <>
                        <IconButton
                          aria-label="save"
                          size="small"
                          style={{ color: "green" }}
                          //   onClick={() => handleSave(row._id)}
                        >
                          <Button variant="contained" fontSize="small">
                            Save
                          </Button>
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          style={{ color: "red" }}
                          //   onClick={() => handleDelete(row._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="icon"
                          size="small"
                          style={{ color: "black" }}
                          //   onClick={() => handleEdit(row._id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="QR"
                          size="small"
                          style={{ color: "navy" }}
                          onClick={() => showQRCodes(row)}
                        >
                          <QrCodeIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="links"
                          size="small"
                          style={{ color: "smokewhite" }}
                          onClick={() => handleLinks(row.link)}
                        >
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
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
                  text: "QR Code",
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
                {qrCodeData ? extractIdFromLink(qrCodeData) : "N/A"}{" "}
              </p>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => captureImage(modalPdcID)}>Download</Button>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </Paper>
  );
};

export default PDCDataDisplay;
