import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:3001/api/getAll")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/api/delete/${id}`)
      .then((response) => {
        console.log(`Record with id ${id} deleted successfully`);
        // Refresh data after deletion
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting record:", error);
      });
  };

  const handleEdit = (id) => {
    setEditMode(id);
    // Find the data item being edited and store it in editedData state
    const itemToEdit = data.find((item) => item._id === id);
    setEditedData(itemToEdit);
  };

  const handleSave = (id) => {
    // Send a PATCH or PUT request to update the data on the server
    axios
      .patch(`http://localhost:3001/api/update/${id}`, editedData)
      .then((response) => {
        console.log(`Record with id ${id} updated successfully`);
        // Exit edit mode and refresh data after saving
        setEditMode(null);
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating record:", error);
      });
  };

  const handleInputChange = (e, key) => {
    // Use the functional form of setEditedData to ensure synchronous updates
    setEditedData((prevEditedData) => ({
      ...prevEditedData,
      [key]: e.target.value,
    }));
  };

  return (
    <Paper style={{ margin: "32px" }}>
      <TableContainer>
        <Table>
          <TableHead style={{ backgroundColor: "#043f9d" }}>
            <TableRow>
              <TableCell style={{ width: "50%", color: "white" }}>
                Name
              </TableCell>
              <TableCell style={{ width: "30%", color: "white" }}>
                Age
              </TableCell>
              <TableCell style={{ width: "20%", color: "white" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    {editMode === row._id ? (
                      <TextField
                        value={editedData.name}
                        onChange={(e) => handleInputChange(e, "name")}
                      />
                    ) : (
                      row.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode === row._id ? (
                      <TextField
                        value={editedData.age}
                        onChange={(e) => handleInputChange(e, "age")}
                      />
                    ) : (
                      row.age
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode === row._id ? (
                      <>
                        <IconButton
                          aria-label="save"
                          size="small"
                          style={{ color: "green" }}
                          onClick={() => handleSave(row._id)}
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
                          onClick={() => handleDelete(row._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="icon"
                          size="small"
                          style={{ color: "black" }}
                          onClick={() => handleEdit(row._id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataDisplay;
