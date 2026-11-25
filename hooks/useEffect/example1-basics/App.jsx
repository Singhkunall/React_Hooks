/**
 * @file App.jsx
 * @description Example 1 — The Basics of useEffect
 *
 * WHAT THIS TEACHES:
 *   - How useEffect runs after every render (no dependency array)
 *   - How useEffect runs only once on mount (empty dependency array [])
 *   - How useEffect runs when a specific value changes ([dep])
 *   - How cleanup functions prevent memory leaks
 *   - How to update document.title as a side effect
 *
 * HOW TO RUN:
 *   1. Make sure you have a React project set up (e.g. via Vite or Create React App)
 *   2. Replace the contents of your src/App.jsx with this file
 *   3. Run: npm run dev (or npm start)
 *   4. Open the browser console to see effect logs
 *
 * @author   React Hooks Learning Module
 * @version  1.0.0
 */

import React, { useState, useEffect } from "react"; // Import React plus the two hooks we need

// ─────────────────────────────────────────────
// Styles — defined outside the component so they
// are not recreated on every render
// ─────────────────────────────────────────────
const styles = {                                       // Plain JS object for inline styles
  container: {                                         // Wrapper styles
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Clean font stack
    maxWidth: "600px",                                 // Don't stretch too wide on large screens
    margin: "2rem auto",                               // Center horizontally with top/bottom spacing
    padding: "0 1rem",                                 // Horizontal padding on small screens
  },
  card: {                                              // Card (section) styles
    border: "1px solid #e0e0e0",                       // Light grey border
    borderRadius: "12px",                              // Rounded corners
    padding: "1.5rem",                                 // Inner spacing
    marginBottom: "1.5rem",                            // Space between cards
    background: "#ffffff",                             // White background
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",           // Subtle drop shadow
  },
  button: {                                            // Primary button styles
    padding: "0.5rem 1.25rem",                         // Comfortable click area
    fontSize: "1rem",                                  // Readable font size
    cursor: "pointer",                                 // Show pointer cursor on hover
    border: "none",                                    // Remove default border
    borderRadius: "6px",                               // Slightly rounded
    background: "#4f46e5",                             // Indigo color
    color: "#fff",                                     // White text
    marginRight: "0.75rem",                            // Space between buttons
  },
  resetButton: {                                       // Reset button styles (secondary)
    padding: "0.5rem 1.25rem",                         // Same size as primary
    fontSize: "1rem",                                  // Same font size
    cursor: "pointer",                                 // Pointer cursor
    border: "1px solid #ccc",                          // Visible border
    borderRadius: "6px",                               // Rounded
    background: "#f9f9f9",                             // Light grey background
    color: "#333",                                     // Dark text
  },
  badge: {                                             // Log count badge
    display: "inline-block",                           // Inline so it sits next to text
    background: "#4f46e5",                             // Indigo background
    color: "#fff",                                     // White text
    borderRadius: "999px",                             // Pill shape
    padding: "0.1rem 0.6rem",                          // Tight padding
    fontSize: "0.85rem",                               // Slightly smaller text
    marginLeft: "0.5rem",                              // Space from label
  },
  log: {                                               // Log list styles
    background: "#1e1e1e",                             // Dark background (like a terminal)
    color: "#d4d4d4",                                  // Light grey text
    borderRadius: "8px",                               // Rounded
    padding: "1rem",                                   // Inner padding
    fontFamily: "monospace",                           // Monospace font for logs
    fontSize: "0.85rem",                               // Slightly smaller
    maxHeight: "180px",                                // Don't let it grow too tall
    overflowY: "auto",                                 // Scroll if there are many lines
    listStyle: "none",                                 // Remove bullet points
    margin: 0,                                         // Remove default margin
    paddingLeft: 0,                                    // Remove default padding
  },
  logItem: {                                           // Individual log entry
    borderBottom: "1px solid #333",                    // Separator line
    paddingBottom: "0.3rem",                           // Small spacing below
    marginBottom: "0.3rem",                            // Small margin below
  },
  hint: {                                              // Hint/info text styles
    fontSize: "0.85rem",                               // Smaller than body text
    color: "#666",                                     // Grey color
    marginTop: "0.5rem",                               // Space above
    fontStyle: "italic",                               // Italicize for distinction
  },
  timer: {                                             // Timer display styles
    fontSize: "3rem",                                  // Large number
    fontWeight: "bold",                                // Bold
    color: "#4f46e5",                                  // Indigo
    display: "block",                                  // Block so it's on its own line
    textAlign: "center",                               // Centered
    margin: "0.5rem 0",                                // Top/bottom spacing
  },
  counterDisplay: {                                    // Counter number display
    fontSize: "2rem",                                  // Large number
    fontWeight: "bold",                                // Bold
    color: "#4f46e5",                                  // Indigo
    display: "block",                                  // Block
    margin: "0.75rem 0",                               // Spacing
  },
};

// ─────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────
function App() {                                       // Define the main component function

  // ── State Declarations ──────────────────────
  const [count, setCount] = useState(0);               // count: how many times the button was clicked; starts at 0
  const [seconds, setSeconds] = useState(0);           // seconds: how long since the component mounted; starts at 0
  const [logs, setLogs] = useState([]);                // logs: an array of strings we show in the on-screen log panel

  // ─────────────────────────────────────────────────────────────────────
  // Helper: add a timestamped message to the on-screen log panel
  // We define this BEFORE the effects that use it
  // ─────────────────────────────────────────────────────────────────────
  const addLog = (message) => {                        // Takes a message string
    const time = new Date().toLocaleTimeString();      // Get the current time as a readable string
    setLogs(prev => [                                  // Update logs state using functional form
      `[${time}] ${message}`,                          // Prepend new log entry with timestamp
      ...prev,                                         // Keep all previous log entries
    ].slice(0, 20));                                   // Cap at 20 entries to avoid infinite growth
  };

  // ─────────────────────────────────────────────────────────────────────
  // Effect 1: Runs ONCE on mount (empty dependency array)
  // Purpose: Show when the component first appears on screen
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {                                    // Start Effect 1
    addLog("🟢 Component mounted! (empty deps [])");   // Log the mount event
    document.title = "useEffect Demo";                 // Set the browser tab title on mount

    return () => {                                     // Return a cleanup function
      addLog("🔴 Component will unmount! Cleanup ran."); // Log the unmount event
      document.title = "React App";                    // Reset the tab title when component is gone
    };
  }, []);                                              // ← Empty array: run ONLY on mount (and cleanup on unmount)

  // ─────────────────────────────────────────────────────────────────────
  // Effect 2: Runs whenever `count` changes
  // Purpose: Demonstrate a dependency-based effect
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {                                    // Start Effect 2
    if (count === 0) return;                           // Skip on initial mount (count starts at 0)
    addLog(`🔵 count changed to ${count} (deps: [count])`); // Log the change
    document.title = `Count is ${count}`;              // Update tab title to reflect current count
  }, [count]);                                         // ← Re-run whenever `count` changes

  // ─────────────────────────────────────────────────────────────────────
  // Effect 3: Sets up an interval timer (runs once on mount)
  // Purpose: Show how to handle timers and cleanup
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {                                    // Start Effect 3
    addLog("⏱️  Timer started (effect with [])");       // Log that the timer is starting

    const intervalId = setInterval(() => {             // Start a repeating interval
      setSeconds(prev => prev + 1);                    // Increment seconds using functional update (avoids stale closure)
    }, 1000);                                          // Fire every 1000ms = 1 second

    return () => {                                     // Return a cleanup function
      clearInterval(intervalId);                       // Clear the interval when component unmounts
      addLog("⏱️  Timer cleared in cleanup!");           // Log that the timer was cleared
    };
  }, []);                                              // ← Empty array: set up once on mount, tear down on unmount

  // ─────────────────────────────────────────────────────────────────────
  // Effect 4: Runs after EVERY render (no dependency array)
  // Purpose: Show what "no deps array" means
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {                                    // Start Effect 4 — no dependency array!
    // This runs after EVERY render, no matter what changed
    // (We only log this in a ref-guarded way to avoid log spam in this demo)
  });                                                  // ← No array at all: runs after every render

  // ─────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────
  return (                                             // Start returning JSX
    <div style={styles.container}>                     {/* Outer wrapper */}

      <h1 style={{ color: "#1a1a2e" }}>               {/* Page heading */}
        🪝 useEffect — The Basics
      </h1>

      <p style={{ color: "#555", lineHeight: 1.6 }}>  {/* Intro paragraph */}
        This demo shows <strong>three different dependency array patterns</strong>.
        Watch the log panel below to see which effects fire and when.
      </p>

      {/* ── Card 1: Click Counter ── */}
      <div style={styles.card}>                        {/* Card container */}
        <h2 style={{ marginTop: 0 }}>🖱️ Click Counter</h2> {/* Card heading */}
        <p>                                            {/* Explanation */}
          <code>useEffect(fn, [count])</code> — Runs every time <code>count</code> changes.
        </p>

        <span style={styles.counterDisplay}>{count}</span> {/* Show current count value */}

        <div>                                          {/* Button row */}
          <button                                      /* Increment button */
            style={styles.button}                      /* Apply button styles */
            onClick={() => setCount(c => c + 1)}       /* Increment count by 1 on click */
          >
            ➕ Increment
          </button>

          <button                                      /* Reset button */
            style={styles.resetButton}                 /* Apply secondary button styles */
            onClick={() => setCount(0)}                /* Reset count to 0 on click */
          >
            🔄 Reset
          </button>
        </div>

        <p style={styles.hint}>                        {/* Hint text */}
          Tip: Open DevTools Console — the tab title also updates!
        </p>
      </div>

      {/* ── Card 2: Timer ── */}
      <div style={styles.card}>                        {/* Card container */}
        <h2 style={{ marginTop: 0 }}>⏱️ Mount Timer</h2> {/* Card heading */}
        <p>                                            {/* Explanation */}
          <code>useEffect(fn, [])</code> — Sets up a timer once on mount. Cleanup clears it on unmount.
        </p>

        <span style={styles.timer}>{seconds}s</span>  {/* Show elapsed seconds */}

        <p style={styles.hint}>                        {/* Hint text */}
          This timer started the moment this component mounted.
          If you navigate away, the cleanup function clears the interval.
        </p>
      </div>

      {/* ── Card 3: Effect Log ── */}
      <div style={styles.card}>                        {/* Card container */}
        <h2 style={{ marginTop: 0 }}>                  {/* Card heading */}
          📋 Effect Log
          <span style={styles.badge}>{logs.length}</span> {/* Show log count as a badge */}
        </h2>
        <p>                                            {/* Explanation */}
          Real-time log of which effects have fired (newest first).
        </p>

        {logs.length === 0                             /* Conditional: show placeholder or list */
          ? <p style={styles.hint}>No logs yet. Try clicking the button!</p> /* Placeholder when empty */
          : (
            <ul style={styles.log}>                   {/* Scrollable log panel */}
              {logs.map((entry, index) => (            /* Map each log entry to a list item */
                <li                                   /* List item */
                  key={index}                         /* Unique key for React reconciliation */
                  style={styles.logItem}              /* Apply log item styles */
                >
                  {entry}                             {/* Show the log message */}
                </li>
              ))}
            </ul>
          )
        }

        <button                                        /* Clear logs button */
          style={{ ...styles.resetButton, marginTop: "0.75rem" }} /* Reuse reset style + extra top margin */
          onClick={() => setLogs([])}                  /* Clear all log entries */
        >
          🗑️ Clear Log
        </button>
      </div>

      {/* ── Card 4: Cheat Sheet ── */}
      <div style={{ ...styles.card, background: "#f0f4ff" }}> {/* Light blue card */}
        <h2 style={{ marginTop: 0 }}>📌 Quick Reference</h2> {/* Heading */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}> {/* Summary table */}
          <thead>                                      {/* Table header */}
            <tr style={{ background: "#e0e7ff" }}>    {/* Header row with light indigo background */}
              <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "1px solid #ccc" }}>Syntax</th>
              <th style={{ padding: "0.5rem", textAlign: "left", borderBottom: "1px solid #ccc" }}>When it runs</th>
            </tr>
          </thead>
          <tbody>                                      {/* Table body */}
            <tr>                                       {/* Row 1 */}
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}><code>useEffect(fn)</code></td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>After every render</td>
            </tr>
            <tr>                                       {/* Row 2 */}
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}><code>useEffect(fn, [])</code></td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>Only after first render (mount)</td>
            </tr>
            <tr>                                       {/* Row 3 */}
              <td style={{ padding: "0.5rem" }}><code>useEffect(fn, [val])</code></td>
              <td style={{ padding: "0.5rem" }}>After mount + when val changes</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>                                             /* End outer wrapper */
  );                                                   // End return
}                                                      // End App component

export default App;                                    // Export App as the default export
