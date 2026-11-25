/**
 * @file App.jsx
 * @description Example 3 — Advanced Patterns: Custom Hooks + Composition
 *
 * WHAT THIS TEACHES:
 *   - Building reusable custom hooks that encapsulate useEffect logic
 *   - useWindowSize: tracking browser dimensions reactively
 *   - useDebounce: delaying state updates to avoid over-firing effects
 *   - usePrevious: remembering the last render's value with useRef
 *   - useLocalStorage: persisting state across browser refreshes
 *   - useOnlineStatus: reacting to network connectivity changes
 *   - Composing multiple custom hooks in one component
 *   - How useRef differs from useState (no re-render on change)
 *
 * ADVANCED CONCEPTS:
 *   - Custom hooks are just functions that call React hooks internally
 *   - Hooks compose naturally — custom hooks can call other custom hooks
 *   - useRef + useEffect = the pattern for "latest value without re-render"
 *   - Cleanup patterns inside custom hooks
 *
 * HOW TO RUN:
 *   1. Set up a React project (Vite recommended)
 *   2. Replace src/App.jsx with this file
 *   3. npm run dev
 *   4. Try: resizing the window, typing in the search box, going offline
 *
 * @author   React Hooks Learning Module
 * @version  1.0.0
 */

import React, { useState, useEffect, useRef, useCallback } from "react"; // Import all hooks we need

// ═══════════════════════════════════════════════════════════════════════
// CUSTOM HOOK 1: useWindowSize
//
// PURPOSE: Reactively track the browser window's width and height.
// WHY A CUSTOM HOOK: Encapsulates addEventListener + cleanup so the
//   component never has to think about it.
// ═══════════════════════════════════════════════════════════════════════
function useWindowSize() {                             // Custom hook — name must start with "use"
  const [size, setSize] = useState(() => ({            // Lazy initializer: a function that returns initial state
    width: window.innerWidth,                          // Start with actual current window width
    height: window.innerHeight,                        // Start with actual current window height
  }));

  useEffect(() => {                                    // Effect: listen to resize events
    const handler = () => {                            // Resize handler function
      setSize({                                        // Update state with new window dimensions
        width: window.innerWidth,                      // Read current width from browser
        height: window.innerHeight,                    // Read current height from browser
      });
    };

    window.addEventListener("resize", handler);        // Attach the resize listener

    return () => {                                     // Cleanup: runs when component unmounts
      window.removeEventListener("resize", handler);  // Remove the listener to avoid memory leak
    };
  }, []);                                              // Empty deps: add listener once, remove on unmount

  return size;                                         // Return the size object { width, height }
}

// ═══════════════════════════════════════════════════════════════════════
// CUSTOM HOOK 2: useDebounce
//
// PURPOSE: Delay propagating a value until the user has "stopped"
//   changing it for `delayMs` milliseconds.
// WHY IT'S USEFUL: Prevents firing expensive operations (API calls,
//   heavy computations) on every single keystroke.
// PATTERN: Every time `value` changes, we cancel the old timer and
//   start a fresh one. The debounced value only updates when the
//   timer completes without being cancelled.
// ═══════════════════════════════════════════════════════════════════════
function useDebounce(value, delayMs) {                 // Takes raw value and delay in milliseconds
  const [debouncedValue, setDebouncedValue] = useState(value); // Starts equal to the input value

  useEffect(() => {                                    // Effect: manage the debounce timer
    const timerId = setTimeout(() => {                 // Schedule an update after `delayMs`
      setDebouncedValue(value);                        // Apply the new value after the delay
    }, delayMs);                                       // Delay duration

    return () => {                                     // Cleanup: cancel the timer
      clearTimeout(timerId);                           // This runs before the NEXT effect fires
    };                                                 // If value changes quickly, old timers are cleared
  }, [value, delayMs]);                                // Re-run when value or delay changes

  return debouncedValue;                               // Return the delayed value
}

// ═══════════════════════════════════════════════════════════════════════
// CUSTOM HOOK 3: usePrevious
//
// PURPOSE: Remember the value from the previous render.
// PATTERN: useRef stores a mutable value that persists across renders
//   but does NOT trigger a re-render when it changes. We update it
//   in an effect (which runs after the render), so ref.current
//   always holds the value from the PREVIOUS render during the
//   current render.
// ═══════════════════════════════════════════════════════════════════════
function usePrevious(value) {                          // Takes any value
  const ref = useRef(undefined);                       // useRef: a box that holds a value without causing re-renders

  useEffect(() => {                                    // No dependency array: runs after EVERY render
    ref.current = value;                               // Store the CURRENT value — this happens AFTER render
  });                                                  // So during the current render, ref.current = last render's value

  return ref.current;                                  // Return the stored (previous) value
}

// ═══════════════════════════════════════════════════════════════════════
// CUSTOM HOOK 4: useLocalStorage
//
// PURPOSE: Persist state to localStorage so it survives browser refresh.
// PATTERN: Combines useState (for reactive updates) with useEffect
//   (to sync state changes to localStorage as a side effect).
// BONUS: Uses a lazy initializer in useState to read from localStorage
//   on the very first render.
// ═══════════════════════════════════════════════════════════════════════
function useLocalStorage(key, initialValue) {          // Takes a storage key and default value
  const [storedValue, setStoredValue] = useState(() => { // Lazy initializer (function form of useState)
    try {                                              // Try to read from localStorage
      const item = window.localStorage.getItem(key);  // Look up the key
      return item ? JSON.parse(item) : initialValue;  // Return parsed JSON or the default
    } catch (err) {                                    // If localStorage is unavailable or JSON is malformed
      console.warn("useLocalStorage read error:", err); // Warn in console
      return initialValue;                             // Fall back to the initial value
    }
  });

  const setValue = useCallback((value) => {            // Memoized setter (stable reference = safe as a dep)
    try {                                              // Try to write
      setStoredValue(value);                           // Update React state
    } catch (err) {                                    // Handle write errors
      console.warn("useLocalStorage write error:", err); // Warn in console
    }
  }, []);                                              // No dependencies: callback is created once

  useEffect(() => {                                    // Effect: sync state → localStorage
    try {                                              // Try to write
      window.localStorage.setItem(key, JSON.stringify(storedValue)); // Serialize and store
    } catch (err) {                                    // Handle errors (e.g., storage quota exceeded)
      console.warn("useLocalStorage sync error:", err); // Warn in console
    }
  }, [key, storedValue]);                              // Re-sync when key or value changes

  return [storedValue, setValue];                      // Return [value, setter] like useState
}

// ═══════════════════════════════════════════════════════════════════════
// CUSTOM HOOK 5: useOnlineStatus
//
// PURPOSE: Reactively track whether the browser is online or offline.
// PATTERN: Listen to the browser's "online" and "offline" events,
//   which fire when network connectivity changes.
// ═══════════════════════════════════════════════════════════════════════
function useOnlineStatus() {                           // No parameters needed
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Start with the current status

  useEffect(() => {                                    // Effect: attach network listeners
    const goOnline = () => setIsOnline(true);          // Handler for coming online
    const goOffline = () => setIsOnline(false);        // Handler for going offline

    window.addEventListener("online", goOnline);       // Listen for online event
    window.addEventListener("offline", goOffline);     // Listen for offline event

    return () => {                                     // Cleanup function
      window.removeEventListener("online", goOnline);  // Remove online listener
      window.removeEventListener("offline", goOffline); // Remove offline listener
    };
  }, []);                                              // Empty deps: add once, remove on unmount

  return isOnline;                                     // Return true/false
}

// ═══════════════════════════════════════════════════════════════════════
// STYLES — defined once outside the component
// ═══════════════════════════════════════════════════════════════════════
const s = {                                            // Abbreviated name
  page: {                                              // Page wrapper
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Font stack
    maxWidth: "700px",                                 // Max width
    margin: "0 auto",                                  // Center horizontally
    padding: "2rem 1rem",                              // Comfortable padding
    minHeight: "100vh",                                // Full viewport height
    background: "#f7f8fc",                             // Light grey background
  },
  card: {                                              // Card/panel
    background: "#fff",                                // White
    border: "1px solid #e0e0e0",                       // Light border
    borderRadius: "12px",                              // Rounded corners
    padding: "1.5rem",                                 // Inner spacing
    marginBottom: "1.5rem",                            // Space between cards
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",           // Subtle shadow
  },
  code: {                                              // Inline code style
    background: "#f0f4ff",                             // Light blue background
    padding: "0.15rem 0.4rem",                         // Tight padding
    borderRadius: "4px",                               // Rounded
    fontSize: "0.9em",                                 // Slightly smaller
    fontFamily: "monospace",                           // Monospace font
    color: "#4f46e5",                                  // Indigo text
  },
  bigText: {                                           // Large value display
    fontSize: "2.5rem",                                // Large number
    fontWeight: "bold",                                // Bold
    color: "#4f46e5",                                  // Indigo
    display: "block",                                  // Block
    textAlign: "center",                               // Center
    margin: "0.5rem 0",                                // Top/bottom spacing
  },
  input: {                                             // Input field
    width: "100%",                                     // Full width
    padding: "0.6rem 0.8rem",                          // Comfortable padding
    fontSize: "1rem",                                  // Normal font size
    border: "1px solid #ccc",                          // Light border
    borderRadius: "8px",                               // Rounded
    boxSizing: "border-box",                           // Include padding in width
    marginBottom: "0.75rem",                           // Space below
    outline: "none",                                   // Remove default focus ring
  },
  row: {                                               // Horizontal info row
    display: "flex",                                   // Flexbox
    justifyContent: "space-between",                   // Push items to edges
    alignItems: "center",                              // Vertically center
    padding: "0.4rem 0",                               // Vertical padding
    borderBottom: "1px solid #f0f0f0",                 // Separator
    fontSize: "0.9rem",                                // Slightly smaller
  },
  statusDot: (isOnline) => ({                          // Online/offline dot indicator
    width: "12px",                                     // Fixed size
    height: "12px",                                    // Fixed size
    borderRadius: "50%",                               // Circular
    background: isOnline ? "#22c55e" : "#ef4444",      // Green if online, red if offline
    display: "inline-block",                           // Inline
    marginRight: "0.5rem",                             // Space from text
  }),
  historyItem: {                                       // Search history item
    display: "inline-block",                           // Inline block to allow click
    background: "#e0e7ff",                             // Light indigo background
    color: "#4f46e5",                                  // Indigo text
    borderRadius: "999px",                             // Pill shape
    padding: "0.2rem 0.7rem",                          // Tight padding
    margin: "0.2rem",                                  // Small margin around pills
    fontSize: "0.85rem",                               // Smaller text
    cursor: "pointer",                                 // Clickable
  },
  btn: {                                               // Generic button
    padding: "0.5rem 1rem",                            // Comfortable size
    fontSize: "0.9rem",                                // Slightly smaller
    cursor: "pointer",                                 // Pointer cursor
    border: "none",                                    // No border
    borderRadius: "6px",                               // Rounded
    background: "#4f46e5",                             // Indigo
    color: "#fff",                                     // White text
    marginTop: "0.5rem",                               // Space above
  },
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT — Composes all five custom hooks
// ═══════════════════════════════════════════════════════════════════════
function App() {                                       // Main component function

  // ── Custom Hooks ─────────────────────────
  const { width, height } = useWindowSize();           // Destructure live window dimensions
  const isOnline = useOnlineStatus();                  // Boolean: true = online, false = offline

  // ── Search State ─────────────────────────
  const [rawSearch, setRawSearch] = useState("");      // The raw value from the input (updates on every keystroke)
  const debouncedSearch = useDebounce(rawSearch, 500); // The debounced value (updates 500ms after user stops typing)
  const previousSearch = usePrevious(debouncedSearch); // The debounced value from the PREVIOUS render

  // ── Persistent Search History ─────────────
  const [history, setHistory] = useLocalStorage(      // Persist search history across page refreshes
    "search-history",                                  // localStorage key
    []                                                 // Default value: empty array
  );

  // ── Mock Search Results ───────────────────
  const [results, setResults] = useState([]);          // The current search results
  const [isSearching, setIsSearching] = useState(false); // True while computing/fetching results

  // ─────────────────────────────────────────────────────────────────────
  // Effect: Run mock search whenever the debounced search term changes
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {                                    // Effect fires when debouncedSearch changes
    if (!debouncedSearch.trim()) {                     // If the search is empty or only whitespace
      setResults([]);                                  // Clear results
      setIsSearching(false);                           // Hide searching indicator
      return;                                          // Exit early
    }

    setIsSearching(true);                              // Show "Searching…" UI

    // Simulate an async API call
    const timerId = setTimeout(() => {                 // Pretend to wait for a server response
      const mockItems = [                              // Generate fake results
        { id: 1, title: `"${debouncedSearch}" — Wikipedia` }, // Fake result 1
        { id: 2, title: `${debouncedSearch} tutorial — MDN` }, // Fake result 2
        { id: 3, title: `Best ${debouncedSearch} examples — Dev.to` }, // Fake result 3
        { id: 4, title: `${debouncedSearch} guide — freeCodeCamp` }, // Fake result 4
      ];

      setResults(mockItems);                           // Update results state
      setIsSearching(false);                           // Hide searching indicator

      // Add to search history (avoid duplicates)
      setHistory(prev => {                             // Use functional update for latest history
        const without = prev.filter(h => h !== debouncedSearch); // Remove if already exists
        return [debouncedSearch, ...without].slice(0, 5); // Prepend and keep only last 5
      });
    }, 400);                                           // 400ms simulated latency

    return () => clearTimeout(timerId);                // Cleanup: cancel if search changes again
  }, [debouncedSearch, setHistory]);                   // Dependencies: search term and stable setter

  // ─────────────────────────────────────────────────────────────────────
  // Handler: clicking a history pill restores that search term
  // ─────────────────────────────────────────────────────────────────────
  const restoreSearch = (term) => {                    // Takes a history term
    setRawSearch(term);                                // Update the input field value
  };

  // ─────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────
  return (                                             // Start rendering JSX
    <div style={s.page}>                               {/* Page wrapper */}

      <h1 style={{ color: "#1a1a2e", marginBottom: "0.25rem" }}> {/* Page heading */}
        🧩 Advanced useEffect Patterns
      </h1>
      <p style={{ color: "#555", marginBottom: "2rem" }}> {/* Subtitle */}
        Five custom hooks — each built on <code style={s.code}>useEffect</code> and <code style={s.code}>useRef</code>.
      </p>

      {/* ── Card 1: Network Status (useOnlineStatus) ── */}
      <div style={{ ...s.card, borderLeft: `4px solid ${isOnline ? "#22c55e" : "#ef4444"}` }}>
        <h2 style={{ marginTop: 0 }}>📡 useOnlineStatus</h2> {/* Card heading */}
        <p style={{ color: "#555", fontSize: "0.9rem" }}>  {/* Description */}
          Reacts to <code style={s.code}>window online/offline</code> events.
          Try turning off your Wi-Fi or throttling in DevTools!
        </p>
        <div style={{ display: "flex", alignItems: "center", fontSize: "1.1rem" }}> {/* Status row */}
          <span style={s.statusDot(isOnline)} />       {/* Colored status dot */}
          <strong>{isOnline ? "🟢 You are online" : "🔴 You are offline"}</strong> {/* Status text */}
        </div>
        <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.5rem" }}> {/* Hook info */}
          <code style={s.code}>isOnline = {String(isOnline)}</code>
        </p>
      </div>

      {/* ── Card 2: Window Size (useWindowSize) ── */}
      <div style={s.card}>                             {/* Card */}
        <h2 style={{ marginTop: 0 }}>🪟 useWindowSize</h2> {/* Heading */}
        <p style={{ color: "#555", fontSize: "0.9rem" }}> {/* Description */}
          Uses <code style={s.code}>window.addEventListener("resize", …)</code> and cleans up automatically.
          Resize this window to see the values update live!
        </p>
        <span style={s.bigText}>{width} × {height}</span> {/* Live dimension display */}
        <div>                                          {/* Detail rows */}
          <div style={s.row}>                          {/* Row: width */}
            <span>Width</span>                         {/* Label */}
            <code style={s.code}>{width}px</code>     {/* Value */}
          </div>
          <div style={s.row}>                          {/* Row: height */}
            <span>Height</span>                        {/* Label */}
            <code style={s.code}>{height}px</code>    {/* Value */}
          </div>
          <div style={s.row}>                          {/* Row: orientation */}
            <span>Orientation</span>                   {/* Label */}
            <code style={s.code}>{width > height ? "Landscape 🌄" : "Portrait 🖼️"}</code> {/* Value */}
          </div>
        </div>
      </div>

      {/* ── Card 3: Debounce + usePrevious (useDebounce + usePrevious) ── */}
      <div style={s.card}>                             {/* Card */}
        <h2 style={{ marginTop: 0 }}>🔍 useDebounce + usePrevious</h2> {/* Heading */}
        <p style={{ color: "#555", fontSize: "0.9rem" }}> {/* Description */}
          Type fast — the search only triggers after you pause for <strong>500ms</strong>.
          Watch the "Debounced" value lag behind the "Raw" value.
        </p>

        <input                                         /* Search input */
          type="text"                                  /* Text input */
          style={s.input}                              /* Apply input styles */
          placeholder="Type something to search…"     /* Placeholder */
          value={rawSearch}                            /* Controlled by state */
          onChange={e => setRawSearch(e.target.value)} /* Update raw state on each keystroke */
        />

        {/* Value inspection panel */}
        <div style={{ background: "#f7f8fc", borderRadius: "8px", padding: "0.75rem", marginBottom: "0.75rem" }}>
          <div style={s.row}>                          {/* Row: raw value */}
            <span>Raw input</span>                     {/* Label */}
            <code style={s.code}>"{rawSearch}"</code> {/* Show raw value */}
          </div>
          <div style={s.row}>                          {/* Row: debounced value */}
            <span>Debounced (after 500ms pause)</span> {/* Label */}
            <code style={s.code}>"{debouncedSearch}"</code> {/* Show debounced value */}
          </div>
          <div style={{ ...s.row, borderBottom: "none" }}> {/* Row: previous value */}
            <span>Previous debounced</span>            {/* Label */}
            <code style={s.code}>"{previousSearch || "—"}"</code> {/* Show previous value */}
          </div>
        </div>

        {isSearching && <p style={{ color: "#4f46e5" }}>⏳ Searching…</p>} {/* Searching indicator */}

        {results.length > 0 && (                      /* Show results list if any */
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}> {/* Results list */}
            {results.map(result => (                   /* Map results to list items */
              <li                                     /* Individual result */
                key={result.id}                       /* Unique key */
                style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee", fontSize: "0.9rem" }} /* Styling */
              >
                🔗 {result.title}                     {/* Result title */}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Card 4: Persistent History (useLocalStorage) ── */}
      <div style={s.card}>                             {/* Card */}
        <h2 style={{ marginTop: 0 }}>💾 useLocalStorage</h2> {/* Heading */}
        <p style={{ color: "#555", fontSize: "0.9rem" }}> {/* Description */}
          Your last 5 searches are saved to <code style={s.code}>localStorage</code>.
          Refresh the page — they persist!
        </p>

        {history.length === 0                          /* Conditional: no history yet */
          ? <p style={{ color: "#888", fontSize: "0.9rem" }}>No search history yet. Try searching something above!</p>
          : (
            <div>                                      {/* History pills wrapper */}
              <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}> {/* Label */}
                Click a pill to restore that search:
              </p>
              {history.map((term, i) => (              /* Map each history term to a pill */
                <span                                 /* History pill */
                  key={i}                             /* Unique key */
                  style={s.historyItem}               /* Pill styles */
                  onClick={() => restoreSearch(term)} /* Restore on click */
                >
                  🕐 {term}                           {/* History term with clock emoji */}
                </span>
              ))}
              <br />                                  {/* Line break before button */}
              <button                                  /* Clear history button */
                style={{ ...s.btn, background: "#dc2626", marginTop: "1rem" }} /* Red button */
                onClick={() => setHistory([])}         /* Clear history on click */
              >
                🗑️ Clear History
              </button>
            </div>
          )
        }
      </div>

      {/* ── Card 5: Hook Composition Diagram ── */}
      <div style={{ ...s.card, background: "#1e1e2e", color: "#cdd6f4" }}> {/* Dark card */}
        <h2 style={{ marginTop: 0, color: "#cba6f7" }}>🧬 How These Hooks Compose</h2> {/* Heading */}
        <pre style={{ margin: 0, fontSize: "0.8rem", lineHeight: 1.7, overflow: "auto" }}> {/* Code block */}
{`App
├── useWindowSize()         → useEffect + addEventListener
├── useOnlineStatus()       → useEffect + addEventListener
├── useDebounce(raw, 500)   → useEffect + setTimeout
├── usePrevious(debounced)  → useRef + useEffect (no deps)
└── useLocalStorage(key, []) → useState (lazy) + useEffect
                                └── syncs to localStorage
`}
        </pre>
        <p style={{ color: "#a6adc8", fontSize: "0.85rem", marginBottom: 0, marginTop: "0.75rem" }}> {/* Info text */}
          Each custom hook is a plain function. React doesn't know (or care)
          that they're "custom" — they just call built-in hooks inside. That's the whole secret!
        </p>
      </div>

    </div>
  );                                                   // End return
}                                                      // End App component

export default App;                                    // Export as default
