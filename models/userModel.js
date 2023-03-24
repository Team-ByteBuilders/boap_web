const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userUpi: {
      type: String,
      require: true,
      min: [3, "upi should contain at least three characters!"],
      max: 20,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      // required: true,
      max: 50,
      default: "",
      min: [4, "email should contain at least 4 characters!"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      max: 10,
      min: [10, "phone should contain at least 10 characters!"],
      trim: true,
    },
    firstName: {
      type: String,
      default: "",
      // required: true,
      trim: true,
    },
    lastName: {
      default: "",
      type: String,
      // required: true,
      trim: true,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
