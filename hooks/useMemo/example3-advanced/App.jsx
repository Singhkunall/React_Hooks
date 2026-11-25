/**
 * Example 3: Advanced Pattern — Referential Equality with React.memo & useCallback
 *
 * Demonstrates why `useMemo` is essential for stabilizing object references
 * passed to memoized child components (`React.memo`) and as dependencies
 * inside `useEffect` or `useCallback`.
 */
import React, { useState, useMemo, useCallback, memo } from "react"; // Import hooks and React.memo

// Wrap child component in React.memo so it only re-renders when its props change by reference
const ExpensiveChartSummary = memo(function ExpensiveChartSummary({ config, onReset }) { // Memoized child component
  console.log("ExpensiveChartSummary rendered!"); // Log whenever this child actually re-renders

  return ( // Return child component UI
    <div // Card container for the summary
      style={{ // Inline styles
        border: "2px solid #3b82f6", // Blue border to highlight the memoized child
        borderRadius: "8px", // Rounded corners
        padding: "16px", // Inner padding
        marginTop: "16px", // Space above the card
        backgroundColor: "#eff6ff", // Light blue background
      }} // End style object
    > {/* Close opening div tag */}
      <h3 style={{ margin: "0 0 8px 0" }}>Memoized Child Summary</h3> {/* Child heading */}
      <p style={{ margin: "4px 0" }}> {/* Display multiplier from config object */}
        Multiplier: <strong>{config.multiplier}x</strong> {/* Show multiplier value */}
      </p> {/* Close paragraph */}
      <p style={{ margin: "4px 0" }}> {/* Display currency from config object */}
        Currency: <strong>{config.currency}</strong> {/* Show currency code */}
      </p> {/* Close paragraph */}
      <button onClick={onReset} style={{ marginTop: "8px", padding: "6px 12px" }}> {/* Reset button */}
        Reset Multiplier {/* Button label */}
      </button> {/* Close button */}
    </div> // Close card container
  ); // End return
}); // End React.memo wrapper

export default function App() { // Define and export the parent App component
  const [multiplier, setMultiplier] = useState(2); // State that DOES affect the child's config
  const [currency, setCurrency] = useState("USD"); // State that DOES affect the child's config
  const [notes, setNotes] = useState(""); // Unrelated parent state (typing here should NOT re-render child)

  // Memoize the `config` object so its reference stays identical across unrelated renders
  const chartConfig = useMemo(() => { // Create a stable object reference
    return { // Return the configuration object
      multiplier, // Include current multiplier
      currency, // Include current currency
    }; // End config object
  }, [multiplier, currency]); // Only allocate a new object when `multiplier` or `currency` changes

  // Memoize the callback function so `onReset` also keeps a stable reference
  const handleReset = useCallback(() => { // Create a stable function reference
    setMultiplier(1); // Reset multiplier back to 1
  }, []); // Empty dependency array means `handleReset` never changes

  // Compose a derived calculation using the memoized `chartConfig`
  const sampleProjection = useMemo(() => { // Compute a projected value based on `chartConfig`
    const baseAmount = 100; // Base amount for projection
    return `${chartConfig.currency} ${baseAmount * chartConfig.multiplier}`; // Format projected string
  }, [chartConfig]); // Depends on `chartConfig`, which is itself memoized

  return ( // Return parent JSX
    <div style={{ fontFamily: "sans-serif", maxWidth: "480px", margin: "24px auto" }}> {/* Main wrapper */}
      <h2>useMemo + React.memo: Referential Stability</h2> {/* Heading */}

      <div style={{ marginBottom: "12px" }}> {/* Controls for multiplier and currency */}
        <button onClick={() => setMultiplier((m) => m + 1)} style={{ marginRight: "8px" }}> {/* Increment button */}
          Increase Multiplier ({multiplier}x) {/* Button text */}
        </button> {/* Close button */}
        <button onClick={() => setCurrency((c) => (c === "USD" ? "EUR" : "USD"))}> {/* Toggle currency */}
          Switch Currency ({currency}) {/* Button text */}
        </button> {/* Close button */}
      </div> {/* Close controls div */}

      <div style={{ marginBottom: "12px" }}> {/* Unrelated input section */}
        <label> {/* Label for notes input */}
          Unrelated Notes (does NOT re-render child):{" "} {/* Label text */}
          <input // Text input for notes
            type="text" // Text input type
            value={notes} // Controlled value
            onChange={(e) => setNotes(e.target.value)} // Update unrelated `notes` state
            placeholder="Type here and watch console..." // Helpful placeholder
            style={{ width: "100%", padding: "8px", marginTop: "4px", boxSizing: "border-box" }} // Full-width style
          /> {/* Close input */}
        </label> {/* Close label */}
      </div> {/* Close unrelated input div */}

      <p> {/* Display derived projection */}
        Projected Value: <strong>{sampleProjection}</strong> {/* Show memoized projection */}
      </p> {/* Close paragraph */}

      {/* Pass memoized object and memoized callback to React.memo child */}
      <ExpensiveChartSummary config={chartConfig} onReset={handleReset} /> {/* Render memoized child */}
    </div> // Close main wrapper
  ); // End return statement
} // End App component
