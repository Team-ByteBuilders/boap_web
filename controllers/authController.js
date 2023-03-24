const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Register
const register = async (req, res) => {
  try {
    const { userName, password, email } = req.body;

    if (
      !userName ||
      !password ||
      !email ||
      !req.body.firstName ||
      !req.body.lastName
    ) {
      return res.status(400).json({ message: "incomplete data recieved :)" });
    }
    if (userName.length < 3) {
      return res
        .status(400)
        .json({ message: "minimum 3 charectors required for username :)" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "minimum 6 charectors required for password :)" });
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,6})+$/.test(email)) {
      return res.status(400).json({ message: "enter valid email :)" });
    }
    const oldUser = await User.findOne({ userName });
    if (oldUser)
      return res.status(208).json({ message: "username already taken" });

    const firstName =
      req.body.firstName.charAt(0).toUpperCase() +
      req.body.firstName.slice(1).toLowerCase();
    const lastName =
      req.body.lastName.charAt(0).toUpperCase() +
      req.body.lastName.slice(1).toLowerCase();

    //generate password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = await new User({
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
    });

    //save user to database and return response
    const user = await newUser.save();
    res.status(201).json({
      token: jwt.sign(user._id.toString(), process.env.ACCESS_TOKEN_SECRET),
      userID: user._id.toString(),
      userName: user.userName,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureUrl: user.profilePictureUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error occured :)",
      error: error.message,
    });
  }
};

//login
const login = async (req, res) => {
  try {
    const { userName, password, email } = req.body;

    if ((!userName && !email) || !password) {
      return res.status(400).json({ message: "incomplete data recieved :)" });
    }
    const user = email
      ? await User.findOne({ email: email.toLowerCase() })
      : await User.findOne({ userName: userName.toLowerCase() });
    if (!user) {
      !user && res.status(401).json({ message: "invalid credentials" });
    } else {
      const validPassword = await bcrypt.compare(password, user.password);
      !validPassword
        ? res.status(401).json({ message: "invalid credentials" })
        : res.status(200).json({
            token: jwt.sign(
              user._id.toString(),
              process.env.ACCESS_TOKEN_SECRET
            ),
            userID: user._id.toString(),
            userName: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePictureUrl: user.profilePictureUrl,
          });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error occured :)",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  // is wale ko abi banana h
  try {
    const { email, password, newpassword } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    const verified = await bcrypt.compare(password, user.password);
    if (verified) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newpassword, salt);
      const newPassword = await User.findByIdAndUpdate(
        user._id,
        { password: hashed },
        { new: true }
      );
      res.json(newPassword);
    } else {
      throw new Error("Wrong Password");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
};

module.exports = {
  register,
  login,
  resetPassword,
};
