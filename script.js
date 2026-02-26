const textDisplay = document.getElementById("textDisplay");
const hiddenInput = document.getElementById("hiddenInput");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timeControls = document.getElementById("timeControls");
const themeToggle = document.getElementById("themeToggle");
const resultModal = document.getElementById("resultModal");
const finalStats = document.getElementById("finalStats");
const restartBtn = document.getElementById("restartBtn");
const personalBest = document.getElementById("personalBest");

let timeLeft = 60;
let timer = null;
let started = false;
let currentText = "";
let correct = 0;

const sentences = [
  "Consistency builds excellence through repetition.",
  "Focus transforms effort into achievement.",
  "Discipline defines long term success.",
  "Growth demands sacrifice and resilience.",
  "Preparation creates opportunity."
];

function generateText() {
  let text = "";
  for (let i = 0; i < 8; i++) {
    text += sentences[Math.floor(Math.random() * sentences.length)] + " ";
  }
  return text.trim();
}

function loadText() {
  currentText = generateText();
  textDisplay.innerHTML = "";

  currentText.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.innerText = char;
    if (index === 0) span.classList.add("current");
    textDisplay.appendChild(span);
  });
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft;
    if (timeLeft <= 0) finishTest();
  }, 1000);
}

hiddenInput.addEventListener("input", () => {
  if (!started) {
    started = true;
    startTimer();
  }

  const typed = hiddenInput.value.split("");
  const spans = textDisplay.querySelectorAll("span");

  correct = 0;

  spans.forEach((span, index) => {
    span.classList.remove("correct", "incorrect", "current");

    if (typed[index] == null) {
      if (index === typed.length) span.classList.add("current");
      return;
    }

    if (typed[index] === span.innerText) {
      span.classList.add("correct");
      correct++;
    } else {
      span.classList.add("incorrect");
    }

    if (index === typed.length) span.classList.add("current");
  });

  const minutes = (60 - timeLeft) / 60;
  const wpm = Math.round((correct / 5) / minutes);
  const accuracy = Math.round((correct / typed.length) * 100);

  wpmEl.innerText = isFinite(wpm) ? wpm : 0;
  accuracyEl.innerText = typed.length ? accuracy + "%" : "100%";
});

function finishTest() {
  clearInterval(timer);
  resultModal.classList.remove("hidden");

  const finalWPM = wpmEl.innerText;
  finalStats.innerText = `WPM: ${finalWPM} | Accuracy: ${accuracyEl.innerText}`;

  updateBest(finalWPM);
}

function updateBest(score) {
  const best = localStorage.getItem("bestScore");
  if (!best || score > best) {
    localStorage.setItem("bestScore", score);
  }
  personalBest.innerText = "Best: " + localStorage.getItem("bestScore");
}

restartBtn.addEventListener("click", () => {
  location.reload();
});

timeControls.addEventListener("click", e => {
  if (e.target.dataset.time) {
    document.querySelectorAll("#timeControls span")
      .forEach(s => s.classList.remove("active"));
    e.target.classList.add("active");

    timeLeft = parseInt(e.target.dataset.time);
    timeEl.innerText = timeLeft;
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

document.addEventListener("click", () => hiddenInput.focus());

loadText();
timeEl.innerText = timeLeft;
personalBest.innerText = "Best: " + (localStorage.getItem("bestScore") || "--");