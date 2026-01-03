// ============================
// Unshakable – app.js (clean)
// ============================

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
  "I don’t chase. I attract.",
  "I am grounded. I am capable.",
  "I act from self-respect, not fear."
];

const SUBLINES = [
  "Breathe. Shoulders down. Eyes forward.",
  "Slow is strong.",
  "Calm is confidence.",
  "You’re not behind. You’re rebuilding.",
  "Self-trust beats reassurance."
];

const LS = {
  phrases: "unshakable_phrases",
  last: "unshakable_last",
  reminderTimes: "unshakable_reminder_times"
};

// ---------- phrases ----------
function loadPhrases() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS.phrases));
    return Array.isArray(raw) && raw.length ? raw : DEFAULT_PHRASES.slice();
  } catch {
    return DEFAULT_PHRASES.slice();
  }
}

function savePhrases(arr) {
  localStorage.setItem(LS.phrases, JSON.stringify(arr));
}

function pickIndex(max) {
  const last = Number(localStorage.getItem(LS.last) || -1);
  let idx = Math.floor(Math.random() * max);
  if (idx === last) idx = (idx + 1) % max;
  localStorage.setItem(LS.last, idx);
  return idx;
}

function setQuote(text) {
  document.getElementById("quote").textContent = text;
  document.getElementById("sub").textContent =
    SUBLINES[Math.floor(Math.random() * SUBLINES.length)];
}

function updateCount(n) {
  document.getElementById("count").textContent = `${n} phrases`;
}

// ---------- init ----------
let phrases = loadPhrases();
updateCount(phrases.length);
setQuote(phrases[pickIndex(phrases.length)]);

// ---------- buttons ----------
document.getElementById("next").onclick = () => {
  phrases = loadPhrases();
  updateCount(phrases.length);
  setQuote(phrases[pickIndex(phrases.length)]);
};

document.getElementById("copy").onclick = async () => {
  const text = document.getElementById("quote").textContent;
  try {
    await navigator.clipboard.writeText(text);
    document.getElementById("sub").textContent = "Copied. Use it.";
  } catch {
    document.getElementById("sub").textContent = "Copy failed.";
  }
};

document.getElementById("edit").onclick = () => {
  const joined = loadPhrases().join("\n");
  const out = prompt("Edit your phrases (one per line):", joined);
  if (!out) return;
  const arr = out.split("\n").map(s => s.trim()).filter(Boolean);
  savePhrases(arr);
  phrases = loadPhrases();
  updateCount(phrases.length);
  setQuote(phrases[pickIndex(phrases.length)]);
};

// ---------- reminders ----------
const notifyBtn = document.getElementById("notify");
const panel = document.getElementById("reminderPanel");
const permBtn = document.getElementById("permBtn");
const saveBtn = document.getElementById("saveRemindersBtn");
const status = document.getElementById("reminderStatus");

notifyBtn.onclick = () => {
  panel.style.display = panel.style.display === "block" ? "none" : "block";
};

async function requestPermission() {
  if (!("Notification" in window)) {
    alert("Notifications not supported.");
    return false;
  }
  if (Notification.permission === "granted") return true;
  return (await Notification.requestPermission()) === "granted";
}

permBtn.onclick = async () => {
  const ok = await requestPermission();
  status.textContent = ok ? "Notifications enabled ✓" : "Permission denied";
};

saveBtn.onclick = async () => {
  const ok = await requestPermission();
  if (!ok) {
    status.textContent = "Enable notifications first.";
    return;
  }

  const times = [
    document.getElementById("t1").value,
    document.getElementById("t2").value,
    document.getElementById("t3").value
  ].filter(Boolean);

  localStorage.setItem(LS.reminderTimes, JSON.stringify(times));
  status.textContent = "Saved ✓ (fires while app is open)";
  scheduleReminders();
};

function scheduleReminders() {
  if (Notification.permission !== "granted") return;

  const times = JSON.parse(localStorage.getItem(LS.reminderTimes) || "[]");

  times.forEach(t => {
    const [h, m] = t.split(":").map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);

    setTimeout(() => {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification("Unshakable", {
          body: loadPhrases()[pickIndex(loadPhrases().length)],
          icon: "icons/icon-192.png",
          data: { url: "./" }
        });
      });
    }, target - now);
  });
}

// ---------- service worker ----------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
