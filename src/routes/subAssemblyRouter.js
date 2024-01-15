const express = require("express");
const QRCodeModel = require("../models/qrCodeModel");
const subAssemblyModel = require("../models/subAssemblyModel");

const router = express.Router();

router.post("/generateSubAssembly", async (req, res) => {
  const subAssembly = new subAssemblyModel({
    name: req.body.name,
  });

  try {
    const subAssemblyToSave = await subAssembly.save();
    res.status(200).json(subAssemblyToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST method for adding SubAssembly to a specific PDC
router.post("/pdc/:customId/add-subassembly", async (req, res) => {
  const { customId } = req.params;
  const { name, link } = req.body;

  try {
    // Find the PDC by custom ID
    const pdc = await QRCodeModel.findOne({
      link: `http://localhost:3000/PDC-Dashboard?id=${customId}`,
    });

    if (!pdc) {
      return res.status(404).json({ message: "PDC not found" });
    }

    // Create a new SubAssembly
    const subAssembly = new subAssemblyModel({ name, link });
    const savedSubAssembly = await subAssembly.save();

    // Add the SubAssembly to the PDC
    pdc.subAssemblies.push(savedSubAssembly);
    await pdc.save();

    res.status(200).json(savedSubAssembly);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/pdc/:customId/getSubAssembly", async (req, res) => {
  const { customId } = req.params;

  try {
    // Find the PDC by custom ID
    const pdc = await QRCodeModel.findOne({
      link: `http://localhost:3000/PDC-Dashboard?id=${customId}`,
    });

    if (!pdc) {
      return res.status(404).json({ message: "PDC not found" });
    }

    // Retrieve the SubAssemblies for the PDC
    const subAssemblies = await subAssemblyModel.find({
      _id: { $in: pdc.subAssemblies },
    });

    res.status(200).json(subAssemblies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
