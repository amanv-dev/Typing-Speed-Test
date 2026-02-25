const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");
const timeSelect = document.getElementById("timeSelect");
const themeSelect = document.getElementById("themeSelect");
const difficultySelect = document.getElementById("difficultySelect");

let timeLeft = parseInt(timeSelect.value);
let timer = null;
let started = false;

/* THEME */
themeSelect.addEventListener("change", () => {
  document.body.setAttribute("data-theme", themeSelect.value);
});

/* TEXT POOLS */

const easyWords = [
  "cat dog tree sun moon star book pen cup fish red blue green run jump play walk smile happy light dark water fire wind"
];

const mediumSentences = [
  "Consistency builds excellence through repetition.",
  "Focus transforms effort into achievement.",
  "Habits determine long term success.",
  "Patience multiplies performance over time."
];

const hardSentences = [
  "Success isn't accidental; it's engineered through discipline.",
  "Momentum—once built—requires constant calibration.",
  "Growth demands sacrifice, resilience, and adaptability.",
  "Precision matters: details define mastery."
];

const codeSnippets = [
`function greet(name) {
  return "Hello, " + name + "!";
}`,

`const add = (a, b) => {
  return a + b;
};`,

`for (let i = 0; i < 10; i++) {
  console.log(i);
}`,

`if (user.isLoggedIn) {
  dashboard.render();
}`
];

function generateText() {
  const seconds = parseInt(timeSelect.value);
  const difficulty = difficultySelect.value;

  let count = seconds === 60 ? 3 : seconds === 180 ? 8 : 15;
  let text = "";

  for (let i = 0; i < count; i++) {
    if (difficulty === "easy") {
      text += easyWords[0] + " ";
    } else if (difficulty === "medium") {
      text += mediumSentences[Math.floor(Math.random() * mediumSentences.length)] + " ";
    } else if (difficulty === "hard") {
      text += hardSentences[Math.floor(Math.random() * hardSentences.length)] + " ";
    } else if (difficulty === "code") {
      text += codeSnippets[Math.floor(Math.random() * codeSnippets.length)] + "\n\n";
    }
  }

  return text.trim();
}

function loadText() {
  const paragraph = generateText();
  textDisplay.innerHTML = "";

  paragraph.split("").forEach(char => {
    const span = document.createElement("span");
    span.innerText = char;
    textDisplay.appendChild(span);
  });
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timeEl.innerText = timeLeft;
    } else {
      clearInterval(timer);
      input.disabled = true;
    }
  }, 1000);
}

input.addEventListener("input", () => {
  if (!started) {
    started = true;
    startTimer();
  }

  const typed = input.value.split("");
  const spans = textDisplay.querySelectorAll("span");

  let correct = 0;

  spans.forEach((span, index) => {
    const char = typed[index];

    if (char == null) {
      span.classList.remove("correct", "incorrect");
    } else if (char === span.innerText) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
      correct++;
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
    }
  });

  const minutesElapsed = (parseInt(timeSelect.value) - timeLeft) / 60;
  const netWPM = Math.round((correct / 5) / minutesElapsed);
  const accuracy = Math.round((correct / typed.length) * 100);

  wpmEl.innerText = isFinite(netWPM) ? netWPM : 0;
  accuracyEl.innerText = typed.length ? accuracy + "%" : "100%";
});

function resetTest() {
  clearInterval(timer);
  timeLeft = parseInt(timeSelect.value);
  timeEl.innerText = timeLeft;
  started = false;
  input.disabled = false;
  input.value = "";
  wpmEl.innerText = 0;
  accuracyEl.innerText = "100%";
  loadText();
}

restartBtn.addEventListener("click", resetTest);
timeSelect.addEventListener("change", resetTest);
difficultySelect.addEventListener("change", resetTest);

loadText();
timeEl.innerText = timeLeft;