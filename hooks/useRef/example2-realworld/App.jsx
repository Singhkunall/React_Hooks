/**
 * @fileoverview Example 2: Real-World Use Case — Stopwatch
 * Uses useState for the visible elapsed time and running status,
 * and useRef to store the setInterval ID and start timestamp
 * without causing unnecessary re-renders.
 */
import { useEffect, useRef, useState } from 'react'; // Import useEffect for cleanup, useRef for timer IDs, and useState for UI

export default function App() { // Define and export the default App component
  const [elapsedMs, setElapsedMs] = useState(0); // State holding elapsed milliseconds to display on screen
  const [isRunning, setIsRunning] = useState(false); // State tracking whether the stopwatch is currently ticking
  const intervalIdRef = useRef(null); // Ref holding the active setInterval ID so we can clear it anytime
  const startTimestampRef = useRef(0); // Ref holding the adjusted start timestamp for accurate pause/resume

  useEffect(() => { // Effect to clean up the interval if the component unmounts while running
    return () => { // Cleanup function runs when the component unmounts
      if (intervalIdRef.current !== null) { // Check if an interval is currently active
        clearInterval(intervalIdRef.current); // Clear the active interval to prevent memory leaks
      } // End active interval check
    }; // End cleanup function
  }, []); // Empty dependency array means cleanup only runs on unmount

  const handleStart = () => { // Start or resume the stopwatch
    if (isRunning) return; // Exit early if the stopwatch is already running
    setIsRunning(true); // Update UI state to reflect running status
    startTimestampRef.current = Date.now() - elapsedMs; // Offset start time by already-elapsed ms for resume support
    intervalIdRef.current = setInterval(() => { // Schedule a repeating 50ms update and save its ID in the ref
      setElapsedMs(Date.now() - startTimestampRef.current); // Calculate and store new elapsed time in state
    }, 50); // Run every 50 milliseconds for smooth centisecond display
  }; // End handleStart

  const handlePause = () => { // Pause the stopwatch
    if (!isRunning) return; // Exit early if already paused
    clearInterval(intervalIdRef.current); // Stop the interval using the ID saved in intervalIdRef
    intervalIdRef.current = null; // Reset the ref to null so we know no interval is active
    setIsRunning(false); // Update UI state to reflect paused status
  }; // End handlePause

  const handleReset = () => { // Stop and reset the stopwatch to zero
    clearInterval(intervalIdRef.current); // Stop any active interval
    intervalIdRef.current = null; // Clear the stored interval ID
    setIsRunning(false); // Mark stopwatch as stopped
    setElapsedMs(0); // Reset visible elapsed time back to 0
  }; // End handleReset

  const formattedSeconds = (elapsedMs / 1000).toFixed(2); // Convert milliseconds to seconds with 2 decimal places

  return ( // Return the stopwatch UI
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '400px', margin: '40px auto', padding: '24px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}> {/* Centered card */}
      <h2>⏱️ React Stopwatch</h2> {/* Title */}
      <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '16px 0', fontVariantNumeric: 'tabular-nums' }}> {/* Large monospace-aligned timer */}
        {formattedSeconds}s {/* Display formatted elapsed seconds */}
      </div> {/* End timer display */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}> {/* Button group */}
        <button onClick={handleStart} disabled={isRunning} style={{ padding: '8px 16px', cursor: isRunning ? 'not-allowed' : 'pointer' }}>Start</button> {/* Start button */}
        <button onClick={handlePause} disabled={!isRunning} style={{ padding: '8px 16px', cursor: !isRunning ? 'not-allowed' : 'pointer' }}>Pause</button> {/* Pause button */}
        <button onClick={handleReset} style={{ padding: '8px 16px', cursor: 'pointer' }}>Reset</button> {/* Reset button */}
      </div> {/* End button group */}
    </div> // End card
  ); // End return
} // End App component
