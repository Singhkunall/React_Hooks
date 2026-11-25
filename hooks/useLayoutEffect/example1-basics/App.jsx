/**
 * @fileoverview Basic useLayoutEffect example demonstrating synchronous DOM measurement
 * before the browser paints, preventing visual flicker when displaying element dimensions.
 */
import { useState, useRef, useLayoutEffect } from 'react'; // Import React hooks for state, DOM refs, and layout effects

export default function App() { // Define and export the main App component
  const [text, setText] = useState('Click the button to grow this box!'); // Store dynamic text rendered inside the measured box
  const [size, setSize] = useState({ width: 0, height: 0 }); // Store measured width and height in pixels
  const boxRef = useRef(null); // Create a ref to access the box DOM element directly

  useLayoutEffect(() => { // Run synchronously after DOM updates and before browser paint
    if (!boxRef.current) return; // Guard in case the DOM node is not yet mounted
    const rect = boxRef.current.getBoundingClientRect(); // Read exact pixel dimensions from the DOM
    setSize({ // Update state with rounded dimensions before the screen paints
      width: Math.round(rect.width), // Round the measured width to an integer
      height: Math.round(rect.height), // Round the measured height to an integer
    }); // Close setSize object
  }, [text]); // Re-measure whenever the box text changes

  const handleAddText = () => { // Handler to append more text to the box
    setText((prev) => prev + ' Adding more words increases the box dimensions.'); // Append a sentence to trigger re-render and re-measure
  }; // End handleAddText handler

  const handleReset = () => { // Handler to restore the original short text
    setText('Click the button to grow this box!'); // Reset text back to initial string
  }; // End handleReset handler

  return ( // Return the component UI
    <div style={{ fontFamily: 'sans-serif', padding: '24px', maxWidth: '540px' }}> {/* Main container */}
      <h1>useLayoutEffect Basics</h1> {/* Page heading */}
      <p> {/* Live dimension readout */}
        Box size before paint: <strong>{size.width}px × {size.height}px</strong> {/* Display width and height */}
      </p> {/* Close readout paragraph */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}> {/* Action buttons container */}
        <button onClick={handleAddText}>Add More Text</button> {/* Button to grow the box */}
        <button onClick={handleReset}>Reset</button> {/* Button to reset the box */}
      </div> {/* Close buttons container */}
      <div // Start measured box element
        ref={boxRef} // Attach ref so useLayoutEffect can measure this div
        style={{ // Apply visual styles to the box
          display: 'inline-block', // Size box to fit its text content
          padding: '16px', // Add inner padding
          border: '2px solid #2563eb', // Blue border to clearly show box edges
          borderRadius: '8px', // Rounded corners
          backgroundColor: '#eff6ff', // Soft blue background
        }} // End inline styles
      > {/* Close opening div tag */}
        {text} {/* Render current dynamic text */}
      </div> {/* Close measured box div */}
    </div> // Close main container
  ); // End return statement
} // End App component
