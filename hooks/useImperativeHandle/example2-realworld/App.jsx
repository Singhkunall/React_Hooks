/**
 * Example 2 — Real-World Use Case: Scrollable Activity Log
 * Demonstrates using useImperativeHandle on a scrollable list component
 * so a parent dashboard can imperatively scroll to the top or bottom
 * without having direct access to the child's container DOM element.
 */
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'; // Import React hooks and forwardRef

// Child component: renders a scrollable list of log messages
const ActivityLog = forwardRef(function ActivityLog({ entries }, ref) { // Accept entries prop and forwarded ref
  const containerRef = useRef(null); // Private ref for the scrollable <div> element

  // Expose only scrollToTop and scrollToBottom methods to the parent
  useImperativeHandle( // Configure the custom ref handle
    ref, // Parent's ref
    () => ({ // Factory function returning scroll helper methods
      scrollToBottom: () => { // Scroll smoothly to the newest entry
        if (containerRef.current) { // Verify the container DOM node is mounted
          containerRef.current.scrollTo({ // Call native DOM scrollTo API
            top: containerRef.current.scrollHeight, // Target the bottom of the scroll area
            behavior: 'smooth', // Use smooth scrolling animation
          }); // End of scrollTo call
        } // End of null check
      }, // End of scrollToBottom method
      scrollToTop: () => { // Scroll smoothly back to the oldest entry
        if (containerRef.current) { // Verify the container DOM node is mounted
          containerRef.current.scrollTo({ // Call native DOM scrollTo API
            top: 0, // Target the very top of the scroll area
            behavior: 'smooth', // Use smooth scrolling animation
          }); // End of scrollTo call
        } // End of null check
      }, // End of scrollToTop method
    }), // End of handle object
    [] // Empty dependency array since containerRef never changes
  ); // End of useImperativeHandle

  return ( // Return the scrollable list UI
    <div // Scrollable box container
      ref={containerRef} // Attach our private ref
      style={{ // Inline styles for fixed height and scroll behavior
        height: '180px', // Fix height so vertical overflow occurs
        overflowY: 'auto', // Enable vertical scrollbar when content overflows
        border: '1px solid #cbd5e1', // Light slate border
        borderRadius: '8px', // Rounded corners
        padding: '12px', // Inner padding
        backgroundColor: '#f8fafc', // Soft light background
      }} // End of style object
    > {/* End of div opening tag */}
      {entries.map((entry, idx) => ( // Render each log entry in the array
        <div // Individual log row
          key={idx} // Use index as key for this append-only list
          style={{ padding: '6px 0', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }} // Row styling
        > {/* End of row opening tag */}
          {entry} {/* Display the log text */}
        </div> // End of row div
      ))} {/* End of map */}
    </div> // End of scrollable box container
  ); // End of return statement
}); // End of ActivityLog component

export default function App() { // Export the main App component
  const logRef = useRef(null); // Ref to call ActivityLog's imperative scroll methods
  const [entries, setEntries] = useState([ // Initial list of activity log entries
    '10:00 AM — Server started', // Entry 1
    '10:01 AM — Connected to database', // Entry 2
    '10:02 AM — Loaded user preferences', // Entry 3
    '10:03 AM — Cache warmed up', // Entry 4
    '10:04 AM — Ready for requests', // Entry 5
  ]); // End of useState

  const addEntry = () => { // Handler to append a new timestamped log entry
    const time = new Date().toLocaleTimeString(); // Format current local time
    setEntries((prev) => [...prev, `${time} — Event #${prev.length + 1} recorded`]); // Append new entry
  }; // End of addEntry

  return ( // Return the parent dashboard UI
    <div style={{ fontFamily: 'sans-serif', maxWidth: '440px', padding: '24px' }}> {/* Page container */}
      <h2>Live Activity Log</h2> {/* Heading */}
      <ActivityLog ref={logRef} entries={entries} /> {/* Render child log with ref */}
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}> {/* Action buttons */}
        <button onClick={addEntry}>Add Log Entry</button> {/* Append a new entry */}
        <button onClick={() => logRef.current?.scrollToBottom()}>Jump to Bottom</button> {/* Scroll down */}
        <button onClick={() => logRef.current?.scrollToTop()}>Jump to Top</button> {/* Scroll up */}
      </div> {/* End of action buttons */}
    </div> // End of page container
  ); // End of return statement
} // End of App component
