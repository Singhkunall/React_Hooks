/**
 * Example 3 — Advanced Pattern: Debounced Search with useCallback + useEffect + useRef
 *
 * Demonstrates composing useCallback with useEffect and useRef to safely
 * include a memoized search function in a useEffect dependency array without
 * triggering infinite re-renders or resetting debounce timers unnecessarily.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react'; // Import React and the four hooks we will compose together

const ARTICLES = [ // Static dataset of articles to search through
  { id: 1, title: 'Understanding useCallback', category: 'hooks' }, // First article
  { id: 2, title: 'Mastering CSS Flexbox', category: 'styling' }, // Second article
  { id: 3, title: 'When to Use useMemo', category: 'hooks' }, // Third article
  { id: 4, title: 'Building Accessible Forms', category: 'a11y' }, // Fourth article
  { id: 5, title: 'Custom Hooks Patterns', category: 'hooks' }, // Fifth article
]; // End of ARTICLES array

export default function App() { // Export the main App component as default
  const [query, setQuery] = useState(''); // State for the search input string
  const [category, setCategory] = useState('all'); // State for the selected category filter
  const [results, setResults] = useState(ARTICLES); // State for the filtered article results
  const [searchRuns, setSearchRuns] = useState(0); // Counter showing how many times the debounced search executed
  const timerRef = useRef(null); // Ref to hold the active setTimeout ID across renders without causing re-renders

  const executeSearch = useCallback((searchText, selectedCategory) => { // Memoize the search function so useEffect can depend on it safely
    setSearchRuns((prev) => prev + 1); // Increment the search execution counter
    const matches = ARTICLES.filter((article) => { // Filter the article list
      const matchesText = article.title.toLowerCase().includes(searchText.toLowerCase()); // Check if title matches the search query
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory; // Check if category matches or 'all' is selected
      return matchesText && matchesCategory; // Keep article only if both checks pass
    }); // End of filter callback
    setResults(matches); // Save the matching articles to state
  }, []); // Empty dependency array because searchText and selectedCategory are passed as parameters

  useEffect(() => { // Run a debounced search whenever query, category, or executeSearch changes
    clearTimeout(timerRef.current); // Clear any existing timer from the previous render
    timerRef.current = setTimeout(() => { // Start a new 350ms timer before running the search
      executeSearch(query, category); // Call the stable memoized search function
    }, 350); // Wait 350 milliseconds after the user stops typing
    return () => clearTimeout(timerRef.current); // Clean up the timer on unmount or before the next effect run
  }, [query, category, executeSearch]); // Include executeSearch safely because useCallback keeps its reference stable

  return ( // Return the search UI
    <div style={{ maxWidth: '500px', padding: '24px', fontFamily: 'system-ui, sans-serif' }}> {/* Main container */}
      <h2>Debounced Article Search</h2> {/* Heading */}
      <p style={{ fontSize: '0.9rem', color: '#475569' }}>Debounced searches executed: <strong>{searchRuns}</strong></p> {/* Display execution count */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}> {/* Flex row for search input and category selector */}
        <input // Text input for typing a search query
          type="text" // Standard text input
          value={query} // Controlled value bound to query state
          onChange={(e) => setQuery(e.target.value)} // Update query state on each keystroke
          placeholder="Type to search (350ms debounce)..." // Helpful placeholder
          style={{ flex: 1, padding: '8px' }} // Allow input to take remaining width
        /> {/* Close input */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px' }}> {/* Dropdown for category filtering */}
          <option value="all">All Categories</option> {/* Show all categories */}
          <option value="hooks">Hooks</option> {/* Filter to hooks */}
          <option value="styling">Styling</option> {/* Filter to styling */}
          <option value="a11y">Accessibility</option> {/* Filter to accessibility */}
        </select> {/* Close select */}
      </div> {/* Close controls row */}
      <ul style={{ paddingLeft: '20px' }}> {/* List of matching articles */}
        {results.map((article) => ( // Render each matching article
          <li key={article.id} style={{ marginBottom: '6px' }}> {/* List item with unique key */}
            {article.title} <span style={{ color: '#64748b' }}>({article.category})</span> {/* Show title and category */}
          </li> // Close list item
        ))} {/* Close map */}
      </ul> {/* Close unordered list */}
    </div> // Close main container
  ); // End of return statement
} // Close App component
