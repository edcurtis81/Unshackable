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
  "I don’t chase. I choose.",
  "I don’t negotiate my worth.",
  "Silence is information. I act accordingly.",
  "I can miss them and still choose myself.",
  "I don’t beg for clarity. I create it.",
  "I trust my future self.",
  "My boundaries are love for me.",
  "I don’t chase energy that avoids me.",
  "I choose peace over patterns.",
  "I let actions speak. I move accordingly.",
  "I don’t need closure to move forward.",
  "I don’t chase. I attract.",
  "I am grounded. I am capable.",
  "I act from self-respect, not fear.",
  "I choose the long win.",
  "I don’t need to be chosen. I choose myself.",
  "Today, I hold the line.",
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
  // (keep adding if you want — but your 103 is already fine)
];

const SUBLINES = [
  "Breathe. Shoulders down. Eyes forward.",
  "Slow is strong.",
  "Calm is confidence.",
  "You’re not behind. You’re rebuilding.",
  "Self-trust beats reassurance.",
  "Control the next move.",
  "No drama. Just standards.",
  "Discipline is love in action."
];

// ---------- storage keys ----------
const LS = {
  phrases: "unshakable_phrases",
  last: "unshakable_last",
  holdDate: "unshakable_hold_date",
  holdStreak: "unshakable_hold_streak",
  reminderTimes: "unshakable_reminder_times"
};

// ---------- helpers ----------
function $(id) { return document.getElementById(id); }

function loadPhrases() {
  try {
    const raw = localStorage.getItem(LS.phrases);
    if (!raw) return DEFAULT_PHRASES.slice();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length ? arr : DEFAULT_PHRASES.slice();
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
  if (max > 1 && idx === last) idx = (idx + 1) % max;
  localStorage.setItem(LS.last, String(idx));
  return idx;
}

function setQuote(text) {
  const q = $("quote");
  const sub = $("sub");
  if (q) q.textContent = text;
  if (sub) sub.textContent = SUBLINES[Math.floor(Math.random() * SUBLINES.length)];
}

function updateCount(n) {
  const el = $("count");
  if (el) el.textContent = `${n} phrases`;
}

// ---------- Hold The Line ----------
function todayKey() {
  // local day key (simple)
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function initHoldTheLineUI() {
  const yesBtn = $("yesBtn");
  const noBtn = $("noBtn");
  const status = $("holdStatus");
  const streakEl = $("streak");

  if (!yesBtn || !noBtn) return;

  function render() {
    const lastDate = localStorage.getItem(LS.holdDate) || "";
    const streak = Number(localStorage.getItem(LS.holdStreak) || 0);

    if (status) {
      status.textContent = lastDate === todayKey() ? "Marked today." : "Not marked today.";
    }
    if (streakEl) {
      streakEl.textContent = String(streak);
    }
  }

  yesBtn.onclick = () => {
    const t = todayKey();
    const lastDate = localStorage.getItem(LS.holdDate) || "";
    let streak = Number(localStorage.getItem(LS.holdStreak) || 0);

    // Only increment once per day
    if (lastDate !== t) {
      streak += 1;
      localStorage.setItem(LS.holdStreak, String(streak));
      localStorage.setItem(LS.holdDate, t);
    }
    render();
  };

  noBtn.onclick = () => {
    // No punishment, no shame — just mark the day (optional)
    localStorage.setItem(LS.holdDate, todayKey());
    render();
  };

  render();
}

// ---------- reminders (panel + simple in-app notifications) ----------
function initReminders() {
  const notifyBtn = $("notify");
  const panel = $("reminderPanel");

  const permBtn = $("permBtn");
  const saveBtn = $("saveRemindersBtn");
  const statusEl = $("reminderStatus");

  // toggle panel
  if (notifyBtn && panel) {
    notifyBtn.addEventListener("click", () => {
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
  }

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  async function requestPermission() {
    if (!("Notification" in window)) {
      setStatus("Notifications not supported on this device/browser.");
      return false;
    }
    if (Notification.permission === "granted") return true;
    const res = await Notification.requestPermission();
    return res === "granted";
  }

  if (permBtn) {
    permBtn.addEventListener("click", async () => {
      try {
        const ok = await requestPermission();
        setStatus(ok ? "Notifications enabled." : "Permission not granted.");
      } catch {
        setStatus("Could not request permission.");
      }
    });
  }

  // Save 3 times and run a lightweight checker while app is open
  function loadReminderTimes() {
    try {
      const raw = localStorage.getItem(LS.reminderTimes);
      const arr = raw ? JSON.parse(raw) : null;
      return Array.isArray(arr) ? arr : null;
    } catch {
      return null;
    }
  }

  function saveReminderTimes(arr) {
    localStorage.setItem(LS.reminderTimes, JSON.stringify(arr));
  }

  let lastFired = new Set();

  function startChecker() {
    setInterval(() => {
      const times = loadReminderTimes();
      if (!times || !times.length) return;
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const key = `${todayKey()} ${hh}:${mm}`;

      if (lastFired.has(key)) return;

      const current = `${hh}:${mm}`;
      if (times.includes(current)) {
        lastFired.add(key);
        try {
          new Notification("Unshakable", { body: "Hold the line. Stay calm. Move clean." });
        } catch {}
      }
    }, 15000); // checks every 15s while app is open
  }

  startChecker();

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const t1 = $("t1")?.value || "";
      const t2 = $("t2")?.value || "";
      const t3 = $("t3")?.value || "";

      const times = [t1, t2, t3].filter(Boolean);

      if (!times.length) {
        setStatus("Pick at least one time.");
        return;
      }

      const ok = await requestPermission();
      if (!ok) {
        setStatus("Enable notifications first.");
        return;
      }

      saveReminderTimes(times);
      setStatus(`Saved: ${times.join(", ")}`);
    });
  }
}

// ---------- init ----------
(function init() {
  const phrases = loadPhrases();
  updateCount(phrases.length);
  setQuote(phrases[pickIndex(phrases.length)]);
  initHoldTheLineUI();
  initReminders();

  // buttons
  $("next")?.addEventListener("click", () => {
    const p = loadPhrases();
    updateCount(p.length);
    setQuote(p[pickIndex(p.length)]);
  });

  $("copy")?.addEventListener("click", async () => {
    const text = $("quote")?.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      if ($("sub")) $("sub").textContent = "Copied. Use it.";
    } catch {
      if ($("sub")) $("sub").textContent = "Copy failed.";
    }
  });

  // IMPORTANT: "Edit phrases" intentionally disabled for this build.
})();
