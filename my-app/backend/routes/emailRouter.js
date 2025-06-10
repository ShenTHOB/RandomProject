const express = require('express');
const router = express.Router();
const { sendCode, verifyCode } = require('./handleEmail');

// POST /api/email/send-code
router.post('/send-code', async (req, res) => {
  const { email } = req.body;
  console.log("Request to send code to:", email);
  try {
    const result = await sendCode(email);
    console.log(" Email sent result:", result);
    res.json(result);
  } catch (error) {
    console.error(" Error sending code:", error.message);
    res.status(500).json({ message: "Failed to send email.", error: error.message });
  }
});

// POST /api/email/verify-code
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  try {
    const result = verifyCode(email, code);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
