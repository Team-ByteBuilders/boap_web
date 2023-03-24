const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
  {
    shopUpi: {
      type: String,
      require: true,
      min: [3, "upi should contain at least three characters!"],
      max: 20,
      unique: true,
      trim: true,
    },
    lat: {
      type: String,
      max: 10,
      default: "",
      trim: true,
    },
    lon: {
      type: String,
      max: 10,
      default: "",
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", UserSchema);
