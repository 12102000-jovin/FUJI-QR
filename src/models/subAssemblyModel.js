const mongoose = require("mongoose");

const subAssemblySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    unique: true,
  },
  components: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Component",
    },
  ],
});

// Manually create the unique index on the "link" field
subAssemblySchema.index({ link: 1 }, { unique: true });

const SubAssemblyModel = mongoose.model("SubAssembly", subAssemblySchema);

module.exports = SubAssemblyModel;
