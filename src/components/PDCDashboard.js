import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const PDCDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customId = searchParams.get("id");
  const [subAssemblyName, setSubAssemblyName] = useState("");
  const [subAssemblies, setSubAssemblies] = useState([]);

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

  return (
    <div>
      <h2>PDC Dashboard</h2>
      <p>ID from URL: {customId}</p>
      <p>Generate Sub-Assembly QR Code Here</p>
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
      <div>
        <h3>Sub-Assemblies for {customId}</h3>
        <Paper style={{ margin: "32px" }}>
          <TableContainer>
            <Table>
              <TableHead style={{ backgroundColor: "#043f9d" }}>
                <TableRow>
                  <TableCell style={{ width: "80%", color: "white" }}>
                    Sub-Assembly Name
                  </TableCell>
                  <TableCell style={{ width: "20%", color: "white" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subAssemblies.map((subAssembly) => (
                  <TableRow key={subAssembly._id}>
                    <TableCell>{subAssembly.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default PDCDashboard;
