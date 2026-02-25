const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");
const timeSelect = document.getElementById("timeSelect");
const themeSelect = document.getElementById("themeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const bestStatsEl = document.getElementById("bestStats");

let timeLeft = parseInt(timeSelect.value);
let timer = null;
let started = false;

/* THEME */
themeSelect.addEventListener("change", () => {
  document.body.setAttribute("data-theme", themeSelect.value);
});

/* TEXT DATA */

const textPool = [
  "Consistency builds excellence through repetition.",
  "Focus transforms effort into achievement.",
  "Growth demands sacrifice and resilience.",
  "Discipline defines long term success.",
  "Preparation creates opportunity."
];

function generateText() {
  let count = parseInt(timeSelect.value) === 60 ? 3 :
              parseInt(timeSelect.value) === 180 ? 8 : 15;

  let text = "";
  for (let i = 0; i < count; i++) {
    text += textPool[Math.floor(Math.random() * textPool.length)] + " ";
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

/* TIMER */

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timeEl.innerText = timeLeft;
    } else {
      clearInterval(timer);
      input.disabled = true;
      updatePersonalBest();
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

/* PERSONAL BEST SYSTEM */

function getKey() {
  return `best_${timeSelect.value}_${difficultySelect.value}`;
}

function updatePersonalBest() {
  const currentWPM = parseInt(wpmEl.innerText);
  const currentAccuracy = parseInt(accuracyEl.innerText);

  const key = getKey();
  const existing = JSON.parse(localStorage.getItem(key));

  if (!existing || currentWPM > existing.wpm) {
    const record = {
      wpm: currentWPM,
      accuracy: currentAccuracy
    };
    localStorage.setItem(key, JSON.stringify(record));
  }

  loadPersonalBest();
}

function loadPersonalBest() {
  const key = getKey();
  const record = JSON.parse(localStorage.getItem(key));

  if (record) {
    bestStatsEl.innerText =
      `Best WPM: ${record.wpm} | Accuracy: ${record.accuracy}%`;
  } else {
    bestStatsEl.innerText = "No record yet";
  }
}

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
  loadPersonalBest();
}

restartBtn.addEventListener("click", resetTest);
timeSelect.addEventListener("change", resetTest);
difficultySelect.addEventListener("change", resetTest);

loadText();
timeEl.innerText = timeLeft;
loadPersonalBest();