/**
 * Example 1 — useCallback Basics
 *
 * Demonstrates how useCallback preserves a function's reference across
 * re-renders so a React.memo child component avoids unnecessary re-renders
 * when unrelated parent state (like a theme toggle) changes.
 */
import React, { useState, useCallback } from 'react'; // Import React, useState, and useCallback from the react package

const MemoizedButton = React.memo(function MemoizedButton({ onIncrement, label }) { // Wrap child button in React.memo so it only re-renders if props change
  console.log(`Rendering child button: "${label}"`); // Log to the browser console whenever this child actually re-renders
  return ( // Return the JSX for the child button
    <button onClick={onIncrement} style={{ padding: '10px 16px', marginRight: '8px', cursor: 'pointer' }}> {/* Attach the memoized click handler and button styles */}
      {label} {/* Render the label text passed from the parent */}
    </button> // Close the button element
  ); // End the return statement
}); // End the React.memo component definition

export default function App() { // Export the main App component as the default export
  const [count, setCount] = useState(0); // Create state for the counter, initialized to 0
  const [darkMode, setDarkMode] = useState(false); // Create unrelated state for toggling light/dark theme

  const handleIncrement = useCallback(() => { // Memoize the increment function so its reference stays identical across renders
    setCount((prevCount) => prevCount + 1); // Use functional state update so we don't need 'count' in the dependency array
  }, []); // Empty dependency array means React creates this function only once on mount

  const containerStyle = { // Define dynamic inline styles based on the darkMode state
    backgroundColor: darkMode ? '#1e293b' : '#f8fafc', // Use dark slate background when darkMode is true, light gray otherwise
    color: darkMode ? '#f8fafc' : '#0f172a', // Use light text in dark mode and dark text in light mode
    padding: '24px', // Add inner spacing around the card
    borderRadius: '10px', // Round the corners of the container
    fontFamily: 'system-ui, sans-serif', // Use the system sans-serif font stack
    maxWidth: '420px', // Limit the card width for readability
  }; // End of containerStyle object

  return ( // Return the component's rendered UI
    <div style={containerStyle}> {/* Apply the dynamic theme styles to the root div */}
      <h2>useCallback Basics</h2> {/* Render the example title */}
      <p>Current Count: <strong>{count}</strong></p> {/* Display the live counter value */}
      <MemoizedButton onIncrement={handleIncrement} label="Increment Count" /> {/* Pass the stable callback to the memoized child */}
      <button // Render a button to toggle the unrelated darkMode state
        onClick={() => setDarkMode((prev) => !prev)} // Flip the darkMode boolean when clicked
        style={{ padding: '10px 16px', cursor: 'pointer' }} // Add matching padding and pointer cursor
      > {/* Close opening button tag */}
        Theme: {darkMode ? 'Dark' : 'Light'} {/* Display the active theme name */}
      </button> {/* Close theme toggle button */}
      <p style={{ fontSize: '0.85rem', marginTop: '14px', opacity: 0.8 }}> {/* Helper note for the learner */}
        Open DevTools Console: toggling the theme does NOT re-render "Increment Count"! {/* Explain what to observe in the console */}
      </p> {/* Close helper paragraph */}
    </div> // Close root container div
  ); // End of return statement
} // Close App component
