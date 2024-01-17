require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
const app = express();

app.use(express.json());

app.use(cors());

app.listen(3001, () => {
  console.log(`Server Started at ${3001}`);
});

const routes = require("./src/routes/routes");

app.use("/api", routes);

const qrRoutes = require("./src/routes/qrCodeRouter");
app.use("/api/qrcodes", qrRoutes);

const subAssemblyRoutes = require("./src/routes/subAssemblyRouter");
app.use("/api/subAssembly", subAssemblyRoutes);

const componentRoutes = require("./src/routes/componentRouter");
app.use("/api/component", componentRoutes);
