/**
 * @fileoverview Example 3: Advanced Search Experience with useTransition, useRef, and Sorting.
 * Combines useTransition for non-blocking filtering and sorting of 20,000 products,
 * useRef for debounced search history tracking, and clear pending UI feedback.
 */
import { useState, useTransition, useRef, useEffect } from 'react'; // Import React hooks needed for the search experience
const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports']; // Product categories for deterministic dataset generation
const PRODUCTS = Array.from({ length: 20_000 }, (_, i) => ({ // Generate 20,000 sample product objects once
  id: i + 1, // Unique numeric ID
  name: `${CATEGORIES[i % CATEGORIES.length]} Item #${i + 1}`, // Descriptive product name
  category: CATEGORIES[i % CATEGORIES.length], // Assigned category
  price: Number((((i * 19) % 490) + 9.99).toFixed(2)), // Deterministic price between $9.99 and $499.99
})); // End PRODUCTS dataset generation
function filterAndSort(query, sortBy) { // Helper function to filter and sort the product dataset
  const normalized = query.trim().toLowerCase(); // Normalize search query for case-insensitive matching
  const filtered = normalized // Check if a search query is present
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(normalized) || p.category.toLowerCase().includes(normalized)) // Filter by name or category
    : [...PRODUCTS]; // Copy all products when query is empty
  if (sortBy === 'price-asc') { // Sort by lowest price first
    filtered.sort((a, b) => a.price - b.price); // Ascending numeric price comparison
  } else if (sortBy === 'price-desc') { // Sort by highest price first
    filtered.sort((a, b) => b.price - a.price); // Descending numeric price comparison
  } else if (sortBy === 'name') { // Sort alphabetically by product name
    filtered.sort((a, b) => a.name.localeCompare(b.name)); // Locale-aware string comparison
  } // End sort branches
  return filtered; // Return the newly filtered and sorted array
} // End filterAndSort helper
export default function App() { // Export the main App component
  const [query, setQuery] = useState(''); // Urgent state for the controlled search input
  const [sortBy, setSortBy] = useState('default'); // Urgent state for the active sort button highlight
  const [results, setResults] = useState(PRODUCTS); // Deferred state holding the filtered and sorted product list
  const [recentSearches, setRecentSearches] = useState([]); // State displaying recent search terms recorded by debounce
  const [isPending, startTransition] = useTransition(); // Track pending status and schedule low-priority list updates
  const debounceTimerRef = useRef(null); // Mutable ref storing the active debounce timeout ID
  const historyRef = useRef([]); // Mutable ref storing recent search queries without extra re-renders
  useEffect(() => { // Cleanup effect on component unmount
    return () => { // Return cleanup function
      if (debounceTimerRef.current) { // Check if a debounce timer is still pending
        clearTimeout(debounceTimerRef.current); // Cancel pending timer to avoid memory leaks
      } // End timer check
    }; // End cleanup function
  }, []); // Run only on mount and unmount
  function recordSearchHistory(term) { // Debounced helper to record non-empty search terms
    if (debounceTimerRef.current) { // Clear any previously scheduled timer
      clearTimeout(debounceTimerRef.current); // Cancel previous debounce
    } // End clear check
    const cleaned = term.trim(); // Trim whitespace from the search term
    if (!cleaned) return; // Skip recording empty queries
    debounceTimerRef.current = setTimeout(() => { // Wait 500ms after typing stops before recording history
      const next = [cleaned, ...historyRef.current.filter(item => item !== cleaned)].slice(0, 5); // Keep up to 5 unique recent searches
      historyRef.current = next; // Update mutable ref immediately
      setRecentSearches(next); // Sync state so the history pills re-render
    }, 500); // 500ms debounce delay
  } // End recordSearchHistory function
  function applyFilterAndSort(nextQuery, nextSort) { // Schedule a low-priority filter + sort update
    startTransition(() => { // Wrap heavy array work in startTransition
      const nextResults = filterAndSort(nextQuery, nextSort); // Compute filtered and sorted list
      setResults(nextResults); // Update results state at low priority
    }); // End startTransition callback
  } // End applyFilterAndSort function
  function handleQueryChange(event) { // Handle typing in the search input
    const nextQuery = event.target.value; // Read new input value
    setQuery(nextQuery); // Urgent: update input immediately
    recordSearchHistory(nextQuery); // Debounce adding term to recent searches
    applyFilterAndSort(nextQuery, sortBy); // Defer filtering 20,000 products
  } // End handleQueryChange function
  function handleSortChange(nextSort) { // Handle clicking a sort option button
    setSortBy(nextSort); // Urgent: highlight the selected sort button immediately
    applyFilterAndSort(query, nextSort); // Defer re-sorting 20,000 products
  } // End handleSortChange function
  function handleHistoryClick(term) { // Handle clicking a recent search pill
    setQuery(term); // Urgent: populate search input immediately
    applyFilterAndSort(term, sortBy); // Defer filtering for the selected term
  } // End handleHistoryClick function
  const sortOptions = [ // Available sort button definitions
    { id: 'default', label: 'Default' }, // Original ID order
    { id: 'price-asc', label: 'Price: Low → High' }, // Ascending price sort
    { id: 'price-desc', label: 'Price: High → Low' }, // Descending price sort
    { id: 'name', label: 'Name (A–Z)' }, // Alphabetical sort
  ]; // End sortOptions array
  return ( // Return the component JSX
    <div style={styles.container}> {/* Outer centered container */}
      <div style={styles.header}> {/* Header row with title and result badge */}
        <h1 style={styles.title}>Advanced Product Search</h1> {/* Main heading */}
        <span style={styles.badge}> {/* Result count badge */}
          {results.length.toLocaleString()} results {/* Formatted total matches */}
        </span> {/* Close badge */}
      </div> {/* Close header row */}
      <input // Controlled search input
        type="text" // Standard text input
        value={query} // Bind to urgent query state
        onChange={handleQueryChange} // Trigger urgent + transition + debounced history updates
        placeholder="Search 20,000 products (e.g., Electronics, Item #42)..." // Helpful placeholder
        style={styles.input} // Apply input styles
      /> {/* End input element */}
      <div style={styles.controlsRow}> {/* Sort buttons and pending status row */}
        <div style={styles.sortGroup}> {/* Group of sort option buttons */}
          {sortOptions.map(option => ( // Render a button for each sort option
            <button // Sort option button
              key={option.id} // Unique key per option
              onClick={() => handleSortChange(option.id)} // Switch sort order on click
              style={{ // Dynamic button styling
                ...styles.sortButton, // Base sort button styles
                ...(sortBy === option.id ? styles.sortButtonActive : {}), // Highlight active sort option
              }} // End style object
            > {/* Close button opening tag */}
              {option.label} {/* Display sort option label */}
            </button> // Close sort button
          ))} {/* End sortOptions map */}
        </div> {/* Close sortGroup */}
        {isPending && <span style={styles.pending}>⏳ Updating results...</span>} {/* Show pending text while transition runs */}
      </div> {/* Close controlsRow */}
      {recentSearches.length > 0 && ( // Conditionally render recent searches bar
        <div style={styles.historyBar}> {/* Recent searches container */}
          <span style={styles.historyLabel}>Recent:</span> {/* Label before pills */}
          {recentSearches.map(term => ( // Render clickable pill for each recent search
            <button // Recent search pill button
              key={term} // Unique key per term
              onClick={() => handleHistoryClick(term)} // Re-run search when clicked
              style={styles.historyPill} // Apply pill styling
            > {/* Close button opening tag */}
              {term} {/* Display search term */}
            </button> // Close pill button
          ))} {/* End recentSearches map */}
        </div> // Close historyBar
      )} {/* End recentSearches check */}
      <div style={{ ...styles.listWrapper, opacity: isPending ? 0.65 : 1 }}> {/* Dim list gently while transition is pending */}
        {results.slice(0, 80).map(product => ( // Render first 80 matching products for display
          <div key={product.id} style={styles.row}> {/* Product row with unique key */}
            <div> {/* Left column: product name and category */}
              <div style={styles.productName}>{product.name}</div> {/* Product name */}
              <div style={styles.productCategory}>{product.category}</div> {/* Product category */}
            </div> {/* Close left column */}
            <div style={styles.productPrice}>${product.price.toFixed(2)}</div> {/* Right column: formatted price */}
          </div> // Close product row
        ))} {/* End results map */}
        {results.length === 0 && ( // Empty state when no products match
          <div style={styles.empty}>No products match "{query}".</div> // Friendly empty message
        )} {/* End empty check */}
      </div> {/* Close listWrapper */}
    </div> // Close outer container
  ); // End return statement
} // End App component
const styles = { // Inline styles for the advanced search UI
  container: { // Outer page container styles
    maxWidth: '720px', // Comfortable reading width
    margin: '36px auto', // Center horizontally with vertical margin
    fontFamily: 'system-ui, sans-serif', // Clean system font
    padding: '0 20px', // Horizontal padding
  }, // End container styles
  header: { // Header row styles
    display: 'flex', // Align title and badge horizontally
    justifyContent: 'space-between', // Push title left and badge right
    alignItems: 'center', // Vertically center items
    marginBottom: '16px', // Space below header
  }, // End header styles
  title: { // Main heading styles
    margin: 0, // Remove default margin
    color: '#1a1a2e', // Dark navy text
    fontSize: '24px', // Heading font size
  }, // End title styles
  badge: { // Result count badge styles
    background: '#eef', // Soft lavender background
    color: '#6c63ff', // Purple text
    padding: '6px 12px', // Pill padding
    borderRadius: '20px', // Rounded pill shape
    fontSize: '13px', // Compact font size
    fontWeight: '600', // Semi-bold text
  }, // End badge styles
  input: { // Search input styles
    width: '100%', // Full container width
    padding: '12px 16px', // Inner padding
    fontSize: '16px', // Readable input text
    border: '2px solid #6c63ff', // Purple border
    borderRadius: '8px', // Rounded corners
    outline: 'none', // Remove default outline
    boxSizing: 'border-box', // Include border/padding in width
  }, // End input styles
  controlsRow: { // Sort buttons and pending row styles
    display: 'flex', // Flex row layout
    justifyContent: 'space-between', // Sort buttons left, pending text right
    alignItems: 'center', // Vertically align items
    flexWrap: 'wrap', // Wrap on smaller screens
    gap: '8px', // Gap between wrapped items
    margin: '12px 0', // Vertical spacing
  }, // End controlsRow styles
  sortGroup: { // Sort button group styles
    display: 'flex', // Arrange sort buttons in a row
    flexWrap: 'wrap', // Wrap if needed
    gap: '6px', // Space between sort buttons
  }, // End sortGroup styles
  sortButton: { // Default sort button styles
    padding: '6px 12px', // Compact button padding
    border: '1px solid #ddd', // Subtle border
    borderRadius: '6px', // Slightly rounded corners
    background: '#fff', // White background
    color: '#444', // Dark gray text
    cursor: 'pointer', // Pointer cursor
    fontSize: '13px', // Compact text size
  }, // End sortButton styles
  sortButtonActive: { // Active sort button overrides
    background: '#6c63ff', // Purple fill
    color: '#fff', // White text
    borderColor: '#6c63ff', // Matching purple border
    fontWeight: '600', // Semi-bold text
  }, // End sortButtonActive styles
  pending: { // Pending indicator styles
    color: '#6c63ff', // Purple text
    fontSize: '13px', // Compact font size
    fontStyle: 'italic', // Italicized status
  }, // End pending styles
  historyBar: { // Recent searches container styles
    display: 'flex', // Arrange label and pills horizontally
    alignItems: 'center', // Vertically center pills
    flexWrap: 'wrap', // Wrap pills onto new lines if needed
    gap: '6px', // Space between pills
    marginBottom: '12px', // Space below history bar
  }, // End historyBar styles
  historyLabel: { // Label before recent search pills
    fontSize: '12px', // Small label font
    color: '#777', // Muted gray color
  }, // End historyLabel styles
  historyPill: { // Recent search pill button styles
    padding: '4px 10px', // Compact pill padding
    border: '1px solid #e0dcff', // Light purple border
    borderRadius: '14px', // Pill shape
    background: '#f8f7ff', // Subtle purple tint
    color: '#6c63ff', // Purple text
    fontSize: '12px', // Small font size
    cursor: 'pointer', // Pointer cursor
  }, // End historyPill styles
  listWrapper: { // Scrollable results container styles
    border: '1px solid #eee', // Light outer border
    borderRadius: '8px', // Rounded corners
    maxHeight: '420px', // Fixed max height for scrolling
    overflowY: 'auto', // Enable vertical scroll
    transition: 'opacity 0.15s ease', // Smooth opacity fade during transitions
  }, // End listWrapper styles
  row: { // Product row styles
    display: 'flex', // Align name/category left and price right
    justifyContent: 'space-between', // Space between columns
    alignItems: 'center', // Vertically center content
    padding: '10px 16px', // Row padding
    borderBottom: '1px solid #f2f2f2', // Subtle row divider
  }, // End row styles
  productName: { // Product name text styles
    fontSize: '14px', // Readable font size
    fontWeight: '500', // Medium weight
    color: '#222', // Near-black text
  }, // End productName styles
  productCategory: { // Product category text styles
    fontSize: '12px', // Small secondary text
    color: '#888', // Muted gray
  }, // End productCategory styles
  productPrice: { // Product price text styles
    fontSize: '14px', // Matching row size
    fontWeight: '600', // Semi-bold emphasis
    color: '#6c63ff', // Purple accent color
  }, // End productPrice styles
  empty: { // Empty state message styles
    padding: '24px', // Generous padding
    textAlign: 'center', // Center text
    color: '#888', // Muted gray
    fontStyle: 'italic', // Italicized message
  }, // End empty styles
}; // End styles object
