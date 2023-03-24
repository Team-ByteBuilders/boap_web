const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Register and login
const login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      {
        return res.status(400).json({ message: "incomplete data recieved :)" });
      }
    }
    if (phoneNumber.length != 10) {
      return res.status(400).json({ message: "invalid phone number :)" });
    }
    const oldUser = await User.findOne({ phoneNumber });
    if (oldUser) {
      return res.status(200).json({
        token: jwt.sign(
          oldUser._id.toString(),
          process.env.ACCESS_TOKEN_SECRET
        ),
        userID: oldUser._id.toString(),
        userUpi: oldUser.userUpi,
        email: oldUser.email,
        firstName: oldUser.firstName,
        lastName: oldUser.lastName,
        phoneNumber: oldUser.phoneNumber,
      });
    }

    //create new user
    if (!oldUser) {
      const user = await new User({
        phoneNumber,
        userUpi: `${phoneNumber}@boap`,
      });
      //save user to database and return response
      const newUser = await user.save();
      res.status(201).json({
        token: jwt.sign(user._id.toString(), process.env.ACCESS_TOKEN_SECRET),
        userID: newUser._id.toString(),
        userUpi: newUser.userUpi,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error occured :)",
      error: error.message,
    });
  }
};

module.exports = {
  login,
};
