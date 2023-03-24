const router = require("express").Router();
const { sendPayment, paymentReminder} = require("../controllers/paymentController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/sendpayment", authenticateToken, sendPayment);
router.post("/paymentreminder", authenticateToken, paymentReminder);

module.exports = router;