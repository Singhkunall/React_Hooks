/**
 * @fileoverview Example 1: useTransition Basics — Responsive Large List Filtering.
 * Demonstrates splitting an urgent state update (controlled text input) from a
 * non-urgent state update (filtering 10,000 items) using React's useTransition hook.
 */
import { useState, useTransition } from 'react'; // Import useState and useTransition hooks from React
const ALL_ITEMS = Array.from({ length: 10_000 }, (_, i) => `Item number ${i + 1}`); // Generate 10,000 sample items once outside the component
export default function App() { // Define and export the main App component
  const [query, setQuery] = useState(''); // Urgent state holding the current text input value
  const [filteredItems, setFilteredItems] = useState(ALL_ITEMS); // Non-urgent state holding the filtered list of items
  const [isPending, startTransition] = useTransition(); // Initialize useTransition to track pending state and schedule low-priority updates
  function handleChange(event) { // Event handler triggered on every input keystroke
    const value = event.target.value; // Read the latest string typed by the user
    setQuery(value); // Urgent update: update the input immediately so typing never lags
    startTransition(() => { // Mark the list filtering update as a low-priority transition
      const normalized = value.toLowerCase(); // Convert the search query to lowercase once for comparison
      const filtered = ALL_ITEMS.filter(item => // Filter the full 10,000-item array
        item.toLowerCase().includes(normalized) // Keep items that contain the search text (case-insensitive)
      ); // End filter callback
      setFilteredItems(filtered); // Schedule the filtered list update at low priority
    }); // End startTransition callback
  } // End handleChange function
  return ( // Return the component JSX
    <div style={styles.container}> {/* Outer centered container */}
      <h1 style={styles.title}>useTransition — Basic Example</h1> {/* Page heading */}
      <p style={styles.description}> {/* Instructional paragraph for the user */}
        Type in the box below. The input stays snappy because only the list filtering is deferred using <code>useTransition</code>. {/* Explanation text */}
      </p> {/* Close description paragraph */}
      <input // Controlled search input element
        type="text" // Standard single-line text input
        value={query} // Bind input value to urgent query state
        onChange={handleChange} // Run handleChange on every keystroke
        placeholder="Type to filter 10,000 items..." // Helper placeholder when input is empty
        style={styles.input} // Apply input styling
      /> {/* End input element */}
      {isPending && ( // Conditionally render pending indicator while transition is active
        <p style={styles.pending}>⏳ Updating list...</p> // Visual feedback shown during background render
      )} {/* End conditional pending indicator */}
      <p style={styles.count}> {/* Result count summary */}
        Showing {filteredItems.length.toLocaleString()} of {ALL_ITEMS.length.toLocaleString()} items {/* Formatted item counts */}
      </p> {/* Close count paragraph */}
      <ul style={styles.list}> {/* Scrollable list container */}
        {filteredItems.slice(0, 100).map(item => ( // Render up to the first 100 matching items
          <li key={item} style={styles.listItem}> {/* List item with unique key */}
            {item} {/* Display the item label */}
          </li> // Close list item
        ))} {/* End map over sliced items */}
        {filteredItems.length > 100 && ( // Show overflow notice when more than 100 items match
          <li style={styles.moreItems}> {/* Styled notice row */}
            ...and {(filteredItems.length - 100).toLocaleString()} more items {/* Remaining item count */}
          </li> // Close notice row
        )} {/* End overflow check */}
      </ul> {/* Close unordered list */}
    </div> // Close outer container
  ); // End return statement
} // End App component
const styles = { // Inline style object for the component
  container: { // Styles for the outer wrapper
    maxWidth: '600px', // Limit maximum width for readability
    margin: '40px auto', // Center horizontally with vertical spacing
    fontFamily: 'system-ui, sans-serif', // Use clean system sans-serif font
    padding: '0 20px', // Add horizontal padding on small screens
  }, // End container styles
  title: { // Styles for the main heading
    color: '#1a1a2e', // Dark navy text color
    marginBottom: '8px', // Space below the heading
  }, // End title styles
  description: { // Styles for the description text
    color: '#555', // Medium gray text color
    marginBottom: '16px', // Space below the description
  }, // End description styles
  input: { // Styles for the search input
    width: '100%', // Span full container width
    padding: '12px 16px', // Comfortable inner padding
    fontSize: '16px', // Readable font size
    border: '2px solid #6c63ff', // Purple accent border
    borderRadius: '8px', // Rounded corners
    outline: 'none', // Remove default browser focus outline
    boxSizing: 'border-box', // Include padding and border in width calculation
  }, // End input styles
  pending: { // Styles for the pending indicator
    color: '#6c63ff', // Purple text matching the input border
    fontStyle: 'italic', // Italicized status text
    margin: '8px 0', // Vertical margin around indicator
  }, // End pending styles
  count: { // Styles for the item count text
    color: '#888', // Muted gray text
    fontSize: '14px', // Slightly smaller font size
    margin: '4px 0 8px', // Compact vertical spacing
  }, // End count styles
  list: { // Styles for the scrollable list
    listStyle: 'none', // Remove default bullet points
    padding: 0, // Remove default left padding
    margin: 0, // Remove default margin
    maxHeight: '400px', // Cap list height to enable scrolling
    overflowY: 'auto', // Enable vertical scrollbar when needed
    border: '1px solid #eee', // Subtle outer border
    borderRadius: '8px', // Rounded corners
  }, // End list styles
  listItem: { // Styles for each list row
    padding: '8px 16px', // Vertical and horizontal row padding
    borderBottom: '1px solid #f0f0f0', // Subtle divider line between rows
    color: '#333', // Dark gray text
    fontSize: '14px', // Standard row font size
  }, // End listItem styles
  moreItems: { // Styles for the overflow summary row
    padding: '12px 16px', // Comfortable padding
    color: '#888', // Muted gray text
    fontStyle: 'italic', // Italicized notice
    textAlign: 'center', // Center-align the notice text
  }, // End moreItems styles
}; // End styles object
