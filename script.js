async function startQuiz() {
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
        qResult.innerHTML = `Câu ${index + 1}: ✅ Đúng (${correct.label}. ${correct.text})`;
        qResult.style.color = 'green';
      } else {
        const userText = q.answers.find(a => a.label === userAns)?.text || 'Chưa chọn';
        qResult.innerHTML = `Câu ${index + 1}: ❌ Sai <br>
        ➤ Bạn chọn: ${userAns ? userAns + '. ' + userText : 'Chưa chọn'} <br>
        ➤ Đáp án đúng: ${correct.label}. ${correct.text}`;
        qResult.style.color = 'red';
      }

      resultDiv.appendChild(qResult);
    });

    const scoreP = document.createElement('h3');
    scoreP.innerText = `Tổng điểm: ${score} / ${questions.length}`;
    resultDiv.prepend(scoreP);

    quizDiv.innerHTML = '';
    quizDiv.appendChild(resultDiv);
  };

  quizDiv.appendChild(submitBtn);
}
