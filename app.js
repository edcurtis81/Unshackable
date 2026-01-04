// ============================
// Unshakable – app.js (clean + stable)
// - No duplicate const declarations
// - Daily reminder panel toggle works
// - "Edit phrases" button hidden/disabled
// - Hold-the-line counter works
// ============================

(() => {
  "use strict";

  // ---------- helpers ----------
  const $ = (id) => document.getElementById(id);

  // Try multiple ids (so we don't break if HTML uses slightly different names)
  const firstEl = (...ids) => {
    for (const id of ids) {
      const el = $(id);
      if (el) return el;
    }
    return null;
  };

  const todayStr = () => new Date().toISOString().slice(0, 10);

  // ---------- phrases ----------
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

  const SUBLINES = [
    "Breathe. Shoulders down. Eyes forward.",
    "Slow is strong.",
    "Calm is confidence.",
    "You’re not behind. You’re rebuilding.",
    "Self-trust beats reassurance."
  ];

  const LS = {
    phrases: "unshakable_phrases",
    lastIdx: "unshakable_last_idx",
    reminderTimes: "unshakable_reminder_times",
    holdDate: "unshakable_hold_date",
    holdResult: "unshakable_hold_result",
    holdCount: "unshakable_hold_count"
  };

  const loadPhrases = () => {
    try {
      const raw = localStorage.getItem(LS.phrases);
      const arr = raw ? JSON.parse(raw) : null;
      if (Array.isArray(arr) && arr.length) return arr;
    } catch {}
    return DEFAULT_PHRASES.slice();
  };

  const pickIndex = (max) => {
    let last = Number(localStorage.getItem(LS.lastIdx));
    if (!Number.isFinite(last)) last = -1;
    let idx = Math.floor(Math.random() * max);
    if (max > 1 && idx === last) idx = (idx + 1) % max;
    localStorage.setItem(LS.lastIdx, String(idx));
    return idx;
  };

  const setQuote = (text) => {
    const quoteEl = $("quote");
    const subEl = $("sub");
    if (quoteEl) quoteEl.textContent = text;
    if (subEl) subEl.textContent = SUBLINES[Math.floor(Math.random() * SUBLINES.length)];
  };

  const setPhraseCount = (n) => {
    // If your HTML has an element with id="count", it will show phrases count.
    const countEl = firstEl("count", "phraseCount");
    if (countEl) countEl.textContent = `${n} phrases`;
  };

  // ---------- Hold the line ----------
  const initHoldTheLine = () => {
    const yesBtn = firstEl("yes", "yesBtn", "holdYes");
    const noBtn = firstEl("no", "noBtn", "holdNo");
    const statusEl = firstEl("holdStatus", "markStatus");
    const daysEl = firstEl("days", "daysUnshakable", "holdDays");

    const render = () => {
      const savedDate = localStorage.getItem(LS.holdDate);
      const savedResult = localStorage.getItem(LS.holdResult); // "yes" | "no" | null
      const count = Number(localStorage.getItem(LS.holdCount) || "0");

      if (daysEl) daysEl.textContent = String(count);

      if (!statusEl) return;

      if (savedDate !== todayStr() || !savedResult) {
        statusEl.textContent = "Not marked today.";
        return;
      }

      statusEl.textContent = savedResult === "yes"
        ? "Marked: YES ✓"
        : "Marked: NO.";
    };

    const mark = (result) => {
      const d = todayStr();
      localStorage.setItem(LS.holdDate, d);
      localStorage.setItem(LS.holdResult, result);

      if (result === "yes") {
        const count = Number(localStorage.getItem(LS.holdCount) || "0") + 1;
        localStorage.setItem(LS.holdCount, String(count));
      }
      render();
    };

    if (yesBtn) yesBtn.addEventListener("click", () => mark("yes"));
    if (noBtn) noBtn.addEventListener("click", () => mark("no"));

    render();
  };

  // ---------- Daily reminders (panel toggle + permission + save times) ----------
  const initReminders = () => {
    const notifyBtn = $("notify");                 // "Daily reminder" button
    const panel = $("reminderPanel");              // hidden panel
    const permBtn = $("permBtn");                  // "Enable notifications"
    const saveBtn = $("saveRemindersBtn");         // "Save 3 times"
    const statusEl = $("reminderStatus");          // status text
    const t1 = $("t1");
    const t2 = $("t2");
    const t3 = $("t3");

    // Toggle panel
    if (notifyBtn && panel) {
      notifyBtn.addEventListener("click", () => {
        const isOpen = panel.style.display === "block";
        panel.style.display = isOpen ? "none" : "block";
      });
    }

    // Load saved times into inputs
    try {
      const raw = localStorage.getItem(LS.reminderTimes);
      const times = raw ? JSON.parse(raw) : null;
      if (Array.isArray(times) && times.length >= 3) {
        if (t1) t1.value = times[0] || t1.value;
        if (t2) t2.value = times[1] || t2.value;
        if (t3) t3.value = times[2] || t3.value;
      }
    } catch {}

    // Permission
    if (permBtn) {
      permBtn.addEventListener("click", async () => {
        if (!("Notification" in window)) {
          if (statusEl) statusEl.textContent = "Notifications not supported on this device/browser.";
          return;
        }
        const res = await Notification.requestPermission();
        if (statusEl) statusEl.textContent = res === "granted"
          ? "Notifications enabled ✓"
          : "Notifications blocked";
      });
    }

    // Save
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const times = [
          t1?.value || "08:30",
          t2?.value || "13:00",
          t3?.value || "20:30"
        ];
        localStorage.setItem(LS.reminderTimes, JSON.stringify(times));

        // Important note: without push + SW alarms, we can’t fire background notifications reliably.
        if (statusEl) {
          statusEl.textContent =
            "Saved ✓ (Note: reminders show when the app is open. Push notifications require extra setup.)";
        }
      });
    }
  };

  // ---------- buttons ----------
  const initButtons = () => {
    let phrases = loadPhrases();

    setPhraseCount(phrases.length);
    setQuote(phrases[pickIndex(phrases.length)]);

    // New boost
    $("next")?.addEventListener("click", () => {
      phrases = loadPhrases();
      setPhraseCount(phrases.length);
      setQuote(phrases[pickIndex(phrases.length)]);
    });

    // Copy
    $("copy")?.addEventListener("click", async () => {
      const text = $("quote")?.textContent || "";
      try {
        await navigator.clipboard.writeText(text);
        const sub = $("sub");
        if (sub) sub.textContent = "Copied. Use it.";
      } catch {
        const sub = $("sub");
        if (sub) sub.textContent = "Copy failed.";
      }
    });

    // Remove / disable "Edit phrases"
    const editBtn = $("edit");
    if (editBtn) {
      editBtn.style.display = "none"; // hides button
      editBtn.disabled = true;
    }
  };

  // ---------- init ----------
  document.addEventListener("DOMContentLoaded", () => {
    initButtons();
    initHoldTheLine();
    initReminders();
  });
})();
