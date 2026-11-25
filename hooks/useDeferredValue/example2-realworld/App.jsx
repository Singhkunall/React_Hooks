/**
 * @file App.jsx
 * @description Example 2 — Real-World Product Search with useDeferredValue
 *
 * Demonstrates how to use `useDeferredValue` in a realistic e-commerce product
 * search interface with 5,000 items, a text search input, and a category filter.
 *
 * KEY CONCEPTS:
 *   - `searchQuery` and `selectedCategory` update immediately for snappy controls
 *   - `deferredQuery` and `deferredCategory` lag behind during rapid changes
 *   - `memo()` on `ProductGrid` and `ProductCard` skips unnecessary re-renders
 *   - `isStale` compares live vs deferred values to show visual feedback
 *
 * @requires React 18+
 * @author   React Hooks Learning Module
 */

import { useState, useDeferredValue, memo, useMemo } from 'react'; // Import React hooks and memoization helper

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports']; // Available product categories

const ALL_PRODUCTS = Array.from({ length: 5000 }, (_, i) => ({ // Generate 5,000 mock products once at module load
  id: i, // Unique numeric ID for React list keys
  name: `Product ${i} — ${CATEGORIES[i % CATEGORIES.length]}`, // Human-readable product title
  category: CATEGORIES[i % CATEGORIES.length], // Assign category cyclically across the 5 categories
  price: ((i * 7.3) % 500 + 1).toFixed(2), // Deterministic mock price formatted to 2 decimal places
  rating: (i % 5) + 1, // Star rating between 1 and 5
})); // End of mock product array generation

const ProductCard = memo(function ProductCard({ product }) { // Memoized card so unchanged products do not re-render
  return ( // Return the JSX for a single product card
    <div // Outer card container
      style={{ // Inline card styling
        border: '1px solid #e0e0e0', // Subtle gray border around card
        borderRadius: '8px', // Rounded card corners
        padding: '0.75rem', // Comfortable inner spacing
        fontSize: '0.85rem', // Compact body text size
        background: '#ffffff', // Clean white card background
      }} // End of card style object
    > {/* Open card container */}
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{product.name}</div> {/* Bold product title */}
      <div style={{ color: '#27ae60', fontWeight: '600' }}>${product.price}</div> {/* Formatted price in green */}
      <div style={{ color: '#f39c12' }}>{'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}</div> {/* Visual 5-star rating */}
      <div style={{ color: '#888888', fontSize: '0.75rem', marginTop: '4px' }}>{product.category}</div> {/* Muted category label */}
    </div> // End of outer card container
  ); // End of ProductCard return
}); // End of memoized ProductCard component

const ProductGrid = memo(function ProductGrid({ query, category }) { // Memoized grid that only re-renders when deferred props change
  const filtered = useMemo(() => { // Cache filtered array until query or category changes
    const normalizedQuery = query.trim().toLowerCase(); // Normalize search text once before iterating
    return ALL_PRODUCTS.filter((product) => { // Filter all 5,000 products
      const matchesQuery = product.name.toLowerCase().includes(normalizedQuery); // Check if product name matches search text
      const matchesCategory = category === 'All' || product.category === category; // Check if category matches or is 'All'
      return matchesQuery && matchesCategory; // Keep product only when both filters pass
    }); // End of filter callback
  }, [query, category]); // Recompute only when deferred query or deferred category changes

  if (filtered.length === 0) { // Handle empty search results
    return ( // Return empty state message
      <p style={{ color: '#888888', textAlign: 'center', padding: '2rem' }}> {/* Centered muted paragraph */}
        No products found matching "{query}". {/* Inform user why grid is empty */}
      </p> // End of empty state paragraph
    ); // End of early return
  } // End of empty-results guard

  return ( // Render the matching product count and grid
    <div> {/* Wrapper around summary and grid */}
      <p style={{ fontSize: '0.85rem', color: '#555555', marginBottom: '0.5rem' }}> {/* Result count summary */}
        Showing <strong>{filtered.length}</strong> of {ALL_PRODUCTS.length.toLocaleString()} products {/* Display match count */}
      </p> {/* End of result count summary */}
      <div // Scrollable responsive CSS grid container
        style={{ // Grid container styles
          display: 'grid', // Use CSS Grid layout
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', // Responsive columns at least 180px wide
          gap: '0.75rem', // Uniform spacing between product cards
          maxHeight: '400px', // Cap grid height so controls stay visible
          overflowY: 'auto', // Allow vertical scrolling inside the grid
        }} // End of grid style object
      > {/* Open product grid */}
        {filtered.slice(0, 200).map((product) => ( // Render up to 200 cards to keep DOM lightweight
          <ProductCard key={product.id} product={product} /> // Render memoized card with unique key
        ))} {/* End of product card mapping */}
        {filtered.length > 200 && ( // Show notice if more than 200 items matched
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888888', padding: '1rem' }}> {/* Full-width notice row */}
            + {filtered.length - 200} more results. Narrow your search to see them. {/* Prompt user to refine query */}
          </div> // End of notice row
        )} {/* End of overflow notice conditional */}
      </div> // End of scrollable grid container
    </div> // End of wrapper div
  ); // End of ProductGrid return
}); // End of memoized ProductGrid component

function App() { // Main application component managing search and category state
  const [searchQuery, setSearchQuery] = useState(''); // Live search text bound directly to the input
  const [selectedCategory, setSelectedCategory] = useState('All'); // Live category filter bound to dropdown and buttons

  const deferredQuery = useDeferredValue(searchQuery); // Deferred copy of searchQuery for expensive grid filtering
  const deferredCategory = useDeferredValue(selectedCategory); // Deferred copy of selectedCategory for smooth switching

  const isStale = searchQuery !== deferredQuery || selectedCategory !== deferredCategory; // True while UI is catching up

  function handleReset() { // Reset both filters back to their default values
    setSearchQuery(''); // Clear the search input immediately
    setSelectedCategory('All'); // Reset category filter to All
  } // End of handleReset

  return ( // Render the complete product search interface
    <div style={{ fontFamily: 'sans-serif', padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}> {/* Centered page container */}
      <h1 style={{ marginBottom: '0.25rem' }}>🛍️ Product Search</h1> {/* Page heading */}
      <p style={{ color: '#666666', marginTop: 0, fontSize: '0.9rem' }}> {/* Descriptive subtitle */}
        Searching {ALL_PRODUCTS.length.toLocaleString()} products with useDeferredValue {/* Explain dataset size */}
      </p> {/* End of subtitle */}

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}> {/* Top search controls row */}
        <input // Controlled text input for searching products
          type="text" // Standard text input
          value={searchQuery} // Bound to live searchQuery so typing is never blocked
          onChange={(e) => setSearchQuery(e.target.value)} // Update live query immediately on keystroke
          placeholder="Search products (e.g. Product 42)..." // Helpful placeholder text
          style={{ flex: 1, minWidth: '200px', padding: '0.5rem 0.75rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #cccccc' }} // Input styling
        /> {/* End of search input */}
        <select // Controlled dropdown for category selection
          value={selectedCategory} // Bound to live selectedCategory
          onChange={(e) => setSelectedCategory(e.target.value)} // Update live category immediately on change
          style={{ padding: '0.5rem 0.75rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #cccccc' }} // Select styling
        > {/* Open category select */}
          <option value="All">All Categories</option> {/* Option to include all categories */}
          {CATEGORIES.map((cat) => ( // Create an option element for each category
            <option key={cat} value={cat}>{cat}</option> // Individual category option
          ))} {/* End of category options */}
        </select> {/* End of category select */}
        <button // Button to clear active search and category filters
          onClick={handleReset} // Invoke reset handler on click
          style={{ padding: '0.5rem 1rem', fontSize: '0.95rem', borderRadius: '6px', border: '1px solid #cccccc', background: '#f8f9fa', cursor: 'pointer' }} // Button styling
        > {/* Open reset button */}
          Reset {/* Button label */}
        </button> {/* End of reset button */}
      </div> {/* End of top search controls row */}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}> {/* Quick-filter category pill buttons */}
        {['All', ...CATEGORIES].map((cat) => ( // Map All plus each category to a pill button
          <button // Quick category filter button
            key={cat} // Unique key for each category button
            onClick={() => setSelectedCategory(cat)} // Set live category when clicked
            style={{ // Conditional pill button styling
              padding: '0.3rem 0.75rem', // Compact pill padding
              borderRadius: '999px', // Fully rounded pill shape
              border: '1px solid #d0d7de', // Light border
              background: selectedCategory === cat ? '#2563eb' : '#ffffff', // Highlight active category in blue
              color: selectedCategory === cat ? '#ffffff' : '#333333', // White text when active, dark otherwise
              cursor: 'pointer', // Pointer cursor on hover
              fontSize: '0.85rem', // Small readable font
            }} // End of pill style object
          > {/* Open quick-filter pill */}
            {cat} {/* Display category name */}
          </button> {/* End of quick-filter pill */}
        ))} {/* End of quick-filter buttons */}
      </div> {/* End of quick-filter row */}

      {isStale && ( // Show stale status banner only while deferred values lag behind
        <div style={{ marginBottom: '0.5rem', color: '#d97706', fontSize: '0.9rem', fontWeight: '500' }}> {/* Amber status banner */}
          ⏳ Filtering products in background... {/* Visual feedback during deferred render */}
        </div> // End of status banner
      )} {/* End of isStale conditional */}

      <div style={{ opacity: isStale ? 0.6 : 1, transition: 'opacity 0.15s ease' }}> {/* Dim grid smoothly while stale */}
        <ProductGrid // Render expensive grid with deferred props only
          query={deferredQuery} // Pass deferred query so urgent input stays fast
          category={deferredCategory} // Pass deferred category so rapid clicks stay responsive
        /> {/* End of ProductGrid */}
      </div> {/* End of opacity wrapper */}
    </div> // End of page container
  ); // End of App return
} // End of App component

export default App; // Export App as the default module export
