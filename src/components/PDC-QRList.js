import react from "react";
import PDCDataDisplay from "./PDCDataDisplay";
import axios from "axios";

const PDCQRList = () => {
  const deleteAll = () => {
    console.log("deleteAll");

    axios
      .delete("http://localhost:3001/api/qrcodes/deleteAllQRCodes")
      .then((response) => {
        console.log("All the data was deleted");
      })
      .catch((error) => {
        console.error("Error deleting files:", error);
      });
  };

  return (
    <div>
      <h2>PDC QR List</h2>
      <button onClick={() => deleteAll()}> Delete All Data</button>
      <PDCDataDisplay />
    </div>
  );
};

export default PDCQRList;
