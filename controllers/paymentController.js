const User = require("../models/userModel");
const Payment = require("../models/paymentModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Payment
const sendPayment = async (req, res) => {
  try {
    const { upiId, amount } = req.body;

    if (!upiId || !amount) {
      {
        return res.status(400).json({ message: "incomplete data recieved :)" });
      }
    }
    const user = await User.findById(req.userId);
    const user2 = await User.findOne({ userUpi: upiId });
    if (user.balance - amount < 0) {
      return res.status(400).json({ message: "insufficient balance :)" });
    }
    const sUser = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $set: {
          balance: user.balance - amount,
        },
        $push: {
          paymentHistory: {
            from: user.userUpi,
            to: upiId,
            amount: amount - 2 * amount,
          },
        },
      },
      { new: true }
    );
    const rUser = await User.findOneAndUpdate(
      { userUpi: upiId },
      {
        $set: {
          balance: user2.balance + amount,
        },
        $push: {
          paymentHistory: {
            from: user.userUpi,
            to: upiId,
            amount: amount,
          },
        },
      },
      { new: true }
    );

    const payment = await new Payment({
      from: user.upiId,
      to: user2.upiId,
      amount: amount,
    });
    //save user to database and return response
    const newPayment = await payment.save();
    return res.status(200).json({
      message: "Theek h bhai hogyi payment"
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error occured :)",
      error: error.message,
    });
  }
};
//split bill notification
const paymentReminder = async (req, res) => {
  try {
    const { myamount, amount, participants, upiId } = req.body;
    if (!myamount || !amount || !participants) {
      return res.status(400).json({ message: "enter all the inputs" });
    }
    const user = await User.findById(req.userId);
    console.log(user);
    const user2 = await User.findOne({ userUpi: upiId });
    if (user.balance - amount < 0) {
      return res.status(400).json({ message: "insufficient balance :)" });
    }
    const sUser = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $set: { balance: user.balance - amount },
        $push: {
          paymentHistory: {
            from: user.userUpi,
            to: upiId,
            amount: amount,
          },
          pendingSettlements: {
            from: user.userUpi,
            to: upiId,
            amount: amount,
            participants: participants,
          },
        },
      },
      { new: true }
    );
    const rUser = await User.findOneAndUpdate(
      { userUpi: upiId },
      {
        $set: {
          balance: user2.balance + amount,
        },
      }
    );
    const payment = await new Payment({
      from: user.userUpi,
      to: upiId,
      amount: amount,
    });
    //save user to database and return response
    const newPayment = await payment.save();
    return res.status(200).json({
      balance: user.balance - amount,
      newPayment,
      sUser,
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
  paymentReminder,
};
