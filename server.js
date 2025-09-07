// server.js
const express = require('express');
const path = require('path');
const generateExam = require('./take_exam');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve file tĩnh từ public
app.use(express.static(path.join(__dirname, 'public')));

// API trả 10 câu random
app.get('/api/questions', (req, res) => {
  const exam = generateExam();
  res.json(exam);
});

app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
