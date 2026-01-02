const defaultPhrases = [
  "I don’t chase reassurance. I choose self-respect.",
  "My discipline is proof I’m built for more.",
  "I stay calm. I stay kind. I stay in control.",
  "Silence doesn’t weaken me — it trains me.",
  "I’m attractive, capable, and steady.",
  "I respond with clarity, not emotion.",
  "I lead myself. That’s power.",
  "Every rep is a vote for the man I’m becoming.",
  "I can feel it — and still not act from it.",
  "I don’t need closure to move forward.",
  "I choose standards over impulses.",
  "I am safe in myself."
];

const sublines = [
  "Breathe. Shoulders down. Eyes forward.",
  "Slow is strong.",
  "Calm is confidence.",
  "You’re not behind. You’re rebuilding.",
  "Self-trust beats reassurance."
];

const LS_KEYS = {
  phrases: "unshakable_phrases",
  lastIndex: "unshakable_last_index",
  reminderTime: "unshakable_reminder_time"
};

function loadPhrases() {
  const raw = localStorage.getItem(LS_KEYS.phrases);
  if (!raw) return defaultPhrases.slice();
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length ? arr : defaultPhrases.slice();
  } catch {
    return defaultPhrases.slice();
  }
}

function savePhrases(arr) {
  localStorage.setItem(LS_KEYS.phrases, JSON.stringify(arr));
}

function pickIndex(max) {
  const last = Number(localStorage.getItem(LS_KEYS.lastIndex) || -1);
  if (max <= 1) return 0;
  let idx = Math.floor(Math.random() * max);
  if (idx === last) idx = (idx + 1) % max;
  localStorage.setItem(LS_KEYS.lastIndex, String(idx));
  return idx;
}

function setQuote(text) {
  document.getElementById("quote").textContent = text;
  document.getElementById("sub").textContent =
    sublines[Math.floor(Math.random() * sublines.length)];
}

function updateCount(n) {
  document.getElementById("count").textContent = `${n} phrases`;
}

let phrases = loadPhrases();
updateCount(phrases.length);
setQuote(phrases[pickIndex(phrases.length)]);

document.getElementById("next").addEventListener("click", () => {
  phrases = loadPhrases();
  updateCount(phrases.length);
  setQuote(phrases[pickIndex(phrases.length)]);
});

document.getElementById("copy").addEventListener("click", async () => {
  const text = document.getElementById("quote").textContent;
  try {
    await navigator.clipboard.writeText(text);
    document.getElementById("sub").textContent = "Copied. Use it.";
  } catch {
    document.getElementById("sub").textContent = "Copy failed. Long-press to select.";
  }
});

document.getElementById("edit").addEventListener("click", () => {
  phrases = loadPhrases();
  const joined = phrases.join("\n");
  const out = prompt("Edit your phrases (one per line). Keep it in your voice:", joined);
  if (out === null) return;
  const arr = out.split("\n").map(s => s.trim()).filter(Boolean);
  savePhrases(arr.length ? arr : defaultPhrases.slice());
  phrases = loadPhrases();
  updateCount(phrases.length);
  setQuote(phrases[pickIndex(phrases.length)]);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

const reminderBox = document.getElementById("reminder");
document.getElementById("notify").addEventListener("click", async () => {
  reminderBox.style.display = reminderBox.style.display === "none" ? "block" : "none";
});

const timeInput = document.getElementById("time");
const savedTime = localStorage.getItem(LS_KEYS.reminderTime);
if (savedTime) timeInput.value = savedTime;

document.getElementById("set").addEventListener("click", async () => {
  localStorage.setItem(LS_KEYS.reminderTime, timeInput.value);

  const status = document.getElementById("status");
  if (!("Notification" in window)) {
    status.textContent = "Notifications not supported here.";
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm !== "granted") {
    status.textContent = "Permission denied.";
    return;
  }

  status.textContent = "Set. Keep this app opened daily for best results.";
  scheduleInAppReminder();
});

let timerId = null;
function scheduleInAppReminder() {
  if (timerId) clearInterval(timerId);

  timerId = setInterval(() => {
    const t = localStorage.getItem(LS_KEYS.reminderTime);
    if (!t) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const key = `unshakable_notified_${now.toDateString()}_${hh}:${mm}`;

    if (`${hh}:${mm}` === t && !localStorage.getItem(key)) {
      localStorage.setItem(key, "1");
      const p = loadPhrases();
      const msg = p[pickIndex(p.length)];
      new Notification("Unshakable", { body: msg });
    }
  }, 20 * 1000);
}
scheduleInAppReminder();
