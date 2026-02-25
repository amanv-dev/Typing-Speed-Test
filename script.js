const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");

const rawWpmEl = document.getElementById("rawWpm");
const cpmEl = document.getElementById("cpm");
const errorsEl = document.getElementById("errors");
const totalTypedEl = document.getElementById("totalTyped");

const restartBtn = document.getElementById("restartBtn");
const timeSelect = document.getElementById("timeSelect");
const themeSelect = document.getElementById("themeSelect");
const advancedToggle = document.getElementById("advancedToggle");
const advancedPanel = document.getElementById("advancedPanel");

let timeLeft = parseInt(timeSelect.value);
let timer = null;
let started = false;

/* THEME */

themeSelect.addEventListener("change", () => {
  document.body.setAttribute("data-theme", themeSelect.value);
});

/* ADVANCED TOGGLE */

advancedToggle.addEventListener("click", () => {
  advancedPanel.classList.toggle("hidden");
});

/* TEXT */

const sentencePool = [
  "Discipline is choosing what you want most over what you want now.",
  "Consistency builds excellence through repetition.",
  "Focus transforms effort into achievement.",
  "Habits determine long term success.",
  "Patience multiplies performance over time.",
  "Preparation reduces uncertainty.",
  "Progress requires daily commitment.",
  "Confidence grows through challenge."
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

/* TIMER */

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

/* TYPING */

input.addEventListener("input", () => {
  if (!started) {
    started = true;
    startTimer();
  }

  const typed = input.value.split("");
  const spans = textDisplay.querySelectorAll("span");

  let correct = 0;
  let errors = 0;

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
      errors++;
    }
  });

  const minutesElapsed = (parseInt(timeSelect.value) - timeLeft) / 60;

  const rawWPM = Math.round((typed.length / 5) / minutesElapsed);
  const netWPM = Math.round(((correct - errors) / 5) / minutesElapsed);
  const cpm = Math.round(typed.length / minutesElapsed);

  wpmEl.innerText = isFinite(netWPM) ? netWPM : 0;
  rawWpmEl.innerText = isFinite(rawWPM) ? rawWPM : 0;
  cpmEl.innerText = isFinite(cpm) ? cpm : 0;
  errorsEl.innerText = errors;
  totalTypedEl.innerText = typed.length;

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
  rawWpmEl.innerText = 0;
  cpmEl.innerText = 0;
  errorsEl.innerText = 0;
  totalTypedEl.innerText = 0;
  loadText();
}

restartBtn.addEventListener("click", resetTest);
timeSelect.addEventListener("change", resetTest);

loadText();
timeEl.innerText = timeLeft;