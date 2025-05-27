const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;
const { sendCode, verifyCode } = require('./routes/handleEmail');


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.post('/send-code', async (req, res) => {
    const { email } = req.body;
    console.log("📩 Request to send code to:", email); // <== you should see this!
    try {
      const result = await sendCode(email);
      console.log("✅ Email sent result:", result); // <== you should see this!
      res.json(result);
    } catch (error) {
      console.error("❌ Error sending code:", error.message); // <== see if this appears
      res.status(500).json({ message: "❌ Failed to send email.", error: error.message });
    }
  });
  
  
app.post('/verify-code', (req, res) => {
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
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
