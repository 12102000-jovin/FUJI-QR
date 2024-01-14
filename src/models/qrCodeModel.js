const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
    unique: true,
  },
  generatedDate: {
    type: String,
    required: true,
  },
  subAssemblies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAssembly",
      required: true,
    },
  ],
});

const QRCodeModel = mongoose.model("QRCode", qrCodeSchema);

module.exports = QRCodeModel;
