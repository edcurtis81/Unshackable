// ============================
// Unshakable – app.js (clean)
// ============================

const DEFAULT_PHRASES = [
  "I lead myself. That’s power.",
  "Discipline first. Feelings second.",
  "I don’t chase reassurance. I choose self-respect.",
  "I don’t negotiate my standards.",
  "I don’t beg. I build.",
  "Silence doesn’t shake me. I stay steady.",
  "I can miss them and still choose myself.",
  "I respond with calm, not craving.",
  "I don’t react. I decide.",
  "I don’t need closure to move forward.",
  "I don’t chase. I execute.",
  "My emotions don’t drive. I drive.",
  "I move on evidence, not hope.",
  "I hold my line. Every day.",
  "No impulse gets a vote.",
  "I’m not available for chaos.",
  "If it costs my peace, it’s too expensive.",
  "I don’t explain my worth. I live it.",
  "I don’t argue my boundaries. I enforce them.",
  "I’m not behind. I’m rebuilding.",
  "Strong men don’t spiral. They reset.",
  "I can feel it without feeding it.",
  "I don’t chase energy that avoids me.",
  "If it’s unclear, it’s no.",
  "If it’s inconsistent, it’s not for me.",
  "I don’t tolerate disrespect — even in my own head.",
  "I don’t romanticize red flags.",
  "I don’t replay. I train.",
  "I don’t stalk. I strengthen.",
  "I don’t check. I choose peace.",
  "I don’t reach for quick relief. I build real strength.",
  "I don’t need a message to be okay.",
  "I don’t need their attention to stay solid.",
  "I don’t ask for crumbs. I eat properly.",
  "I refuse to be the man who begs.",
  "I refuse to be led by anxiety.",
  "I don’t chase a feeling. I follow a plan.",
  "I don’t worship chemistry. I respect character.",
  "I choose standards over sparks.",
  "I choose the gym over rumination.",
  "One workout is a reset button.",
  "Sweat clears the noise.",
  "Every rep is a vote for the man I’m becoming.",
  "I train even when I don’t feel like it.",
  "My mood doesn’t control my schedule.",
  "I don’t need motivation. I need movement.",
  "Consistency is my love language to myself.",
  "My body obeys my standards.",
  "I don’t skip. I show up.",
  "I don’t drift. I direct.",
  "I keep promises to myself.",
  "My routine is my protection.",
  "I choose early nights over late regrets.",
  "I choose protein over comfort eating.",
  "I choose water over numbing.",
  "I choose steps over scrolling.",
  "I choose strength over stories.",
  "I am built through repetition.",
  "I am calm because I am trained.",
  "Calm is confidence.",
  "Quiet is control.",
  "Control is strength.",
  "I stay composed under pressure.",
  "I breathe first. Then I act.",
  "Shoulders down. Jaw unclenched. Eyes forward.",
  "Slow is strong.",
  "I don’t escalate. I exit.",
  "I don’t argue with disrespect.",
  "I don’t audition for love.",
  "I don’t chase people who can’t meet me.",
  "I don’t prove myself to anyone.",
  "I don’t compete for attention.",
  "I don’t reward mixed signals.",
  "I don’t tolerate hot-and-cold.",
  "I don’t accept confusion as a relationship.",
  "I trust patterns, not promises.",
  "Words are cheap. Consistency is rare.",
  "I let actions speak. I move accordingly.",
  "I’m not hard to love. They were not ready.",
  "I can care and still walk away.",
  "Love doesn’t require self-abandonment.",
  "I choose peace over potential.",
  "I don’t build fantasies. I build facts.",
  "I don’t give my power to a notification.",
  "No reply is still information.",
  "I don’t break my focus for someone’s mood.",
  "My attention is earned.",
  "My time is expensive.",
  "My standards are non-negotiable.",
  "I don’t fold when I feel lonely.",
  "I don’t text from weakness.",
  "I don’t call for relief.",
  "I don’t send paragraphs for closure.",
  "I don’t chase clarity from someone unclear.",
  "I can sit in discomfort and stay solid.",
  "I can handle uncertainty without collapsing.",
  "I don’t fear distance. I respect it.",
  "I don’t fear endings. I fear staying small.",
  "I don’t shrink to keep someone.",
  "I don’t tolerate disrespect to avoid being alone.",
  "I am grounded. I am capable.",
  "I act from self-respect, not fear.",
  "I choose the long win.",
  "I don’t need to be chosen. I choose myself.",
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
