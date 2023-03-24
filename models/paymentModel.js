const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      default: "",
    },
    to: {
      type: String,
      default: "",
    },
    amount: {
      type: String,
      default: ""
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
