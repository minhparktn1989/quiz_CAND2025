// take_exam.js
const bank = require('./bank.json');

function formatText(str) {
  return str.replace(/\s*\n\s*/g, "\n   ");
}

function sample(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return out;
}

function generateExam() {
  const g1 = bank.filter((q) => q.number >= 1 && q.number <= 80);
  const g2 = bank.filter((q) => q.number >= 81 && q.number <= 121);
  const g3 = bank.filter((q) => q.number >= 122 && q.number <= 145);
  const g4 = bank.filter((q) => q.number >= 146 && q.number <= 151);

  return [
    ...sample(g1, 5),
    ...sample(g2, 2),
    ...sample(g3, 2),
    ...sample(g4, 1),
  ].map((q, i) => ({ ...q, order: i + 1 }));
}

// Chỉ chạy terminal nếu chạy trực tiếp
if (require.main === module) {
  const readline = require("readline");

  async function main() {
    const exam = generateExam();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    console.log("===== BẮT ĐẦU LÀM BÀI =====");

    let score = 0;

    for (const q of exam) {
      console.log("\n" + "=".repeat(70));
      console.log(`${q.order}. ${formatText(q.question)}`);
      q.answers.forEach((a) => {
        console.log(`   ${a.label}. ${formatText(a.text)}`);
      });
      console.log("-".repeat(70));
      console.log(""); 

      const answer = await new Promise((res) =>
        rl.question(`👉 Nhập đáp án cho câu ${q.order}: `, (ans) => res(ans))
      );

      const chosen = q.answers.find(
        (a) => a.label.toUpperCase() === answer.trim().toUpperCase()
      );
      if (chosen && chosen.correct) {
        console.log("✔️ Chính xác!");
        score++;
      } else {
        const correct = q.answers.find((a) => a.correct);
        console.log(
          `❌ Sai. Đáp án đúng: ${correct ? correct.label + ". " + correct.text : "Không tìm thấy"}`
        );
      }
    }

    rl.close();
    console.log("\n" + "=".repeat(70));
    console.log(`KẾT QUẢ: ${score}/${exam.length}`);
    console.log("=".repeat(70));
  }

  main();
}

// Export để server dùng
module.exports = generateExam;
