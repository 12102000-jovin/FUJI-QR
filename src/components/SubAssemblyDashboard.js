import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
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

const SubAssemblyDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subAssemblyName = searchParams.get("subAssemblyName");
  const subAssemblyPDC = searchParams.get("id");

  const [components, setComponents] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [filteredComponents, setFilteredComponents] = useState([]);

  useEffect(() => {
    // Fetch components for the subAssembly based on the PDC ID and the subAssemblyName
    const fetchComponents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/component/pdc/${subAssemblyPDC}/subAssembly/${subAssemblyName}/getComponent`
        );

        setComponents(response.data);
      } catch (error) {
        console.error(
          "Error fetching components for subAssembly",
          error.response ? error.response.message : error.message
        );
      }
    };

    fetchComponents();
  }, [subAssemblyPDC]);

  useEffect(() => {
    const filterComponents = () => {
      const filtered = components.filter(
        (component) =>
          component.componentName
            .toLowerCase()
            .includes(searchInput.toLowerCase()) ||
          component.serialNumber.toString().includes(searchInput)
      );
      setFilteredComponents(filtered);
    };

    filterComponents();
  }, [components, searchInput]);

  const [formData, setFormData] = useState([
    { productName: "", serialNumber: "" },
  ]);

  // Handle input changes
  const handleInputChange = (event, index) => {
    const newFormData = [...formData];
    newFormData[index] = {
      ...newFormData[index],
      productName: event.target.value,
    };
    setFormData(newFormData);
  };

  const handleInputChangeSerialNumber = (event, index) => {
    const newFormData = [...formData];
    newFormData[index] = {
      ...newFormData[index],
      serialNumber: event.target.value,
    };
    setFormData(newFormData);
  };

  // Handle form submission
  const handleComponentSubmit = async (event) => {
    event.preventDefault();
    try {
      const responses = await Promise.all(
        formData.map(async (entry) => {
          return axios.post(
            `http://localhost:3001/api/component/pdc/${subAssemblyPDC}/subAssembly/${subAssemblyName}/add-component`,
            {
              componentName: entry.productName,
              serialNumber: entry.serialNumber,
            }
          );
        })
      );

      console.log(
        "Components added:",
        responses.map((response) => response.data)
      );

      const updatedResponse = await axios.get(
        `http://localhost:3001/api/component/pdc/${subAssemblyPDC}/subAssembly/${subAssemblyName}/getComponent`
      );
      setComponents(updatedResponse.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  // Handle entry deletion
  const handleDeleteEntry = (index) => {
    const newFormData = [...formData];
    newFormData.splice(index, 1);
    setFormData(newFormData);
  };

  return (
    <>
      <h2>Sub Assembly Dashboard</h2>
      <p>
        <strong>Sub Assembly Name: </strong> {subAssemblyName}
      </p>
      <p>
        <strong>PDC ID: </strong>
        {subAssemblyPDC}
      </p>

      <h3>Add component to Sub Assembly</h3>

      <form>
        {/* Render form fields and input components */}
        {formData.map((entry, index) => (
          <div key={index}>
            <div>
              <label htmlFor={`productName-${index}`}>
                Component {index + 1}:
              </label>
              <input
                type="text"
                name={`productName-${index}`}
                value={entry.productName}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Product Name"
                style={{ marginLeft: "8px" }}
              />

              <input
                type="text"
                name={`serialNumber-${index}`}
                value={entry.serialNumber}
                onChange={(e) => handleInputChangeSerialNumber(e, index)}
                placeholder="Serial Number"
                style={{ marginLeft: "8px" }}
              />

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleDeleteEntry(index)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </button>
              )}
            </div>
            <br />
          </div>
        ))}

        {/* Add a button to add new entries */}
        <button
          type="button"
          onClick={() =>
            setFormData([...formData, { productName: "", serialNumber: "" }])
          }
        >
          Add Entry
        </button>

        {/* Submit button */}
        <button type="submit" onClick={handleComponentSubmit}>
          Submit
        </button>
      </form>

      <br />
      <br />

      <div>
        <label htmlFor="search">Search Component:</label>
        <input
          type="text"
          id="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter component name"
        />
      </div>

      <div>
        <Paper style={{ margin: "32px" }}>
          <TableContainer>
            <Table>
              <TableHead style={{ backgroundColor: "#043f9d" }}>
                <TableRow>
                  <TableCell style={{ width: "35%", color: "white" }}>
                    Component Name
                  </TableCell>
                  <TableCell style={{ width: "35%", color: "white" }}>
                    Serial Number
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredComponents.map((component) => (
                  <TableRow key={component._id}>
                    <TableCell>{component.componentName}</TableCell>
                    <TableCell>{component.serialNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </>
  );
};

export default SubAssemblyDashboard;
