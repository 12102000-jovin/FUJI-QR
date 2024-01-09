const express = require("express");
const QRCodeModel = require("../models/qrCodeModel");
const subAssemblyModel = require("../models/subAssemblyModel");

const router = express.Router();
const moment = require("moment-timezone");

// Post Method for creating multiple QR codes
router.post("/generateQRCodes", async (req, res) => {
  const links = req.body.links.map((link) => ({
    link: link.link, // Use the link value from the client
    generatedDate: moment.tz(link.generatedDate, "Australia/Sydney").format(),
  }));

  try {
    // Save QR codes to MongoDB
    const savedQRCodes = await QRCodeModel.insertMany(links);
    res.status(200).json(savedQRCodes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All QR Codes
router.get("/getAllQRCodes", async (req, res) => {
  try {
    const qrcodes = await QRCodeModel.find();
    res.json(qrcodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete All QR Codes
router.delete("/deleteAllQRCodes", async (req, res) => {
  try {
    // Delete all QR codes from MongoDB
    await QRCodeModel.deleteMany({});
    res.status(200).json({ message: "All QR codes deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
