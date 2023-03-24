const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      min: [3, "username should contain at least three characters!"],
      max: 20,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      min: [6, "password should contain at least six characters!"],
    },
    email: {
      type: String,
      required: true,
      max: 50,
      min: [4, "email should contain at least 4 characters!"],
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      max: 10,
      min: [10, "phone should contain at least 10 characters!"],
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
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
