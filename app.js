// ============================
// Unshakable – app.js (clean)
// ============================

const DEFAULT_PHRASES = [
  "I lead myself. That’s power.",
  "I don’t chase reassurance. I choose self-respect.",
  "Silence doesn’t shake me. I stay steady.",
  "Discipline builds the man I trust.",
  "I can miss them and still choose myself.",
  "I don’t negotiate my worth.",
  "I respond with calm, not craving.",
  "I don’t beg for clarity. I create it.",
  "My boundaries protect my future.",
  "I let actions speak. I move accordingly.",

  "I don’t need closure to move forward.",
  "I am grounded. I am capable.",
  "I train even when I don’t feel like it.",
  "My emotions don’t control my behaviour.",
  "I stay composed under pressure.",
  "I choose long-term strength over short-term relief.",
  "I don’t explain myself to people who won’t listen.",
  "I trust discipline more than motivation.",
  "I move in silence and let results speak.",
  "I don’t react. I decide.",

  "My calm is earned.",
  "I don’t chase energy that avoids me.",
  "I build quietly. I rise steadily.",
  "I keep my word to myself.",
  "I don’t leak emotion where it isn’t safe.",
  "I respect my own time.",
  "I don’t need validation to stay consistent.",
  "I act from principle, not impulse.",
  "I stay focused when others spiral.",
  "I am in control of my reactions.",

  "I don’t flinch at discomfort.",
  "I train my body to steady my mind.",
  "I don’t rush. I progress.",
  "I choose restraint over regret.",
  "I don’t perform for attention.",
  "I’m calm because I’m prepared.",
  "I don’t over-explain. I execute.",
  "I stay disciplined when emotions run high.",
  "I let silence do the work.",
  "I don’t need to be loud to be powerful.",

  "I move with intent.",
  "I don’t abandon myself for connection.",
  "I stay solid when things feel uncertain.",
  "I choose control over chaos.",
  "I am patient, focused, and relentless.",
  "I don’t seek approval. I seek alignment.",
  "I don’t chase intensity. I build consistency.",
  "I don’t argue with reality. I adapt.",
  "I hold my frame under pressure.",
  "I train whether watched or not.",

  "I don’t vent. I process.",
  "I don’t seek comfort. I build capacity.",
  "I am calm because I am disciplined.",
  "I don’t romanticise weakness.",
  "I don’t follow emotion into bad decisions.",
  "I respect silence as information.",
  "I move forward without resentment.",
  "I stay clear-headed when tested.",
  "I don’t borrow confidence. I earn it.",
  "I accept discomfort as the cost of growth.",

  "I don’t rush outcomes.",
  "I don’t beg for effort.",
  "I choose structure over chaos.",
  "I stay steady when others react.",
  "I don’t chase closure.",
  "I don’t repeat cycles.",
  "I train my nervous system to stay calm.",
  "I keep my standards high and my emotions contained.",
  "I don’t overcommit. I stay deliberate.",
  "I act like a man who trusts himself.",

  "I don’t explain boundaries.",
  "I don’t seek intensity from unstable places.",
  "I move at my own pace.",
  "I don’t leak power through emotion.",
  "I stay disciplined when no one is watching.",
  "I choose restraint as strength.",
  "I don’t chase attention.",
  "I don’t react to disrespect.",
  "I stay focused on what I control.",
  "I am unshakeable."
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
// --------------------
// Daily Reminder Logic
// --------------------

const notifyBtn = document.getElementById("notify");
const reminderPanel = document.getElementById("reminderPanel");
const permBtn = document.getElementById("permBtn");
const saveBtn = document.getElementById("saveRemindersBtn");
const statusEl = document.getElementById("reminderStatus");

const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const t3 = document.getElementById("t3");

notifyBtn?.addEventListener("click", () => {
  reminderPanel.style.display =
    reminderPanel.style.display === "none" ? "block" : "none";
});

permBtn?.addEventListener("click", async () => {
  const result = await Notification.requestPermission();
  statusEl.textContent =
    result === "granted"
      ? "Notifications enabled ✓"
      : "Notifications blocked";
});

saveBtn?.addEventListener("click", () => {
  if (Notification.permission !== "granted") {
    statusEl.textContent = "Enable notifications first";
    return;
  }

  const times = [t1.value, t2.value, t3.value];
  localStorage.setItem("unshakable_reminder_times", JSON.stringify(times));

  statusEl.textContent = "Saved ✓ (notifications fire when app is opened)";
});
