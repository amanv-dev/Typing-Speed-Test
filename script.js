const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");
const timeSelect = document.getElementById("timeSelect");
const themeSelect = document.getElementById("themeSelect");

let timeLeft = parseInt(timeSelect.value);
let timer = null;
let started = false;

/* THEME SYSTEM */

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
  themeSelect.value = savedTheme;
}

themeSelect.addEventListener("change", () => {
  const selected = themeSelect.value;
  document.body.setAttribute("data-theme", selected);
  localStorage.setItem("theme", selected);
});

loadTheme();

/* TEXT SYSTEM */

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
  "Learning never exhausts the mind."
];

function generateParagraph(seconds) {
  let count = seconds === 60 ? 4 : seconds === 180 ? 10 : 18;
  let text = "";

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * sentencePool.length);
    text += sentencePool[randomIndex] + " ";
  }

  return text.trim();
}

function loadText() {
  const paragraph = generateParagraph(parseInt(timeSelect.value));
  textDisplay.innerHTML = "";

  paragraph.split("").forEach(char => {
    const span = document.createElement("span");
    span.innerText = char;
    textDisplay.appendChild(span);
  });
}

/* TIMER + TYPING */

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

/* RESET */

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

loadText();
timeEl.innerText = timeLeft;