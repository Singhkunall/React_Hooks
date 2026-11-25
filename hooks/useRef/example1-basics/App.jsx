/**
 * @fileoverview Example 1: useRef Basics
 * Demonstrates the two primary uses of useRef:
 * 1. Accessing a DOM element directly (focusing an <input>).
 * 2. Storing a mutable value across renders without triggering re-renders.
 */
import { useRef, useState } from 'react'; // Import useRef for mutable refs and useState for UI refreshes

export default function App() { // Define and export the default App component
  const inputRef = useRef(null); // Create a ref to hold a reference to the <input> DOM node
  const silentCountRef = useRef(0); // Create a ref to count clicks without triggering a re-render
  const [renderCount, setRenderCount] = useState(0); // State counter used only to demonstrate manual re-renders

  const handleFocusInput = () => { // Handler function for the Focus Input button
    if (inputRef.current) { // Check that the DOM node is mounted before calling methods on it
      inputRef.current.focus(); // Call the native browser .focus() method on the <input> element
    } // End null check
  }; // End handleFocusInput

  const handleSilentIncrement = () => { // Handler function for the Silent Click button
    silentCountRef.current += 1; // Mutate .current directly; React does NOT re-render on this change
    console.log('Silent count is now:', silentCountRef.current); // Log the live ref value to the browser console
  }; // End handleSilentIncrement

  const handleRefreshScreen = () => { // Handler function to force a component re-render
    setRenderCount((prev) => prev + 1); // Update state so React re-renders and reads the latest ref value
  }; // End handleRefreshScreen

  return ( // Return the JSX to render in the browser
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '480px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}> {/* Card container */}
      <h2>useRef Basics</h2> {/* Section heading */}
      <p style={{ color: '#555' }}>1. DOM Access: Click the button to focus the input.</p> {/* Instruction text */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}> {/* Flex row for input and button */}
        <input ref={inputRef} type="text" placeholder="Type something..." style={{ flex: 1, padding: '8px' }} /> {/* Attach inputRef to this input */}
        <button onClick={handleFocusInput} style={{ padding: '8px 12px', cursor: 'pointer' }}>Focus Input</button> {/* Button that focuses the input */}
      </div> {/* End flex row */}
      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} /> {/* Visual divider */}
      <p style={{ color: '#555' }}>2. Mutable Box: Silent clicks do not re-render until you refresh.</p> {/* Explanation text */}
      <p>Silent Clicks (from ref): <strong>{silentCountRef.current}</strong></p> {/* Displays ref value from the latest render */}
      <p>Screen Refreshes (from state): <strong>{renderCount}</strong></p> {/* Displays total state-triggered renders */}
      <div style={{ display: 'flex', gap: '8px' }}> {/* Flex row for counter buttons */}
        <button onClick={handleSilentIncrement} style={{ padding: '8px 12px', cursor: 'pointer' }}>Silent Click (+1)</button> {/* Increments ref without re-rendering */}
        <button onClick={handleRefreshScreen} style={{ padding: '8px 12px', cursor: 'pointer' }}>Refresh Screen</button> {/* Triggers re-render to reveal updated ref */}
      </div> {/* End button row */}
    </div> // End card container
  ); // End return
} // End App component
