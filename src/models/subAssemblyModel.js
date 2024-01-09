const mongoose = require("mongoose");

const subAssemblySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const SubAssemblyModel = mongoose.model("SubAssembly", subAssemblySchema);

module.exports = SubAssemblyModel;
