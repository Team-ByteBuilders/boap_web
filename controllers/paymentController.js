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
    let sUser = await User.findByIdAndUpdate(req.userID, {
      balance: user.balance - amount,
      paymentHistory: [...user.paymentHistory, {
        from: user.upiId,
        to: upiId,
        amount: amount
      }]
    });
    const rUser = await User.findOneAndUpdate({ userUpi: upiId }, {
      balance: user2.balance + amount,
    });
    
    const payment = await new Payment({
      from: user.upiId,
      to: user2.upiId,
      amount: amount,
    });
    //save user to database and return response
    const newPayment = await payment.save();
    return res.status(200).json({
      balance: user.balance - amount,
      newPayment
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
      return res.status(400).json({ message: "enter all the inputs" })
    }
    const user = await User.findById(req.userID);
    const user2 = await User.findOne({ userUpi: upiId });
    if (user.balance - amount < 0) {
      return res.status(400).json({ message: "insufficient balance :)" });
    }
    let sUser = await User.findByIdAndUpdate(req.userID, {
      balance: user.balance - amount,
    });
    sUser = await User.findByIdAndUpdate(req.userID, {
      pendingSettlements: [
        ...sUser.pendingSettlements,
        {
          from: sUser.upiId,
          to: upiId,
          amount: amount,
          participants: participants,
        },
      ],

      paymentHistory: [
        ...sUser.paymentHistory,
        {
          from: sUser.upiId,
          to: upiId,
          amount: amount,
        },
      ],
    });
    const rUser = await User.findOneAndUpdate(
      { userUpi: upiId },
      {
        balance: user2.balance + amount,
      }
    );
    const payment = await new Payment({
      from: sUser.upiId,
      to: rUser.upiId,
      amount: amount,
    });
    //save user to database and return response
    const newPayment = await user.save();
    return res.status(200).json({
      balance: sUser.balance,
      newPayment,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error occured :)",
      error: error.message,
    });
  }
}

// const getBalance = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     return res.status(200).json({
//       balance: user.balance,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "internal server error occured :)",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  sendPayment,
  paymentReminder,
  // getBalance
};
