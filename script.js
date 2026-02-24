const sampleText =
  "Success is not about luck. It is about discipline, effort, and consistency repeated daily until greatness becomes a habit.";

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

function loadText() {
  textDisplay.innerHTML = "";
  sampleText.split("").forEach(char => {
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

  const minutes = (parseInt(timeSelect.value) - timeLeft) / 60;
  const wpm = Math.round((correct / 5) / minutes);
  wpmEl.innerText = isFinite(wpm) ? wpm : 0;

  const accuracy = Math.round((correct / typed.length) * 100);
  accuracyEl.innerText = typed.length ? accuracy + "%" : "100%";
});

restartBtn.addEventListener("click", resetTest);

timeSelect.addEventListener("change", resetTest);

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

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  themeToggle.textContent =
    document.body.classList.contains("dark") ? "🌙" : "☀️";
});

loadText();
timeEl.innerText = timeLeft;
