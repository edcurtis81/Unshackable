const DEFAULT_PHRASES = [
  "I don’t chase reassurance. I choose self-respect.",
  "My discipline is proof I’m built for more.",
  "Silence doesn’t shake me. I stay steady.",
  "I can miss them and still choose myself.",
  "I don’t negotiate my worth.",
  "I’m not behind. I’m rebuilding.",
  "I respond with calm, not craving.",
  "I don’t beg for clarity. I create it.",
  "I trust my future self.",
  "My boundaries are love for me.",
  "I don’t chase energy that avoids me.",
  "I choose peace over patterns.",
  "I let actions speak. I move accordingly.",
  "I don’t need closure to move forward.",
  "I can feel it and not follow it.",
  "My nervous system learns safety in stillness.",
  "I stay present. I stay powerful.",
  "I don’t take distance personally.",
  "I am consistent with myself.",
  "I refuse to audition for love.",
  "I choose alignment over anxiety.",
  "I don’t interpret. I observe.",
  "I stop when it costs my dignity.",
  "I hold my standard without apology.",
  "I don’t chase. I attract.",
  "My calm is my confidence.",
  "I am steady under uncertainty.",
  "I don’t need to be chosen. I choose.",
  "I don’t over-explain. I stand firm.",
  "I release what can’t meet me.",
  "I don’t chase texts. I build a life.",
  "I return to routine. I return to strength.",
  "My focus is my freedom.",
  "I breathe, I slow down, I regain control.",
  "I don’t confuse intensity for intimacy.",
  "I don’t seek signs. I seek consistency.",
  "I respect my needs without shame.",
  "I don’t abandon myself to keep someone.",
  "I don’t trade self-respect for relief.",
  "I give myself the reassurance I want.",
  "I stay kind, but I stay firm.",
  "I don’t romanticise mixed signals.",
  "I don’t chase potential. I choose reality.",
  "I protect my peace like it’s sacred.",
  "I let go without collapsing.",
  "I don’t personalise avoidance.",
  "I am safe with me.",
  "I don’t need a reply to be okay.",
  "I choose clarity, even when it hurts.",
  "I move like a man who knows his value.",
  "My standards are not negotiable.",
  "I don’t reach for what rejects me.",
  "I feel the urge, then I lift it off me.",
  "I lead myself back to calm.",
  "I am building something bigger than this moment.",
  "I don’t chase comfort. I build resilience.",
  "I let time reveal truth.",
  "I don’t chase love. I embody it.",
  "I am grounded. I am capable.",
  "I act from self-respect, not fear."
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
