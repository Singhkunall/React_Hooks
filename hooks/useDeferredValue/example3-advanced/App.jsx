/**
 * @file App.jsx
 * @description Example 3 — Advanced Pattern: useDeferredValue + Suspense + useTransition
 *
 * Demonstrates how `useDeferredValue` integrates with React `Suspense` and
 * `useTransition` to keep previous search results visible (instead of flashing
 * a loading spinner) while new async results resolve in the background.
 *
 * KEY CONCEPTS:
 *   - `useTransition` marks the committed query update as non-urgent
 *   - `useDeferredValue` keeps `deferredQuery` on the previous value while loading
 *   - `Suspense` + React 19 `use()` unwraps cached promises declaratively
 *   - `isShowingStale` compares `deferredQuery !== committedQuery` for subtle feedback
 *
 * @requires React 19+ (uses React.use() for promise unwrapping)
 * @author   React Hooks Learning Module
 */

import { useState, useDeferredValue, useTransition, memo, Suspense, use } from 'react'; // Import React 19 hooks and Suspense

const cache = new Map(); // Module-level cache mapping query strings to async promises

function simulateFetch(query, delay = 600) { // Simulate an async API call that resolves after `delay` ms
  const key = `${query}`; // Build cache key from query string
  if (cache.has(key)) return cache.get(key); // Return existing promise so Suspense does not re-trigger infinitely

  const promise = new Promise((resolve) => { // Create a new promise for this search query
    setTimeout(() => { // Simulate network latency
      const results = Array.from({ length: 20 }, (_, i) => ({ // Generate 20 mock search results
        id: i, // Unique result ID
        title: `Result ${i + 1} for "${query}"`, // Result headline containing the query
        snippet: `Detailed description for item ${i + 1} matching "${query}".`, // Supporting snippet text
      })); // End of mock results array
      resolve(results); // Resolve the promise with generated results
    }, delay); // Wait for the simulated delay
  }); // End of Promise constructor

  cache.set(key, promise); // Store promise in cache for future renders
  return promise; // Return the cached promise
} // End of simulateFetch

const SearchResults = memo(function SearchResults({ query }) { // Memoized results component that suspends while loading
  if (!query) { // Handle initial empty state before any search is submitted
    return ( // Return prompt message
      <p style={{ color: '#888888', textAlign: 'center', padding: '1.5rem' }}> {/* Muted centered prompt */}
        Enter a search term above or pick a recent search to begin. {/* Guide user action */}
      </p> // End of prompt paragraph
    ); // End of early return
  } // End of empty query check

  const promise = simulateFetch(query); // Retrieve or create cached promise for this query
  const results = use(promise); // Unwrap promise; suspends component until promise resolves

  return ( // Render resolved search results
    <div> {/* Results wrapper */}
      <p style={{ fontSize: '0.85rem', color: '#555555', marginBottom: '0.75rem' }}> {/* Summary line */}
        Found <strong>{results.length}</strong> results for "<em>{query}</em>" {/* Show result count and query */}
      </p> {/* End of summary line */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}> {/* Unstyled vertical list */}
        {results.map((result) => ( // Map each result object to a list item
          <li // Individual result card
            key={result.id} // Unique key for list reconciliation
            style={{ // Card styling
              padding: '0.75rem', // Inner spacing
              marginBottom: '0.5rem', // Vertical gap between items
              borderRadius: '6px', // Rounded corners
              background: '#f8f9fa', // Light gray card background
              borderLeft: '3px solid #4A90D9', // Blue left accent bar
            }} // End of item style object
          > {/* Open result item */}
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{result.title}</div> {/* Result title */}
            <div style={{ fontSize: '0.85rem', color: '#555555' }}>{result.snippet}</div> {/* Result description */}
          </li> // End of list item
        ))} {/* End of results map */}
      </ul> {/* End of results list */}
    </div> // End of results wrapper
  ); // End of SearchResults return
}); // End of memoized SearchResults

function SearchHistory({ history, onSelect }) { // Renders clickable pills for recent search terms
  if (history.length === 0) return null; // Render nothing when history is empty

  return ( // Render history bar
    <div style={{ marginBottom: '1rem' }}> {/* Container for history section */}
      <p style={{ fontSize: '0.8rem', color: '#888888', margin: '0 0 0.4rem' }}>Recent searches:</p> {/* Section label */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}> {/* Wrapping row of pill buttons */}
        {history.map((term, index) => ( // Render one pill button per history entry
          <button // Clickable history pill
            key={index} // Index key for small static history list
            onClick={() => onSelect(term)} // Re-run search when pill is clicked
            style={{ // Pill button styling
              padding: '0.25rem 0.65rem', // Compact pill padding
              borderRadius: '20px', // Rounded pill edges
              border: '1px solid #cccccc', // Light gray border
              background: '#ffffff', // White background
              cursor: 'pointer', // Pointer cursor on hover
              fontSize: '0.8rem', // Small label text
            }} // End of pill style object
          > {/* Open history pill */}
            🕐 {term} {/* Clock icon and previous search term */}
          </button> {/* End of history pill */}
        ))} {/* End of history map */}
      </div> {/* End of pill row */}
    </div> // End of history section
  ); // End of SearchHistory return
} // End of SearchHistory

function App() { // Main component combining useDeferredValue, Suspense, and useTransition
  const [inputValue, setInputValue] = useState(''); // Live text value in the search input
  const [committedQuery, setCommittedQuery] = useState(''); // Submitted query used to trigger async search
  const [searchHistory, setSearchHistory] = useState(['react', 'hooks']); // Recent searches with two starter examples

  const [isPending, startTransition] = useTransition(); // Transition hook for non-blocking query updates
  const deferredQuery = useDeferredValue(committedQuery); // Deferred query keeps stale UI visible during Suspense
  const isShowingStale = deferredQuery !== committedQuery; // True when displaying previous results while new ones load

  function handleSearch(queryToRun) { // Submit a search query inside a transition
    const trimmed = queryToRun.trim(); // Remove leading and trailing whitespace
    if (!trimmed) return; // Ignore blank submissions

    setSearchHistory((prev) => { // Update recent searches list
      const withoutDuplicate = prev.filter((item) => item !== trimmed); // Remove existing match to avoid duplicates
      return [trimmed, ...withoutDuplicate].slice(0, 5); // Prepend new term and cap list at 5 items
    }); // End of history update

    startTransition(() => { // Mark committedQuery update as a low-priority transition
      setCommittedQuery(trimmed); // Trigger background fetch without blocking UI
    }); // End of startTransition
  } // End of handleSearch

  function handleKeyDown(e) { // Submit search when user presses Enter
    if (e.key === 'Enter') { // Check if pressed key is Enter
      handleSearch(inputValue); // Run search with current input text
    } // End of Enter key check
  } // End of handleKeyDown

  return ( // Render the complete advanced search UI
    <div style={{ fontFamily: 'sans-serif', padding: '1.5rem', maxWidth: '700px', margin: '0 auto' }}> {/* Centered page wrapper */}
      <h1>🔬 Deferred Value + Suspense + Transition</h1> {/* Page heading */}
      <p style={{ color: '#666666', fontSize: '0.9rem' }}> {/* Subtitle explaining behavior */}
        Old results stay visible (no spinner flash) while new ones load in the background. {/* Core benefit summary */}
      </p> {/* End of subtitle */}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}> {/* Search input and button row */}
        <input // Controlled search input
          type="text" // Text input type
          value={inputValue} // Always reflects live inputValue
          onChange={(e) => setInputValue(e.target.value)} // Update inputValue immediately on every keystroke
          onKeyDown={handleKeyDown} // Support pressing Enter to submit
          placeholder="Search... (press Enter or click Search)" // Input placeholder hint
          style={{ // Input styles
            flex: 1, // Expand to fill remaining row width
            padding: '0.5rem 0.75rem', // Comfortable inner padding
            fontSize: '1rem', // Standard readable font size
            borderRadius: '6px', // Rounded corners
            border: '1px solid #cccccc', // Light gray border
          }} // End of input style object
        /> {/* End of search input */}
        <button // Submit search button
          onClick={() => handleSearch(inputValue)} // Trigger search with current inputValue
          disabled={isPending} // Disable button while transition is pending
          style={{ // Button styles
            padding: '0.5rem 1rem', // Horizontal and vertical padding
            fontSize: '1rem', // Match input font size
            borderRadius: '6px', // Rounded corners
            border: 'none', // Remove default border
            background: isPending ? '#cccccc' : '#4A90D9', // Muted gray while pending, blue when ready
            color: '#ffffff', // White button label
            cursor: isPending ? 'not-allowed' : 'pointer', // Reflect disabled state in cursor
          }} // End of button style object
        > {/* Open search button */}
          {isPending ? 'Loading...' : '🔍 Search'} {/* Dynamic button text */}
        </button> {/* End of search button */}
      </div> {/* End of search row */}

      <SearchHistory // Render clickable recent search pills
        history={searchHistory} // Pass current history array
        onSelect={(term) => { // Handler when a history pill is clicked
          setInputValue(term); // Sync input box with selected term
          handleSearch(term); // Immediately run search for that term
        }} // End of onSelect handler
      /> {/* End of SearchHistory */}

      {committedQuery && ( // Display status badge once a search has been committed
        <div // Status badge container
          style={{ // Badge styles
            display: 'inline-block', // Shrink-wrap badge to its text
            padding: '0.25rem 0.65rem', // Compact badge padding
            borderRadius: '12px', // Pill-shaped badge
            fontSize: '0.8rem', // Small status text
            marginBottom: '0.75rem', // Space below badge
            background: isShowingStale ? '#FFF3CD' : '#D4EDDA', // Yellow when stale, green when fresh
            color: isShowingStale ? '#856404' : '#155724', // High-contrast matching text color
            border: `1px solid ${isShowingStale ? '#FFEEBA' : '#C3E6CB'}`, // Matching subtle border
          }} // End of badge style object
        > {/* Open status badge */}
          {isShowingStale ? '🕒 Showing previous results while loading...' : `✅ Results for "${committedQuery}"`} {/* Status label */}
        </div> // End of status badge
      )} {/* End of committedQuery conditional */}

      <div style={{ opacity: isShowingStale ? 0.6 : 1, transition: 'opacity 0.2s ease' }}> {/* Dim stale results while loading */}
        <Suspense fallback={<p style={{ color: '#4A90D9' }}>⏳ Loading initial results...</p>}> {/* Fallback shown only on very first load */}
          <SearchResults query={deferredQuery} /> {/* Pass deferredQuery so Suspense keeps old results visible */}
        </Suspense> {/* End of Suspense boundary */}
      </div> {/* End of opacity wrapper */}
    </div> // End of page wrapper
  ); // End of App return
} // End of App component

export default App; // Export App as the default module export
