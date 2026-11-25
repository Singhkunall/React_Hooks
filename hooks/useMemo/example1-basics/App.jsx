/**
 * Example 1: The Basics of useMemo
 *
 * Demonstrates how `useMemo` caches the result of an expensive calculation
 * so that unrelated state updates (like changing a theme or typing in an input)
 * do not force the expensive calculation to re-run on every render.
 */
import React, { useState, useMemo } from "react"; // Import React, useState for state, and useMemo for memoization

// Simulate an expensive calculation that takes noticeable time
function slowSquareNumber(num) { // Define a helper function that simulates heavy CPU work
  console.log("Running slowSquareNumber..."); // Log to the console whenever this function actually executes
  for (let i = 0; i < 100000000; i++) { // Run a large loop to simulate a slow computation
    // Intentionally empty loop to create a slight CPU delay
  } // End of the delay loop
  return num * num; // Return the squared value of the input number
} // End of slowSquareNumber

export default function App() { // Define and export the main App component
  const [number, setNumber] = useState(5); // Track the number we want to square, starting at 5
  const [darkMode, setDarkMode] = useState(false); // Track an unrelated UI state (light vs dark theme)

  // Memoize the squared result so it only recalculates when `number` changes
  const squaredNumber = useMemo(() => { // Call useMemo and pass a factory function
    return slowSquareNumber(number); // Compute and return the expensive squared value
  }, [number]); // Dependency array: only re-run when `number` changes, NOT when `darkMode` changes

  // Define inline styles based on the current `darkMode` state
  const themeStyles = { // Create a style object for the container
    backgroundColor: darkMode ? "#1e293b" : "#f8fafc", // Dark slate background in dark mode, light slate otherwise
    color: darkMode ? "#f8fafc" : "#0f172a", // Light text in dark mode, dark text otherwise
    padding: "24px", // Add inner spacing around the content
    borderRadius: "12px", // Round the corners of the container
    fontFamily: "sans-serif", // Use a clean sans-serif font
    maxWidth: "420px", // Limit the width for readability
    margin: "24px auto", // Center the card horizontally with top/bottom margin
    transition: "all 0.2s ease", // Smoothly animate theme color changes
  }; // End of themeStyles object

  return ( // Return the JSX to render in the browser
    <div style={themeStyles}> {/* Main themed container */}
      <h2>useMemo Basics: Expensive Calculation</h2> {/* Section heading */}
      <p> {/* Paragraph for the number input */}
        Number:{" "} {/* Label text with a trailing space */}
        <input // Numeric input element
          type="number" // Restrict input to numbers
          value={number} // Bind input value to `number` state
          onChange={(e) => setNumber(Number(e.target.value))} // Update `number` state when user types
          style={{ padding: "6px", width: "80px" }} // Style the input box
        /> {/* Close input element */}
      </p> {/* Close paragraph */}
      <p> {/* Paragraph displaying the memoized output */}
        Squared Result (Memoized): <strong>{squaredNumber}</strong> {/* Show the cached squared number */}
      </p> {/* Close paragraph */}
      <button // Button to toggle the unrelated theme state
        onClick={() => setDarkMode((prev) => !prev)} // Flip `darkMode` without changing `number`
        style={{ padding: "8px 14px", cursor: "pointer" }} // Add padding and pointer cursor to button
      > {/* Close opening button tag */}
        Toggle {darkMode ? "Light" : "Dark"} Mode {/* Dynamic button label */}
      </button> {/* Close button */}
      <p style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "12px" }}> {/* Helper hint text */}
        Open your browser console: toggling the theme re-renders the component, {/* First part of hint */}
        but <code>slowSquareNumber</code> does NOT re-run! {/* Second part of hint */}
      </p> {/* Close hint paragraph */}
    </div> // Close main container
  ); // End return statement
} // End App component
