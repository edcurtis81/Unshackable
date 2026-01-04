// ============================
// Unshakable – app.js (clean)
// ============================

const DEFAULT_PHRASES = [
  "I don’t chase reassurance. I choose self-respect.",
"I lead myself. That’s power.",
"Discipline first. Feelings later.",
"I don’t negotiate my worth.",
"Silence isn’t rejection. It’s information.",
"I can miss them and still choose myself.",
"I don’t beg for clarity. I create it.",
"I move on without permission.",
"Calm is control.",
"My standards aren’t arrogance. They’re protection.",
"I don’t argue for love.",
"I don’t fear distance. I use it.",
"Consistency is the language I respond to.",
"I act. I don’t spiral.",
"Emotion is data, not a driver.",
"I don’t react. I respond.",
"Self-respect is my baseline.",
"I don’t chase energy that avoids me.",
"I don’t perform for attention.",
"I don’t prove my value. I live it.",
"I choose the long win.",
"I don’t seek closure. I build momentum.",
"Let actions speak. I move accordingly.",
"My focus is my edge.",
"I train even when I don’t feel like it.",
"I show up. That’s the deal.",
"I don’t need motivation. I have standards.",
"Work first. Talk later.",
"Discipline is how I protect my future.",
"I don’t indulge weakness. I correct it.",
"I don’t text for relief.",
"I don’t scroll for comfort.",
"I don’t stalk what hurt me.",
"I don’t reopen doors I closed for a reason.",
"I don’t romanticise disrespect.",
"I don’t confuse chemistry with safety.",
"I don’t chase highs. I build stability.",
"I don’t need to be chosen. I choose myself.",
"I don’t plead. I pivot.",
"I don’t explain my boundaries twice.",
"I don’t reward inconsistency.",
"I don’t tolerate mixed signals.",
"I don’t accept crumbs.",
"I don’t chase. I attract.",
"I don’t force connection.",
"I don’t compete for attention.",
"I don’t get attached to potential.",
"I’m calm because I’m prepared.",
"I’m calm because I’m in control.",
"I’m steady because I train it.",
"My nervous system learns discipline.",
"I breathe. I slow down. I decide.",
"Slow is strong.",
"Quiet is strong.",
"Stillness is strength.",
"Pressure doesn’t break me. It sharpens me.",
"I don’t rush. I execute.",
"I keep my promises to myself.",
"I keep my routine no matter what.",
"Gym first. Head clear. Then decisions.",
"I don’t skip standards for feelings.",
"I don’t abandon myself for anyone.",
"I don’t chase approval.",
"I don’t chase love. I build it with the right person.",
"I don’t over-explain. I act.",
"I don’t overthink. I train.",
"I don’t seek validation. I seek results.",
"I don’t seek comfort. I seek progress.",
"I am not behind. I am rebuilding.",
"I’m building a life that doesn’t need reassurance.",
"I’m building a body that doesn’t lie.",
"I’m building a mind that doesn’t flinch.",
"I’m building peace through discipline.",
"I choose peace over patterns.",
"I choose structure over chaos.",
"I choose training over texting.",
"I choose silence over begging.",
"I choose dignity over drama.",
"I choose myself without apology.",
"I protect my energy like currency.",
"I guard my attention like a weapon.",
"I don’t give access to people who don’t show up.",
"I don’t stay where I’m not valued.",
"I don’t fear being alone. I fear being weak.",
"I’d rather be alone than disrespected.",
"I’m not for everyone. I’m for the right one.",
"I don’t panic at change. I adapt.",
"I don’t chase the past. I build the future.",
"I don’t ask for effort. I watch for it.",
"I don’t ignore red flags.",
"I don’t make excuses for disrespect.",
"Love should feel safe, not confusing.",
"If it costs my peace, it’s too expensive.",
"My peace is non-negotiable.",
"I don’t relapse into old versions of me.",
"I don’t break my own rules for a feeling.",
"I control my actions. That’s freedom.",
"I train my mind like I train my body.",
"One good decision at a time.",
"Today, I hold the line."
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
// ---------- discipline state ----------
function initHoldTheLine() {
  const today = new Date().toDateString();
  const last = localStorage.getItem("unshakable_hold_date");

  if (last !== today) {
    localStorage.setItem("unshakable_hold_date", today);
    localStorage.setItem(
      "unshakable_hold_message",
      "Today, I hold the line."
    );
  }
}
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
initHoldTheLine();
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
