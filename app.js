// ============================
// Unshakable — app.js (clean)
// - No duplicate blocks
// - Daily reminder panel toggles reliably
// - Edit phrases disabled (safe)
// ============================

// ---------- content ----------
const DEFAULT_PHRASES = [
"I lead myself. That’s power.",
    "Discipline first. Feelings later.",
    "Calm is control.",
    "I don’t chase reassurance. I choose self-respect.",
    "I don’t negotiate my worth.",
    "Silence isn’t rejection. It’s information.",
    "I can miss them and still choose myself.",
    "I don’t beg for clarity. I create it.",
    "I move on without permission.",
    "My standards aren’t arrogance. They’re protection.",
    "I don’t argue for love.",
    "I don’t fear being alone. I fear being weak.",
    "I’d rather be alone than disrespected.",
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
    "Today, I hold the line.",
    // Gym / discipline / ruthless calm
    "I don’t feel like it — I do it anyway.",
    "No mood decides my standards.",
    "I don’t get pulled into chaos. I stay precise.",
    "My emotions don’t drive. I do.",
    "I don’t chase. I replace.",
    "I don’t need closure. I need discipline.",
    "I don’t react. I respond.",
    "If it’s not aligned, it’s not allowed.",
    "I don’t seek comfort. I build resilience.",
    "Consistency is my personality now.",
    "I don’t entertain what disrespects me.",
    "I walk away without explaining twice.",
    "I choose the long win.",
    "I’m not behind. I’m rebuilding.",
    "My life gets better when I stop negotiating with weakness.",
    "I don’t argue with avoidance. I move on.",
    "I don’t chase energy that avoids me.",
    "I hold standards, not grudges.",
    "Silence doesn’t shake me. I stay steady.",
    "I don’t prove myself. I improve myself.",
    "I don’t shrink to be chosen.",
    "I don’t overthink. I execute.",
    "I don’t perform for attention. I perform for progress.",
    "I don’t need them to understand. I need me to respect me.",
    "If they wanted to, they would. I act accordingly.",
    "I don’t trade dignity for connection.",
    "I choose dignity over drama.",
    "I protect my focus like it’s money.",
    "I don’t scroll my pain. I train it out.",
    "Hard days don’t get a vote.",
    "Discipline is my emotional regulation.",
    "I don’t chase feelings. I follow principles.",
    "I don’t fantasize. I build.",
    "I don’t beg. I level up.",
    "I don’t soften boundaries to save situations.",
    "I don’t ignore patterns — I respect them.",
    "I don’t tolerate confusion. I choose clarity.",
    "I don’t bargain with disrespect.",
    "I’m calm because I’m decided.",
    "I don’t need validation. I need routine.",
    "I don’t chase comfort. I chase capacity.",
    "I don’t talk myself out of standards.",
    "I don’t break my streak for nostalgia.",
    "I don’t get used. I get better.",
    "I don’t wait to feel ready. I act ready.",
    "I don’t romanticize what hurt me.",
    "I don’t fix what keeps breaking me.",
    "I don’t return to what I outgrew.",
    "I don’t confuse intensity with love.",
    "I don’t chase chemistry over character.",
    "I don’t accept breadcrumbs.",
    "I don’t stay where I’m tolerated.",
    "I’m not reactive. I’m disciplined.",
    "My boundaries are self-respect in action.",
    "I don’t compete for attention.",
    "I don’t lose sleep over people who lose me.",
    "I don’t negotiate with my future.",
    "I don’t abandon myself for anyone.",
    "I act from self-respect, not fear.",
    "My behavior is my power.",
    "I’m built for consistency.",
    "I don’t fold when it’s quiet.",
    "I don’t chase reassurance. I train certainty.",
    "I don’t beg to be chosen. I choose myself.",
    "I’m steady. I’m dangerous to old habits.",
    "I don’t break alignment for attachment.",
    "I don’t reach back. I move forward.",
    "I don’t go where I’m not valued.",
    "I don’t fix avoidant patterns. I exit them.",
    "I don’t replay. I rebuild.",
    "I don’t chase what runs.",
    "I don’t need their reply to keep my standards.",
    "I don’t act on anxiety. I act on principle.",
    "I don’t collapse. I compose.",
    "I don’t spiral. I breathe and execute.",
    "I don’t need permission to move on.",
    "I don’t miss them enough to disrespect myself.",
    "I don’t trade peace for potential.",
    "I don’t chase. I close doors.",
    "I don’t wait for clarity. I create it.",
    "I don’t keep one foot in the past.",
    "I’m calm. I’m capable.",
    "I don’t live on hope. I live on habits.",
    "I don’t chase love. I live clean.",
    "I don’t react to triggers. I regulate them.",
    "I choose routine over rumination.",
    "I don’t perform emotional labor for inconsistency.",
    "I don’t beg for effort. I require it.",
    "I don’t accept confusion as love.",
    "I don’t get dragged into drama.",
    "I don’t reach for what rejects me.",
    "I’m not fragile. I’m focused.",
    "I’m not angry. I’m done.",
    "I don’t need to be chosen. I choose myself.",
    "I hold the line."
];

// ---------- storage keys ----------
const SUBLINES = [
  "Breathe. Shoulders down. Eyes forward.",
  "Slow is strong.",
  "Calm is confidence.",
  "You’re not behind. You’re rebuilding.",
  "Self-trust beats reassurance.",
];

const LS = {
  phrases: "unshakable_phrases",
  last: "unshakable_last",
  reminderTimes: "unshakable_reminder_times",
  line: "unshakable_line_state",
};

// ---------- phrases ----------
function loadPhrases() {
  try {
    const raw = localStorage.getItem(LS.phrases);
    const arr = raw ? JSON.parse(raw) : null;
    if (Array.isArray(arr) && arr.length) return arr;
  } catch {}
  return DEFAULT_PHRASES.slice();
}

function savePhrases(arr) {
  localStorage.setItem(LS.phrases, JSON.stringify(arr));
}

function pickIndex(max) {
  const last = Number(localStorage.getItem(LS.last) || -1);
  let idx = Math.floor(Math.random() * max);
  if (idx === last) idx = (idx + 1) % max;
  localStorage.setItem(LS.last, String(idx));
  return idx;
}

function setQuote(text) {
  const q = document.getElementById("quote");
  const sub = document.getElementById("sub");
  if (q) q.textContent = text;
  if (sub) sub.textContent = SUBLINES[Math.floor(Math.random() * SUBLINES.length)];
}

function updateCount(n) {
  const el = document.getElementById("count");
  if (el) el.textContent = String(n);
}

// ---------- hold the line ----------
function loadLineState() {
  try {
    const raw = localStorage.getItem(LS.line);
    return raw ? JSON.parse(raw) : { lastMarked: "", streak: 0 };
  } catch {
    return { lastMarked: "", streak: 0 };
  }
}

function saveLineState(state) {
  localStorage.setItem(LS.line, JSON.stringify(state));
}

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function initHoldTheLineUI() {
  const yesBtn = document.getElementById("yes");
  const noBtn = document.getElementById("no");
  const status = document.getElementById("lineStatus");
  const daysEl = document.getElementById("days");

  const state = loadLineState();
  const tk = todayKey();

  function render() {
    if (daysEl) daysEl.textContent = String(state.streak);
    if (!status) return;

    if (state.lastMarked === tk) {
      status.textContent = "Marked today.";
    } else {
      status.textContent = "Not marked today.";
    }
  }

  yesBtn?.addEventListener("click", () => {
    if (state.lastMarked !== tk) {
      state.streak += 1;
      state.lastMarked = tk;
      saveLineState(state);
    }
    render();
  });

  noBtn?.addEventListener("click", () => {
    // no punishment. no shame. just reality.
    state.lastMarked = tk;
    saveLineState(state);
    render();
  });

  render();
}

// ---------- daily reminder (UI toggle + save times) ----------
function initReminderUI() {
  const notifyBtn = document.getElementById("notify");
  const panel = document.getElementById("reminderPanel");
  const permBtn = document.getElementById("permBtn");
  const saveBtn = document.getElementById("saveRemindersBtn");
  const statusEl = document.getElementById("reminderStatus");

  const t1 = document.getElementById("t1");
  const t2 = document.getElementById("t2");
  const t3 = document.getElementById("t3");

  // If you removed the reminder panel from HTML, do nothing.
  if (!notifyBtn || !panel) return;

  // start hidden (safe)
  if (!panel.style.display) panel.style.display = "none";

  notifyBtn.addEventListener("click", () => {
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });

  permBtn?.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      if (statusEl) statusEl.textContent = "Notifications not supported on this device.";
      return;
    }
    const result = await Notification.requestPermission();
    if (statusEl) statusEl.textContent = `Permission: ${result}`;
  });

  // restore saved times
  try {
    const saved = JSON.parse(localStorage.getItem(LS.reminderTimes) || "null");
    if (saved?.t1 && t1) t1.value = saved.t1;
    if (saved?.t2 && t2) t2.value = saved.t2;
    if (saved?.t3 && t3) t3.value = saved.t3;
  } catch {}

  saveBtn?.addEventListener("click", () => {
    const data = {
      t1: t1?.value || "",
      t2: t2?.value || "",
      t3: t3?.value || "",
    };
    localStorage.setItem(LS.reminderTimes, JSON.stringify(data));
    if (statusEl) statusEl.textContent = "Saved.";
  });
}

// ---------- optional copy (won’t break if you delete the button) ----------
function initCopy() {
  const copyBtn = document.getElementById("copy");
  copyBtn?.addEventListener("click", async () => {
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
}

// ---------- init ----------
let phrases = loadPhrases();
updateCount(phrases.length);
setQuote(phrases[pickIndex(phrases.length)]);

document.getElementById("next")?.addEventListener("click", () => {
  phrases = loadPhrases();
  updateCount(phrases.length);
  setQuote(phrases[pickIndex(phrases.length)]);
});

initHoldTheLineUI();
initReminderUI();
initCopy();

// ---------- service worker ----------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
