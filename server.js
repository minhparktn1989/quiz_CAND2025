// server.js
const express = require('express');
const path = require('path');
const generateExam = require('./take_exam');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: log request (giúp debug)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files từ thư mục "public"
app.use(express.static(path.join(__dirname, 'public')));

// Route gốc để test
app.get('/', (req, res) => {
  res.send('🚀 Quiz App is running!');
});

// API: trả về 10 câu random
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
