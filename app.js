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
