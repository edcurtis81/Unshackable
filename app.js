// ============================
// Unshakable – app.js (clean, no duplicates)
// ============================

const DEFAULT_PHRASES = [
  "I lead myself. That’s power.",
  "Discipline first. Feelings later.",
  "Calm is control.",
  "I don’t chase. I choose.",
  "I don’t negotiate my worth.",
  "Silence is information. I act accordingly.",
  "I can miss them and still choose myself.",
  "I don’t beg for clarity. I create it.",
  "I move on without permission.",
  "My standards protect my peace.",
  "I don’t argue for love.",
  "I don’t reward inconsistency.",
  "I don’t tolerate mixed signals.",
  "I don’t accept crumbs.",
  "I don’t perform for attention.",
  "Emotion is data, not a driver.",
  "I don’t react. I respond.",
  "I breathe. I slow down. I decide.",
  "Slow is strong.",
  "Quiet is strong.",
  "Stillness is strength.",
  "Pressure sharpens me.",
  "I don’t rush. I execute.",
  "I keep promises to myself.",
  "Routine beats mood.",
  "Gym first. Head clear. Then decisions.",
  "I don’t skip standards for feelings.",
  "I don’t abandon myself for anyone.",
  "I don’t text for relief.",
  "I don’t scroll for comfort.",
  "I don’t stalk what hurt me.",
  "I don’t reopen doors I closed for a reason.",
  "I don’t romanticise disrespect.",
  "I don’t confuse chemistry with safety.",
  "I don’t chase highs. I build stability.",
  "I don’t plead. I pivot.",
  "I don’t explain my boundaries twice.",
  "I protect my energy like currency.",
  "I guard my attention like a weapon.",
  "I don’t give access to people who don’t show up.",
  "I don’t stay where I’m not valued.",
  "I’d rather be alone than disrespected.",
  "I’m not for everyone. I’m for the right one.",
  "I don’t panic at change. I adapt.",
  "I don’t chase the past. I build the future.",
  "I don’t ask for effort. I watch for it.",
  "I don’t ignore red flags.",
  "If it costs my peace, it’s too expensive.",
  "My peace is non-negotiable.",
  "I don’t relapse into old versions of me.",
  "I don’t break my rules for a feeling.",
  "I control my actions. That’s freedom.",
  "I train my mind like I train my body.",
  "One good decision at a time.",
  "Today, I hold the line.",
  "I do the hard thing first.",
  "I don’t negotiate with weakness.",
  "I don’t chase reassurance. I choose self-respect.",
  "I choose the long win.",
  "I don’t need closure to move forward.",
  "Let actions speak. I move accordingly.",
  "My focus is my edge.",
  "I train even when I don’t feel like it.",
  "I show up. That’s the deal.",
  "I don’t need motivation. I have standards.",
  "Work first. Talk later.",
  "Discipline protects my future.",
  "I don’t indulge spirals. I interrupt them.",
  "I don’t overthink. I execute.",
  "I don’t seek validation. I seek results.",
  "I don’t seek comfort. I seek progress.",
  "I am not behind. I am rebuilding.",
  "I’m building a life that doesn’t need reassurance.",
  "I’m building a body that doesn’t lie.",
  "I’m building a mind that doesn’t flinch.",
  "I build peace through discipline.",
  "I choose structure over chaos.",
  "I choose training over texting.",
  "I choose silence over begging.",
  "I choose dignity over drama.",
  "I choose myself without apology.",
  "I don’t compete for attention.",
  "I don’t get attached to potential.",
  "I’m calm because I’m prepared.",
  "I’m calm because I’m in control.",
  "I’m steady because I train it.",
  "My nervous system learns discipline.",
  "I don’t chase approval.",
  "I don’t force connection.",
  "I don’t make excuses for disrespect.",
  "Love should feel safe, not confusing.",
  "I don’t stay in uncertainty by choice.",
  "I handle my emotions like a man: calmly.",
  "No reply is a reply. I move.",
  "I don’t bargain for consistency.",
  "I don’t reward chaos with access.",
  "I don’t explain myself to people committed to misunderstanding.",
  "I take responsibility. Then I take action.",
  "I do what I said I’d do.",
  "I don’t bend my standards to keep someone.",
  "I’d rather feel the pain than lose my self-respect.",
  "I choose calm over craving.",
  "I walk away with my head high."
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
  reminderTimes: "unshakable_reminder_times",
  holdDate: "unshakable_hold_date",
  holdMark: "unshakable_hold_mark",
  days: "unshakable_days"
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
  const q = document.getElementById("quote");
  const s = document.getElementById("sub");
  if (q) q.textContent = text;
  if (s) s.textContent = SUBLINES[Math.floor(Math.random() * SUBLINES.length)];
}
function updateCount(n) {
  const c = document.getElementById("count");
  if (c) c.textContent = `${n} phrases`;
}

// ---------- Hold the line (YES/NO + days) ----------
function todayKey() {
  return new Date().toDateString();
}

function initHoldTheLineUI() {
  const yesBtn = document.getElementById("yes");
  const noBtn = document.getElementById("no");
  const holdStatus = document.getElementById("holdStatus");
  const daysEl = document.getElementById("days");

  // If your HTML ids differ, this won’t crash — it just won’t render.
  const days = Number(localStorage.getItem(LS.days) || 0);
  if (daysEl) daysEl.textContent = String(days);

  const t = todayKey();
  const lastDate = localStorage.getItem(LS.holdDate);
  const mark = localStorage.getItem(LS.holdMark); // "yes" | "no" | null

  if (lastDate !== t) {
    localStorage.setItem(LS.holdDate, t);
    localStorage.removeItem(LS.holdMark);
    if (holdStatus) holdStatus.textContent = "Not marked today.";
  } else {
    if (holdStatus) {
      holdStatus.textContent =
        mark === "yes" ? "Marked YES today." :
        mark === "no"  ? "Marked NO today." :
        "Not marked today.";
    }
  }

  function setMark(value) {
    const currentDate = todayKey();
    const last = localStorage.getItem(LS.holdDate);
    if (last !== currentDate) localStorage.setItem(LS.holdDate, currentDate);

    const prev = localStorage.getItem(LS.holdMark);
    if (prev) return; // already marked today, don’t double count

    localStorage.setItem(LS.holdMark, value);

    if (value === "yes") {
      const nextDays = Number(localStorage.getItem(LS.days) || 0) + 1;
      localStorage.setItem(LS.days, String(nextDays));
      if (daysEl) daysEl.textContent = String(nextDays);
      if (holdStatus) holdStatus.textContent = "Marked YES today.";
    } else {
      if (holdStatus) holdStatus.textContent = "Marked NO today.";
    }
  }

  yesBtn?.addEventListener("click", () => setMark("yes"));
  noBtn?.addEventListener("click", () => setMark("no"));
}

// ---------- init ----------
let phrases = loadPhrases();
updateCount(phrases.length);
setQuote(phrases[pickIndex(phrases.length)]);
initHoldTheLineUI();

// ---------- buttons ----------
document.getElementById("next")?.addEventListener("click", () => {
  phrases = loadPhrases();
  updateCount(phrases.length);
  setQuote(phrases[pickIndex(phrases.length)]);
});

document.getElementById("copy")?.addEventListener("click", async () => {
  const text = document.getElementById("quote")?.textContent || "";
  try {
    await navigator.clipboard.writeText(text);
    const sub = document.getElementById("sub");
    if (sub) sub.textContent = "Copied. Use it.";
  } catch {
    const sub = document.getElementById("sub");
    if (sub) sub.textContent = "Copy failed.";
  }
});

document.getElementById("edit")?.addEventListener("click", () => {
  const joined = loadPhrases().join("\n");
  const out = prompt("Edit your phrases (one per line):", joined);
  if (!out) return;
  const arr = out.split("\n").map(s => s.trim()).filter(Boolean);
  savePhrases(arr);
  phrases = loadPhrases();
  updateCount(phrases.length);
  setQuote(phrases[pickIndex(phrases.length)]);
});
const notifyBtn = document.getElementById("notify");
const reminderPanel = document.getElementById("reminderPanel");

if (notifyBtn && reminderPanel) {
  notifyBtn.onclick = () => {
    reminderPanel.style.display =
      reminderPanel.style.display === "block" ? "none" : "block";
  };
}

// ---------- reminders (ONE version only) ----------
const notifyBtn = document.getElementById("notify");
const panel = document.getElementById("reminderPanel");
const permBtn = document.getElementById("permBtn");
const saveBtn = document.getElementById("saveRemindersBtn");
const statusEl = document.getElementById("reminderStatus");

notifyBtn?.addEventListener("click", () => {
  if (!panel) return;
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});

async function requestPermission() {
  if (!("Notification" in window)) {
    alert("Notifications not supported.");
    return false;
  }
  if (Notification.permission === "granted") return true;
  return (await Notification.requestPermission()) === "granted";
}

permBtn?.addEventListener("click", async () => {
  const ok = await requestPermission();
  if (statusEl) statusEl.textContent = ok ? "Notifications enabled ✓" : "Permission denied";
});

saveBtn?.addEventListener("click", async () => {
  const ok = await requestPermission();
  if (!ok) {
    if (statusEl) statusEl.textContent = "Enable notifications first.";
    return;
  }

  const times = [
    document.getElementById("t1")?.value,
    document.getElementById("t2")?.value,
    document.getElementById("t3")?.value
  ].filter(Boolean);

  localStorage.setItem(LS.reminderTimes, JSON.stringify(times));
  if (statusEl) statusEl.textContent = "Saved ✓ (fires while app is open)";
  scheduleReminders();
});

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
        const list = loadPhrases();
        reg.showNotification("Unshakable", {
          body: list[pickIndex(list.length)],
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
