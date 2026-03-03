const textDisplay = document.getElementById("textDisplay");
const typingCard = document.getElementById("typingCard");
const hiddenInput = document.getElementById("hiddenInput");

const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");

const timeControls = document.getElementById("timeControls");
const themeToggle = document.getElementById("themeToggle");
const restartTop = document.getElementById("restartTop");
const restartBtn = document.getElementById("restartBtn");

const resultModal = document.getElementById("resultModal");
const finalStats = document.getElementById("finalStats");
const personalBest = document.getElementById("personalBest");
const textLengthSelect = document.getElementById("textLength");

let totalTime = 60;
let timeLeft = totalTime;
let timer = null;
let started = false;
let currentText = "";

const sentences = [
  "Consistency builds excellence through repetition.",
  "Focus transforms effort into achievement.",
  "Discipline defines long term success.",
  "Growth demands sacrifice and resilience.",
  "Preparation creates opportunity.",
  "Small steps repeated daily create massive results.",
  "Clarity beats motivation when the work gets hard.",
  "Speed comes from smoothness not rushing.",
  "Practice makes your fingers accurate and relaxed.",
  "Typing fast comes from staying calm and steady."
];

// ---------- TEXT GENERATION ----------
function generateTextForDuration(seconds, targetWpm, buffer = 1.8) {
  const minutes = seconds / 60;
  const targetChars = Math.ceil(targetWpm * 5 * minutes * buffer);

  let text = "";
  while (text.length < targetChars) {
    text += sentences[Math.floor(Math.random() * sentences.length)] + " ";
  }
  return text.trim();
}

function loadText() {
  const targetWpm = parseInt(textLengthSelect.value, 10); // 60/90/120
  currentText = generateTextForDuration(totalTime, targetWpm);

  textDisplay.innerHTML = "";
  currentText.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.innerText = char;
    if (index === 0) span.classList.add("current");
    textDisplay.appendChild(span);
  });
}

// ---------- THEME ----------
function setTheme(isLight) {
  document.body.classList.toggle("light", isLight);
  themeToggle.innerText = isLight ? "Light" : "Dark";
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// ---------- METRICS ----------
function getElapsedMinutes() {
  return (totalTime - timeLeft) / 60;
}

function computeMetrics(typedChars) {
  const spans = textDisplay.querySelectorAll("span");
  const targetLen = spans.length;
  const typedLen = typedChars.length;

  let correct = 0;
  let incorrect = 0;

  for (let i = 0; i < Math.min(targetLen, typedLen); i++) {
    if (typedChars[i] === spans[i].innerText) correct++;
    else incorrect++;
  }

  const missed = Math.max(0, targetLen - typedLen);
  const extra = Math.max(0, typedLen - targetLen);
  const errors = incorrect + extra;

  const elapsedMinutes = getElapsedMinutes();
  const safeMinutes = elapsedMinutes > 0 ? elapsedMinutes : 0;

  const rawWpm = safeMinutes ? (typedLen / 5) / safeMinutes : 0;
  const netWpm = safeMinutes ? (correct / 5) / safeMinutes : 0;

  const denom = correct + errors;
  const accuracy = denom > 0 ? (correct / denom) * 100 : 100;

  return {
    correct,
    incorrect,
    missed,
    extra,
    errors,
    netWpm: Math.round(netWpm),
    rawWpm: Math.round(rawWpm),
    accuracy: Math.round(Math.max(0, Math.min(accuracy, 100)))
  };
}

function renderTypingState(typedChars) {
  const spans = textDisplay.querySelectorAll("span");
  const targetLen = spans.length;

  spans.forEach((span, index) => {
    span.classList.remove("correct", "incorrect", "current");

    const typed = typedChars[index];
    if (typed == null) {
      if (index === typedChars.length) span.classList.add("current");
      return;
    }

    if (typed === span.innerText) span.classList.add("correct");
    else span.classList.add("incorrect");

    if (index === typedChars.length) span.classList.add("current");
  });

  if (typedChars.length >= targetLen && targetLen > 0) {
    spans[targetLen - 1].classList.add("current");
  }
}

function updateStats(typedChars) {
  const m = computeMetrics(typedChars);
  wpmEl.innerText = isFinite(m.netWpm) ? m.netWpm : 0;
  accuracyEl.innerText = `${m.accuracy}%`;
}

// ---------- TIMER / FLOW ----------
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft;
    if (timeLeft <= 0) finishTest();
  }, 1000);
}

function updateBest(score) {
  const best = Number(localStorage.getItem("bestScore") || 0);
  if (!best || score > best) localStorage.setItem("bestScore", String(score));
  personalBest.innerText = localStorage.getItem("bestScore") || "--";
}

function focusTyping() {
  hiddenInput.focus({ preventScroll: true });
}

function applyDuration(seconds) {
  clearInterval(timer);
  timer = null;
  started = false;

  totalTime = seconds;
  timeLeft = seconds;

  hiddenInput.value = "";
  timeEl.innerText = timeLeft;
  wpmEl.innerText = "0";
  accuracyEl.innerText = "100%";

  resultModal.classList.add("hidden");
  loadText();
  focusTyping();
}

function finishTest() {
  clearInterval(timer);
  timer = null;

  const typedChars = hiddenInput.value.split("");
  const m = computeMetrics(typedChars);

  finalStats.innerText =
    `WPM: ${m.netWpm} (Raw: ${m.rawWpm}) • Accuracy: ${m.accuracy}% • ` +
    `Errors: ${m.errors} (Incorrect: ${m.incorrect}, Extra: ${m.extra}, Missed: ${m.missed})`;

  updateBest(m.netWpm);

  resultModal.classList.remove("hidden");
}

// ---------- EVENTS ----------
hiddenInput.addEventListener("input", () => {
  if (!started) {
    started = true;
    startTimer();
  }
  const typedChars = hiddenInput.value.split("");
  renderTypingState(typedChars);
  updateStats(typedChars);
});

restartBtn.addEventListener("click", () => applyDuration(totalTime));
restartTop.addEventListener("click", () => applyDuration(totalTime));

timeControls.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-time]");
  if (!btn) return;

  document.querySelectorAll("#timeControls .pill")
    .forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");
  applyDuration(parseInt(btn.dataset.time, 10));
});

textLengthSelect.addEventListener("change", () => {
  applyDuration(totalTime);
});

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.contains("light");
  setTheme(!isLight);
});

typingCard.addEventListener("click", () => focusTyping());
textDisplay.addEventListener("click", () => focusTyping());

// Click outside modal closes it
resultModal.addEventListener("click", (e) => {
  if (e.target === resultModal) resultModal.classList.add("hidden");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") applyDuration(totalTime);
});

// ---------- INIT ----------
const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme === "light");

personalBest.innerText = localStorage.getItem("bestScore") || "--";
timeEl.innerText = timeLeft;

loadText();
focusTyping();