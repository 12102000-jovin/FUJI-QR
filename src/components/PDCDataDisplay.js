import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import moment from "moment";

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
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

const PDCDataDisplay = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState({});

  const [qrCodeData, setQrCodeData] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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

  const showQRCodes = (data) => {
    setQrCodeData(data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLinks = (link) => {
    window.location.href = link;
  };

  return (
    <Paper style={{ margin: "32px" }}>
      <TableContainer>
        <Table>
          <TableHead style={{ backgroundColor: "#043f9d" }}>
            <TableCell style={{ width: "60%", color: "white" }}>Link</TableCell>
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
                          onClick={() => showQRCodes(row.link)}
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
                        <IconButton
                          aria-label="Sub-Assembly"
                          size="small"
                          style={{ color: "lightblue" }}
                        >
                          <LibraryAddIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>QR Code</DialogTitle>
          <DialogContent>
            <QRCode value={qrCodeData} />
          </DialogContent>
          <DialogActions>
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
