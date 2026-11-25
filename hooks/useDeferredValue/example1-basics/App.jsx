/**
 * @file App.jsx
 * @description Example 1 — The Basics of useDeferredValue
 *
 * This component demonstrates the simplest possible use of useDeferredValue.
 * It renders a text input and a large (simulated) list of 2000 items.
 *
 * KEY CONCEPT:
 *   - `query` (live state) → feeds the INPUT → always up to date
 *   - `deferredQuery` (deferred copy) → feeds the LIST → lags during rapid typing
 *
 * WHAT YOU WILL SEE:
 *   - Typing in the input feels instantaneous
 *   - The list dims while React is catching up
 *   - The status line shows "Live query" vs "Deferred query" values in real time
 *
 * @requires React 18+
 * @author   React Hooks Learning Module
 */

// Import the three React features we need for this example
import { useState, useDeferredValue, memo } from 'react'; // Named imports from the 'react' package

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: artificialDelay
// In a real app the "slow" work is filtering/rendering a huge dataset.
// Here we simulate that by just doing a lot of pointless arithmetic
// so the browser actually has to work. NOT for production use.
// ─────────────────────────────────────────────────────────────────────────────

function artificialDelay() { // This function burns CPU time to simulate expensive work
  let result = 0; // Accumulator variable (we do not care about the value)
  for (let i = 0; i < 50_000; i++) { // Run 50,000 iterations
    result += Math.sqrt(i); // Pointless calculation that keeps the CPU busy
  }
  return result; // Return result so the loop isn't optimized away by the JS engine
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SlowList
//
// Renders 2000 list items. Wrapped in React.memo() so it will ONLY re-render
// when its `query` prop actually changes (i.e., when deferredQuery updates).
//
// Without memo(), this would re-render on every keystroke because the parent
// re-renders on every keystroke — defeating the entire purpose of deferral.
// ─────────────────────────────────────────────────────────────────────────────

const SlowList = memo(function SlowList({ query }) { // memo: bail out of re-render if props are the same
  artificialDelay(); // Simulate expensive work so we can see the deferral effect in real time

  const items = []; // Start with an empty array; we will fill it inside the loop

  for (let i = 0; i < 2000; i++) { // Create 2000 items (large enough to cause noticeable render time)
    const label = `Item ${i}`; // The text content for this list item

    // Determine whether this item matches the search query
    const isMatch = // Boolean: does this item match the user's query?
      query.length > 0 && // Only match if the query is non-empty
      label.toLowerCase().includes(query.toLowerCase()); // Case-insensitive substring match

    items.push( // Push a JSX element into the items array
      <li // List item element
        key={i} // Unique key required by React for list rendering
        style={{ // Inline style object for this item
          padding: '2px 4px', // Vertical + horizontal inner spacing
          color: isMatch ? '#16a34a' : '#6b7280', // Green for match, gray otherwise
          fontWeight: isMatch ? '700' : '400', // Bold for matches, normal otherwise
          fontSize: '0.85rem', // Smaller than body text — compact list
          listStyle: 'none', // Remove the default bullet point
          borderLeft: isMatch ? '3px solid #16a34a' : '3px solid transparent', // Green left accent for matches
          transition: 'color 0.1s, border-left 0.1s', // Smooth color change when match status changes
        }}
      >
        {isMatch && '✅ '} {/* Prepend a checkmark only for matched items */}
        {label} {/* The item text */}
      </li>
    );
  }

  return ( // Return the scroll container + unordered list
    <div // Wrapper div for the scrollable list area
      style={{
        maxHeight: '350px', // Limit the visible area height
        overflowY: 'auto', // Enable vertical scrolling when content overflows
        border: '1px solid #e5e7eb', // Light gray border around the list
        borderRadius: '8px', // Rounded corners for the container
        padding: '0.5rem', // Small inner padding
        background: '#fafafa', // Off-white background
      }}
    >
      <ul style={{ margin: 0, padding: 0 }}> {/* Remove default ul margins and padding */}
        {items} {/* Render all 2000 <li> elements */}
      </ul>
    </div>
  );
}); // Close memo() — SlowList will now skip re-renders when query hasn't changed

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: StatusBar
// A small informational strip that shows the current live vs deferred values
// and whether the list is in a "stale" (catching up) state.
// ─────────────────────────────────────────────────────────────────────────────

function StatusBar({ liveQuery, deferredQuery }) { // Receives both values as props for display
  const isStale = liveQuery !== deferredQuery; // true while React hasn't updated the deferred value yet

  return ( // Return a styled status bar
    <div // Container for the status information
      style={{
        display: 'flex', // Horizontal layout
        alignItems: 'center', // Vertically center the contents
        gap: '1rem', // Space between individual status pieces
        padding: '0.4rem 0.75rem', // Inner spacing
        marginBottom: '0.75rem', // Space below the status bar
        borderRadius: '6px', // Rounded corners
        background: isStale ? '#fffbeb' : '#f0fdf4', // Yellow=stale, green=fresh background
        border: `1px solid ${isStale ? '#fcd34d' : '#86efac'}`, // Matching border color
        fontSize: '0.8rem', // Small text to not crowd the UI
        transition: 'background 0.2s, border-color 0.2s', // Smooth transition between states
      }}
    >
      <span style={{ fontWeight: 'bold', color: isStale ? '#92400e' : '#166534' }}> {/* Bold status label */}
        {isStale ? '⏳ Catching up...' : '✅ In sync'} {/* Status text changes based on stale state */}
      </span>

      <span style={{ color: '#374151' }}> {/* Live query display */}
        <strong>Live:</strong> {/* Label */}
        {' '} {/* Space between label and value */}
        <code style={{ background: '#e5e7eb', padding: '1px 4px', borderRadius: '3px' }}> {/* Monospace code badge */}
          "{liveQuery || ' '}" {/* Show live query value or a space if empty */}
        </code>
      </span>

      <span style={{ color: '#374151' }}> {/* Deferred query display */}
        <strong>Deferred:</strong> {/* Label */}
        {' '} {/* Space */}
        <code style={{ background: '#e5e7eb', padding: '1px 4px', borderRadius: '3px' }}> {/* Monospace code badge */}
          "{deferredQuery || ' '}" {/* Show deferred value — may lag behind liveQuery */}
        </code>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT: App
//
// This is the root component that orchestrates the input and the slow list.
// It holds the live state and creates the deferred copy.
// ─────────────────────────────────────────────────────────────────────────────

export default function App() { // Default export — this is what React renders
  // ── STATE ────────────────────────────────────────────────────────────────
  const [query, setQuery] = useState(''); // The current search text — updates on every keystroke

  // ── DEFERRED VALUE ───────────────────────────────────────────────────────
  // useDeferredValue returns a "lagging" copy of `query`.
  // During rapid typing, `deferredQuery` stays at the OLD value
  // so SlowList does not need to re-render on every single keystroke.
  const deferredQuery = useDeferredValue(query); // Create the deferred copy

  // ── DERIVED STATE ────────────────────────────────────────────────────────
  // isStale tells us when the two values are out of sync.
  // We use it to visually dim the list during the "catching up" period.
  const isStale = query !== deferredQuery; // Compare live vs deferred

  // ── EVENT HANDLERS ───────────────────────────────────────────────────────
  function handleChange(e) { // Called on every keystroke in the input
    setQuery(e.target.value); // Update live state with the new input value
  }

  function handleClear() { // Called when the user clicks the Clear button
    setQuery(''); // Reset the query to an empty string
  }

  // ── RENDER ───────────────────────────────────────────────────────────────
  return ( // Return the full component tree
    <div // Root container div
      style={{
        fontFamily: "'Segoe UI', system-ui, sans-serif", // Clean system font stack
        padding: '2rem', // Outer padding
        maxWidth: '640px', // Constrain page width for readability
        margin: '0 auto', // Center horizontally
      }}
    >
      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem', color: '#111827' }}> {/* Page title */}
        🪝 useDeferredValue — Basics {/* Title text */}
      </h1>
      <p style={{ margin: '0 0 1.5rem', color: '#6b7280', fontSize: '0.9rem' }}> {/* Subtitle */}
        Type quickly and watch the input stay instant while the list catches up. {/* Description */}
      </p>

      {/* ── CONCEPT BOX ──────────────────────────────────────────────── */}
      <div // Concept explanation box
        style={{
          background: '#eff6ff', // Light blue background
          border: '1px solid #bfdbfe', // Blue border
          borderRadius: '8px', // Rounded corners
          padding: '0.75rem 1rem', // Inner padding
          marginBottom: '1.25rem', // Space below
          fontSize: '0.85rem', // Small readable text
          color: '#1e40af', // Dark blue text
          lineHeight: 1.6, // Comfortable line height
        }}
      >
        <strong>How this works:</strong> The input uses <code>query</code> (live), {/* Explanation text */}
        while the list uses <code>deferredQuery</code> (delayed). {/* Continuation */}
        React updates the list only when it has idle time. {/* Conclusion */}
      </div>

      {/* ── INPUT ROW ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}> {/* Input + button row */}
        <input // The search input element
          type="text" // Plain text input (not search type, to control appearance)
          value={query} // Controlled: tied to live query state, NOT deferredQuery
          onChange={handleChange} // Update live state on every keystroke
          placeholder="Type to filter 2000 items..." // Helper text
          autoFocus // Focus the input automatically when the page loads
          style={{ // Input styles
            flex: 1, // Fill remaining horizontal space
            padding: '0.6rem 0.8rem', // Inner padding for comfortable clicking area
            fontSize: '1rem', // Body-text size
            borderRadius: '6px', // Rounded corners
            border: '1px solid #d1d5db', // Light gray border
            outline: 'none', // Remove default browser focus outline
            boxShadow: '0 0 0 2px #93c5fd', // Custom focus ring (always visible here for clarity)
          }}
        />
        <button // Clear button to reset the input
          onClick={handleClear} // Call handleClear when clicked
          disabled={query === ''} // Disable if input is already empty
          style={{ // Button styles
            padding: '0.6rem 1rem', // Comfortable padding
            fontSize: '0.9rem', // Slightly smaller than the input
            borderRadius: '6px', // Match input corners
            border: '1px solid #d1d5db', // Light border
            background: query === '' ? '#f9fafb' : '#fff', // Gray when disabled
            cursor: query === '' ? 'default' : 'pointer', // Update cursor
            color: '#374151', // Dark gray text
          }}
        >
          ✕ Clear {/* Clear button label */}
        </button>
      </div>

      {/* ── STATUS BAR ───────────────────────────────────────────────── */}
      <StatusBar // Render the status bar component
        liveQuery={query} // Pass the live (immediate) query
        deferredQuery={deferredQuery} // Pass the deferred (lagging) query
      />

      {/* ── SLOW LIST ────────────────────────────────────────────────── */}
      {/* Wrap the list in a div that dims during the stale period */}
      <div // Container that provides the stale visual feedback
        style={{
          opacity: isStale ? 0.55 : 1, // Dim to 55% opacity when list is stale
          transition: 'opacity 0.2s ease', // Smooth transition — not jarring
          pointerEvents: isStale ? 'none' : 'auto', // Prevent interaction during stale (optional UX choice)
        }}
      >
        <SlowList query={deferredQuery} /> {/* ✅ KEY: SlowList gets DEFERRED query, not live query */}
      </div>

      {/* ── FOOTER NOTE ──────────────────────────────────────────────── */}
      <p // Small instructional note at the bottom
        style={{
          marginTop: '1rem', // Space above
          fontSize: '0.75rem', // Very small text
          color: '#9ca3af', // Light gray
          textAlign: 'center', // Center aligned
        }}
      >
        💡 Open DevTools → Profiler to see two separate renders per keystroke. {/* Dev tip */}
      </p>
    </div>
  );
}
