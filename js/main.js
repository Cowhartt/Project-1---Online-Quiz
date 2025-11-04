const questions = [
  {
    question: "Who directed the movie Jurassic Park?",
    answers: ["Christopher Nolan", "Steven Spielberg", "Quentin Tarantino"],
    correct: 1
  },
  {
    question: "Which colour is Batman associated with?",
    answers: ["Orange", "Green", "Black"],
    correct: 2
  },
  {
    question: "What year did the film Harry Potter and the Philosopher's Stone come out?",
    answers: ["2001", "1991", "2021"],
    correct: 0
  },
  {
    question: "Who is the main bad guy in Star Wars?",
    answers: ["Luke Skywalker", "Darth Vader", "Obi-wan Kenobi"],
    correct: 1
  },
  {
    question: "What other name does Gollum go by in Lord of the Rings?",
    answers: ["Fégol", "Régol", "Smégol"],
    correct: 2
  },
    {
    question: "What are the name of the two main Characters (Good and Bad) in Transformers?",
    answers: ["Optimus Prime and Megatron", "Optician Grime and Minitron", "Opposite Crime and Massivetron"],
    correct: 0
  },
  {
    question: "In the Marvel Cinematic Universe, which superheroes make up the original team of Avengers?",
    answers: [
      "Black Panther",
      "Green Lantern",
      "Black Widow",
      "Iron Man",
      "Loki",
      "Hulk",
      "Spider-Man",
      "Captain America",
      "Thor",
      "Ultron",
      "Hawkeye",
      "Thanos"
    ],
    correct: [2, 3, 5, 7, 8, 10] // multiple select - put index answers in array
  },
   {
    question: "Which TV show does Peter Griffin appear in?",
    answers: ["The Simpsons", "Family Guy", "South Park"],
    correct: 1
  },
  {
    question: "True or False: Joker's girlfriend is called Harley Quinn.",
    answers: ["True", "False"],
    correct: 0
  },
  {
    question: "True or False: In Skyrim, the main shout you learn is: Unrelenting Force (Fus Ro Dah).",
    answers: ["False", "True"],
    correct: 0
  }
];
var apiQuestions = []
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

function showQuestion() {
  fetchQuestions();
  feedbackEl.textContent = "";
  nextBtn.style.display = "none";
  answered = false;
  selectedAnswers = [];

  //quiz elements visible
  questionEl.style.display = "block";
  answersEl.style.display = "block";
  feedbackEl.style.display = "block";

  updateProgress();

  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("start-btn");
    button.style.display = "block";
    button.style.margin = "10px auto";

    if (Array.isArray(q.correct)) {
      button.addEventListener("click", () => toggleSelect(index, button));
    } else {
      button.addEventListener("click", () => selectSingle(index, button));
    }

    answersEl.appendChild(button);
  });

  // For multi-select questions, show "Submit"
  if (Array.isArray(q.correct)) {
    nextBtn.textContent = "Submit";
    nextBtn.style.display = "inline-block";
    nextBtn.onclick = () => checkMultiSelect(q.correct);
  }
}

function selectSingle(index, button) {
  if (answered) return;
  answered = true;

  const correctIndex = questions[currentQuestion].correct;
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
    if (currentQuestion < questions.length) showQuestion();
    else showResult();
  };
}

function toggleSelect(index, button) {
  if (answered) return;
  if (selectedAnswers.includes(index)) {
    selectedAnswers = selectedAnswers.filter(i => i !== index);
    button.style.backgroundColor = ""; // unselect
  } else {
    selectedAnswers.push(index);
    button.style.backgroundColor = "#ffa915ff"; // highlight yellow
  }
}

function checkMultiSelect(correctArray) {
  if (answered) return;
  answered = true;

  const buttons = answersEl.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    if (correctArray.includes(i)) btn.style.backgroundColor = "#2ecc71";
    else if (selectedAnswers.includes(i)) btn.style.backgroundColor = "#e74c3c";
    btn.disabled = true;
  });

  const isCorrect =
    selectedAnswers.length === correctArray.length &&
    selectedAnswers.every(i => correctArray.includes(i));

  if (isCorrect) {
    feedbackEl.textContent = "✅ Correct!";
    score++;
  } else {
    feedbackEl.textContent = "❌ Wrong!";
  }

  nextBtn.textContent = "Next";
  nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) showQuestion();
    else showResult();
  };
}

function updateProgress() {
  const progressPercent = ((currentQuestion) / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
  progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
}

function showResult() {
  document.getElementById("quiz-container").style.display = "none";
  questionEl.style.display = "none";
  answersEl.style.display = "none";
  feedbackEl.style.display = "none";
  nextBtn.style.display = "none";

  progressBar.style.width = "100%";
  progressText.textContent = "Quiz Complete!";

  resultContainer.style.display = "block";

  const totalQuestions = questions.length;
  const correct = score;
  const wrong = totalQuestions - score;
  const percent = Math.round((score / totalQuestions) * 100);

  scoreEl.innerHTML = `
    <h2> Quiz Complete! </h2>
    <p>Correct Answers: ${correct}</p>
    <p>Wrong Answers: ${wrong}</p>
    <p>Score: ${percent}%</p>
    <button id="restart-btn">Restart Quiz</button>
  `;

  document.getElementById("restart-btn").addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    document.getElementById("quiz-container").style.display = "block";
    questionEl.style.display = "block";
    answersEl.style.display = "block";
    feedbackEl.style.display = "block";
    nextBtn.style.display = "none";
    resultContainer.style.display = "none";
    showQuestion();
  });
}

async function fetchQuestions(){
    const url = "https://opentdb.com/api.php?amount=10";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    console.log("QUESTION")
console.log(json.results[3].question) 
console.log("CORRECT ANSWER")
console.log(json.results[3].correct_answer)
console.log("INCORRECT-ANSWER")
var jsonAnswers = json.results[3].incorrect_answers
for (let i = 0; i < jsonAnswers.length; i++) {
  console.log(i)
  console.log(jsonAnswers[i])
}
apiQuestions = json.results
console.log("APIQUESTIONS")
console.log(apiQuestions)
  } catch (error) {
    console.error(error.message);
  }
}
// start
showQuestion();

