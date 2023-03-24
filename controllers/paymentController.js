const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Register and login
const sendPayment = async (req, res) => {
  try {
    const { upiId, amount } = req.body;

    if (!upiId) {
      {
        return res.status(400).json({ message: "incomplete data recieved :)" });
      }
    }
    const user = await User.findById(req.userID);
    const user2 = await User.findOne((userUpi = upiId));
    if (user.balance - amount < 0) {
      return res.status(400).json({ message: "insufficient balance :)" });
    }
    const sUser = await User.findByIdAndUpdate(req.userID, {
      balance: user.balance - amount,
    });
    await User.findOneAndUpdate((userUpi = upiId), {
      balance: user2.balance + amount,
    });
    return res.status(200).json({
      balance: sUser.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error occured :)",
      error: error.message,
    });
  }
};

module.exports = {
  sendPayment,
};
