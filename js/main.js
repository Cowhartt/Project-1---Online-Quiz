let apiQuestions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;
let selectedAnswers = [];

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("result-container");
const scoreEl = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

// Start
const startScreen = document.createElement("div");
startScreen.id = "start-screen";
startScreen.style.textAlign = "center";
startScreen.style.marginTop = "100px";

const startBtn = document.createElement("button");
startBtn.textContent = "Start Quiz";
startBtn.classList.add("start-btn");
startBtn.style.padding = "12px 24px";
startBtn.style.fontSize = "1.2rem";
startBtn.style.cursor = "pointer";
startBtn.style.borderRadius = "12px";
startBtn.style.backgroundColor = "#ffa915";
startBtn.style.border = "none";
startBtn.style.color = "#fff";
startBtn.style.fontWeight = "600";

startScreen.appendChild(startBtn);
document.body.prepend(startScreen);

// loading screen
const loadingEl = document.createElement("div");
loadingEl.id = "loading-screen";
loadingEl.textContent = "Loading questions...";
loadingEl.style.textAlign = "center";
loadingEl.style.fontSize = "1.5rem";
loadingEl.style.marginTop = "100px";
loadingEl.style.display = "none";
document.body.appendChild(loadingEl);

// get questions from API
async function fetchQuestions() {
  const url = "https://opentdb.com/api.php?amount=10&category=11&difficulty=easy";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    const json = await response.json();

    // turn to quiz format
    apiQuestions = json.results.map(q => {
      let answers, correctIndex;

      if (q.type === "boolean") {
        answers = ["True", "False"];
        correctIndex = q.correct_answer === "True" ? 0 : 1;
      } else {
        answers = [...q.incorrect_answers];
        correctIndex = Math.floor(Math.random() * (answers.length + 1));
        answers.splice(correctIndex, 0, q.correct_answer);
      }

      return {
        question: q.question,
        answers: answers,
        correct: correctIndex,
        type: q.type
      };
    });

    console.log("✅ Loaded API Questions:", apiQuestions);

    // start quiz
    loadingEl.style.display = "none";
    showQuestion();

  } catch (error) {
    console.error("❌ Error fetching questions:", error.message);
    loadingEl.textContent = "Failed to load questions. Please refresh the page.";
  }
}

// current question
function showQuestion() {
  startScreen.style.display = "none";
  questionEl.style.display = "block";
  answersEl.style.display = "block";
  feedbackEl.style.display = "block";

  feedbackEl.textContent = "";
  nextBtn.style.display = "none";
  answered = false;
  selectedAnswers = [];

  updateProgress();

  const q = apiQuestions[currentQuestion];
  questionEl.innerHTML = q.question; // decode HTML entities
  answersEl.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("start-btn");
    button.style.display = "block";
    button.style.margin = "10px auto";
    button.addEventListener("click", () => selectSingle(index, button));
    answersEl.appendChild(button);
  });
}

// single choice
function selectSingle(index, button) {
  if (answered) return;
  answered = true;

  const correctIndex = apiQuestions[currentQuestion].correct;
  const buttons = answersEl.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.style.backgroundColor = "#2ecc71";
    if (i === index && i !== correctIndex) btn.style.backgroundColor = "#e74c3c";
  });

  if (index === correctIndex) {
    feedbackEl.textContent = "✅ Correct!";
    score++;
  } else {
    feedbackEl.textContent = "❌ Wrong!";
  }

  nextBtn.textContent = "Next";
  nextBtn.style.display = "inline-block";
  nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < apiQuestions.length) showQuestion();
    else showResult();
  };
}

// update progress bar
function updateProgress() {
  const progressPercent = ((currentQuestion) / apiQuestions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
  progressText.textContent = `Question ${currentQuestion + 1} of ${apiQuestions.length}`;
}

// result screen
function showResult() {
  questionEl.style.display = "none";
  answersEl.style.display = "none";
  feedbackEl.style.display = "none";
  nextBtn.style.display = "none";
  progressBar.style.width = "100%";
  progressText.textContent = "Quiz Complete!";
  resultContainer.style.display = "block";

  const totalQuestions = apiQuestions.length;
  const percent = Math.round((score / totalQuestions) * 100);

  scoreEl.innerHTML = `
    <h2>Quiz Complete!</h2>
    <p>Correct Answers: ${score}</p>
    <p>Wrong Answers: ${totalQuestions - score}</p>
    <p>Score: ${percent}%</p>
    <button id="restart-btn">Restart Quiz</button>
  `;

  document.getElementById("restart-btn").addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    resultContainer.style.display = "none";
    startScreen.style.display = "block";
  });
}

// start button
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  loadingEl.style.display = "block";
  fetchQuestions();
});

