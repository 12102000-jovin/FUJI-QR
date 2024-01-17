const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema({
  componentName: {
    type: String,
    required: true,
  },

  serialNumber: {
    type: Number,
    required: true,
  },
});

const ComponentModel = mongoose.model("Component", componentSchema);

module.exports = ComponentModel;
