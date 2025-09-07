const express = require('express');
const path = require('path');
const generateExam = require('./take_exam');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, ảnh…)
app.use(express.static(path.join(__dirname, 'public')));

// Trả về index.html khi vào "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API trả về 10 câu random
app.get('/api/questions', (req, res) => {
  try {
    const exam = generateExam();
    res.json(exam);
  } catch (err) {
    console.error('Lỗi khi tạo đề thi:', err);
    res.status(500).json({ error: 'Không thể tạo đề thi' });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại cổng ${PORT}`);
});
