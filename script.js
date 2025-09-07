async function startQuiz() {
  // 👉 chỉ cần chạy 1 lần để thêm background
  if (!document.getElementById("quiz-bg")) {
    const bg = document.createElement('div');
    bg.id = "quiz-bg";
    Object.assign(bg.style, {
      position: 'fixed',
      inset: '0',
      backgroundImage: 'url("/bg.jpg")', // 🔥 đổi link ảnh ở đây
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: '0.2',
      zIndex: '-1',
      pointerEvents: 'none'
    });
    document.body.appendChild(bg);
  }

  const res = await fetch('/api/questions');
  const questions = await res.json();
  const quizDiv = document.getElementById('quiz');
  quizDiv.innerHTML = '';

  const userAnswers = {}; // lưu câu trả lời của user

  questions.forEach((q, index) => {
    const qDiv = document.createElement('div');
    qDiv.classList.add('question');

    const p = document.createElement('p');
    p.innerText = `${index + 1}. ${q.question}`;
    qDiv.appendChild(p);

    q.answers.forEach(opt => {
      const label = document.createElement('label');
      label.style.display = 'block';
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `q${index}`;  // group theo câu
      radio.value = opt.label;

      radio.onchange = () => {
        userAnswers[index] = opt.label; // lưu đáp án user
      };

      label.appendChild(radio);
      label.appendChild(document.createTextNode(` ${opt.label}. ${opt.text}`));
      qDiv.appendChild(label);
    });

    quizDiv.appendChild(qDiv);
  });

  // Thêm nút submit
  const submitBtn = document.createElement('button');
  submitBtn.innerText = 'Nộp bài';
  submitBtn.onclick = () => {
    let score = 0;
    const resultDiv = document.createElement('div');
    resultDiv.innerHTML = `<h2>KẾT QUẢ:</h2>`;
    
    questions.forEach((q, index) => {
      const userAns = userAnswers[index];
      const correct = q.answers.find(a => a.correct);

      const qResult = document.createElement('p');

      if (userAns === correct.label) {
        score++;
        qResult.innerHTML = `<p><b>Câu ${index + 1}: ${q.question}</b></p>
      <p style="color:green">✅ Đúng (${correct.label}. ${correct.text})</p>
    `;
      } else {
        const userText = q.answers.find(a => a.label === userAns)?.text || 'Chưa chọn';
        qResult.innerHTML = `<p><b>Câu ${index + 1}: ${q.question}</b></p>
      <p style="color:red">❌ Sai</p>
        ➤ Bạn chọn: ${userAns ? userAns + '. ' + userText : 'Chưa chọn'} <br>
        ➤ Đáp án đúng: ${correct.label}. ${correct.text}`;
        qResult.style.color = 'red';
      }

      resultDiv.appendChild(qResult);
    });

    const scoreP = document.createElement('h3');
    scoreP.innerText = `Tổng điểm: ${score} / ${questions.length}`;
    resultDiv.prepend(scoreP);

    // 👉 thêm thông báo đỗ / trượt
    const message = document.createElement('h2');
    if (score >= 8) {
      message.innerText = "🎉 Bạn đã đỗ rồi!";
      message.style.color = "green";
    } else {
      message.innerText = "❌ Ối dồi ôi!Bạn đã Mất 5 lít rồi";
      message.style.color = "red";
    }
    resultDiv.prepend(message);

    quizDiv.innerHTML = '';
    quizDiv.appendChild(resultDiv);
  };

  quizDiv.appendChild(submitBtn);
}
