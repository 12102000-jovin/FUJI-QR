const express = require("express");
const QRCodeModel = require("../models/qrCodeModel");
const SubAssemblyModel = require("../models/subAssemblyModel");
const ComponentModel = require("../models/componentModel");

const router = express.Router();

router.post("/generateComponent", async (req, res) => {
  const component = new ComponentModel({
    name: req.body.name,
    serialNumber: req.body.serialNumber,
  });

  try {
    const componentToSave = await component.save();
    res.status(200).json(componentToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post(
  "/pdc/:subAssemblyPDC/subAssembly/:subAssemblyName/add-component",
  async (req, res) => {
    try {
      const { subAssemblyPDC, subAssemblyName } = req.params;
      const { componentName, serialNumber } = req.body;

      const pdc = await QRCodeModel.findOne({
        link: `http://localhost:3000/PDC-Dashboard?id=${subAssemblyPDC}`,
      });

      if (!pdc) {
        return res.status(404).json({ message: "PDC not found" });
      }

      const subAssembly = await SubAssemblyModel.findOne({
        name: subAssemblyName,
      });

      if (!subAssembly) {
        return res.status(404).json({ message: "SubAssembly not found" });
      }

      const component = new ComponentModel({ componentName, serialNumber });
      const savedComponent = await component.save();

      // Add the Component to the SubAssembly
      subAssembly.components.push(savedComponent._id);
      await subAssembly.save();

      res.status(200).json(savedComponent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  "/pdc/:subAssemblyPDC/subAssembly/:subAssemblyName/getComponent",
  async (req, res) => {
    try {
      const { subAssemblyPDC, subAssemblyName } = req.params;
      const { componentName, serialNumber } = req.body;

      console.log(subAssemblyPDC);

      const pdc = await QRCodeModel.findOne({
        link: `http://localhost:3000/PDC-Dashboard?id=${subAssemblyPDC}`,
      });

      if (!pdc) {
        return res.status(404).json({ message: "PDC not found" });
      }

      const subAssembly = await SubAssemblyModel.findOne({
        name: subAssemblyName,
      });

      if (!subAssembly) {
        return res.status(404).json({ message: "SubAssembly not found" });
      }

      const component = await ComponentModel.find({
        _id: { $in: subAssembly.components },
      });

      res.status(200).json(component);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
