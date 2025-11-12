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