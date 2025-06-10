const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Use email router under /api/email
const emailRouter = require('./routes/emailRouter');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// Use the emailRouter under the prefix /api/email
app.use('/api/email', emailRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
