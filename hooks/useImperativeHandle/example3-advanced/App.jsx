/**
 * Example 3 — Advanced Pattern: Encapsulated Stopwatch Controller
 * Composes useImperativeHandle with useState, useRef, and useEffect.
 * Demonstrates passing dependencies (`[seconds]`) to useImperativeHandle so
 * that exposed getter methods (`getElapsedSeconds`) never read stale state.
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'; // Import React hooks

// Child component: manages its own timer interval and exposes imperative controls
const Stopwatch = forwardRef(function Stopwatch({ title }, ref) { // Accept title prop and forwarded ref
  const [seconds, setSeconds] = useState(0); // Track elapsed seconds in component state
  const [isRunning, setIsRunning] = useState(false); // Track whether the timer is currently ticking
  const intervalRef = useRef(null); // Private ref to hold the active setInterval ID

  useEffect(() => { // Side effect to start/stop the 1-second interval
    if (isRunning) { // Only start an interval when isRunning is true
      intervalRef.current = setInterval(() => { // Create a 1000ms interval
        setSeconds((prev) => prev + 1); // Increment seconds using functional state update
      }, 1000); // Tick every 1 second
    } // End of if (isRunning)
    return () => { // Cleanup function runs before next effect or on unmount
      if (intervalRef.current) clearInterval(intervalRef.current); // Stop any active interval
    }; // End of cleanup function
  }, [isRunning]); // Re-run effect whenever isRunning changes

  // Expose start, stop, reset, and getElapsedSeconds to the parent
  useImperativeHandle( // Configure the custom imperative handle
    ref, // Parent's ref
    () => ({ // Factory function returning the control API
      start: () => setIsRunning(true), // Start or resume the timer
      stop: () => setIsRunning(false), // Pause the timer
      reset: () => { // Pause and reset elapsed time back to zero
        setIsRunning(false); // Stop ticking
        setSeconds(0); // Reset seconds to 0
      }, // End of reset method
      getElapsedSeconds: () => seconds, // Return the latest elapsed seconds
    }), // End of handle object
    [seconds] // Include `seconds` so getElapsedSeconds always has the fresh value
  ); // End of useImperativeHandle

  return ( // Render the Stopwatch display card
    <div style={{ padding: '16px', border: '1px solid #94a3b8', borderRadius: '8px', background: '#f8fafc' }}> {/* Card */}
      <div style={{ fontSize: '14px', color: '#475569' }}>{title}</div> {/* Timer title */}
      <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '4px' }}> {/* Large time readout */}
        {seconds}s {/* Display elapsed seconds */}
        <span style={{ fontSize: '14px', marginLeft: '10px', color: isRunning ? '#16a34a' : '#64748b' }}> {/* Status */}
          {isRunning ? '● Running' : '❚❚ Paused'} {/* Show running or paused indicator */}
        </span> {/* End of status span */}
      </div> {/* End of time readout */}
    </div> // End of card
  ); // End of return statement
}); // End of Stopwatch component

export default function App() { // Export the main App component
  const stopwatchRef = useRef(null); // Ref to control the child Stopwatch imperatively
  const [snapshots, setSnapshots] = useState([]); // Store captured time snapshots in parent state

  const captureSnapshot = () => { // Read current seconds from child and save to list
    const currentSeconds = stopwatchRef.current?.getElapsedSeconds(); // Call exposed getter
    if (currentSeconds !== undefined) { // Ensure the handle was available
      setSnapshots((prev) => [...prev, currentSeconds]); // Append snapshot to parent list
    } // End of undefined check
  }; // End of captureSnapshot

  return ( // Return the parent dashboard UI
    <div style={{ fontFamily: 'sans-serif', maxWidth: '420px', padding: '24px' }}> {/* Main container */}
      <h2>Imperative Stopwatch Controller</h2> {/* Heading */}
      <Stopwatch ref={stopwatchRef} title="Session Timer" /> {/* Render Stopwatch with ref */}
      <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}> {/* Control buttons */}
        <button onClick={() => stopwatchRef.current?.start()}>Start</button> {/* Start timer */}
        <button onClick={() => stopwatchRef.current?.stop()}>Stop</button> {/* Pause timer */}
        <button onClick={() => stopwatchRef.current?.reset()}>Reset</button> {/* Reset timer */}
        <button onClick={captureSnapshot}>Capture Lap</button> {/* Record current seconds */}
      </div> {/* End of control buttons */}
      {snapshots.length > 0 && ( // Only render lap list if snapshots exist
        <div style={{ marginTop: '16px' }}> {/* Lap list container */}
          <strong>Captured Laps:</strong> {snapshots.map((s) => `${s}s`).join(', ')} {/* Format laps */}
        </div> // End of lap list container
      )} {/* End of conditional render */}
    </div> // End of main container
  ); // End of return statement
} // End of App component
