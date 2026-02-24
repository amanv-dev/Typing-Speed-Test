const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");
const timeSelect = document.getElementById("timeSelect");
const themeToggle = document.getElementById("themeToggle");

let timeLeft = parseInt(timeSelect.value);
let timer = null;
let started = false;
let currentText = "";
let usedTexts = new Set();

/* Sentence pool */
const sentencePool = [
  "Discipline is choosing what you want most over what you want now.",
  "Small daily improvements lead to stunning long term results.",
  "Consistency beats intensity when building lasting success.",
  "Focus is the bridge between goals and accomplishment.",
  "Mastery is achieved through repetition and reflection.",
  "Growth begins where comfort ends.",
  "Momentum builds when action becomes a habit.",
  "Confidence is earned through preparation.",
  "Effort compounds just like interest.",
  "Patience is power in slow motion.",
  "Clarity fuels productivity.",
  "Habits define the direction of your life.",
  "Progress requires persistence.",
  "Excellence is never accidental.",
  "Learning never exhausts the mind.",
  "Dedication transforms dreams into reality.",
  "Courage grows through challenge.",
  "Preparation creates opportunity.",
  "Vision gives purpose to effort.",
  "Success favors the consistent."
];

/* Generate paragraph based on minutes */
function generateParagraph(seconds) {
  let sentenceCount;

  if (seconds === 60) sentenceCount = 4;
  if (seconds === 180) sentenceCount = 10;
  if (seconds === 300) sentenceCount = 18;

  let available = [...sentencePool];
  let paragraph = "";

  for (let i = 0; i < sentenceCount; i++) {
    if (available.length === 0) {
      available = [...sentencePool];
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    paragraph += available[randomIndex] + " ";
    available.splice(randomIndex, 1);
  }

  return paragraph.trim();
}

function getUniqueText() {
  let newText;

  do {
    newText = generateParagraph(parseInt(timeSelect.value));
  } while (usedTexts.has(newText));

  usedTexts.add(newText);
  return newText;
}

function loadText() {
  currentText = getUniqueText();
  textDisplay.innerHTML = "";

  currentText.split("").forEach(char => {
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
  const wpm = Math.round((correct / 5) / minutesElapsed);
  wpmEl.innerText = isFinite(wpm) ? wpm : 0;

  const accuracy = Math.round((correct / typed.length) * 100);
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

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  themeToggle.textContent =
    document.body.classList.contains("dark") ? "🌙" : "☀️";
});

loadText();
timeEl.innerText = timeLeft;
