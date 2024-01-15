import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const SubAssemblyDashboard = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subAssemblyName = searchParams.get("subAssemblyName");
  const subAssemblyPDC = searchParams.get("id");

  const [formData, setFormData] = useState([]);
  // Other state variables as needed

  // Handle input changes
  const handleInputChange = (event) => {
    // Update the state based on the input changes
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the form submission (e.g., send data to the server)
  };

  return (
    <>
      <h2> Sub Assembly Dashboard</h2>
      <p>
        <strong>Sub Assembly Name: </strong> {subAssemblyName}
      </p>
      <p>
        <strong> PDC ID: </strong>
        {subAssemblyPDC}
      </p>

      <form onSubmit={handleSubmit}>
        {/* Render form fields and input components */}
        {/* e.g., product name, serial number, etc. */}
        {/* You can map through formData to dynamically render entries */}
        {formData.map((entry, index) => (
          <div key={index}>
            {/* Render input fields for each entry */}
            <input
              type="text"
              name={`productName-${index}`}
              value={entry.productName}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="Product Name"
            />
            {/* Add more input fields for other data */}
          </div>
        ))}

        {/* Add a button to add new entries */}
        <button type="button" onClick={() => setFormData([...formData, {}])}>
          Add Entry
        </button>

        {/* Submit button */}
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default SubAssemblyDashboard;
