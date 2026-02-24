const sampleText =
  "Consistency is what transforms average into excellence. Stay disciplined, stay focused, and let your daily effort compound into success.";

const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");

let timeLeft = 60;
let timer = null;
let started = false;

function loadText() {
  textDisplay.innerHTML = "";
  sampleText.split("").forEach((char) => {
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

  const typedText = input.value.split("");
  const spans = textDisplay.querySelectorAll("span");

  let correct = 0;

  spans.forEach((span, index) => {
    const char = typedText[index];

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

  const minutes = (60 - timeLeft) / 60;
  const wpm = Math.round((correct / 5) / minutes);
  wpmEl.innerText = isFinite(wpm) ? wpm : 0;

  const accuracy = Math.round((correct / typedText.length) * 100);
  accuracyEl.innerText = typedText.length ? accuracy : 100;
});

restartBtn.addEventListener("click", () => {
  clearInterval(timer);
  timeLeft = 60;
  started = false;
  input.disabled = false;
  input.value = "";
  timeEl.innerText = timeLeft;
  wpmEl.innerText = 0;
  accuracyEl.innerText = 100;
  loadText();
});

loadText();
