/**
 * @fileoverview Real-world useLayoutEffect example: a smart tooltip that measures
 * both the trigger button and itself before paint, automatically flipping between
 * top and bottom placement so it never clips off the top edge of the viewport.
 */
import { useState, useRef, useLayoutEffect } from 'react'; // Import hooks for state, DOM refs, and layout effects

export default function App() { // Define and export the main App component
  const [isOpen, setIsOpen] = useState(false); // Track whether the tooltip is currently shown
  const [nearTopEdge, setNearTopEdge] = useState(true); // Simulate button placement near top edge vs lower down
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: 'top' }); // Store calculated tooltip coordinates
  const buttonRef = useRef(null); // Ref for measuring the trigger button's position
  const tooltipRef = useRef(null); // Ref for measuring the tooltip's dimensions

  useLayoutEffect(() => { // Measure and position tooltip synchronously before browser paint
    if (!isOpen || !buttonRef.current || !tooltipRef.current) return; // Exit if tooltip is closed or refs are unavailable
    const btnRect = buttonRef.current.getBoundingClientRect(); // Get trigger button bounding box in viewport
    const tipRect = tooltipRef.current.getBoundingClientRect(); // Get tooltip bounding box before paint
    const gap = 8; // Set 8px spacing between button and tooltip
    const fitsAbove = btnRect.top - tipRect.height - gap >= 0; // Check if tooltip fits above the button without clipping
    const placement = fitsAbove ? 'top' : 'bottom'; // Pick 'top' when space allows, otherwise flip to 'bottom'
    const top = fitsAbove // Compute vertical top coordinate
      ? btnRect.top - tipRect.height - gap // Place above button
      : btnRect.bottom + gap; // Place below button
    const left = btnRect.left + btnRect.width / 2 - tipRect.width / 2; // Horizontally center tooltip over button
    setCoords({ top, left, placement }); // Save computed position before browser paints
  }, [isOpen, nearTopEdge]); // Recompute whenever tooltip opens or button moves

  return ( // Return the component UI
    <div style={{ fontFamily: 'sans-serif', padding: '20px', minHeight: '260px' }}> {/* Outer container */}
      <h1>Smart Auto-Flipping Tooltip</h1> {/* Demo title */}
      <div style={{ marginBottom: '12px' }}> {/* Controls wrapper */}
        <button onClick={() => setNearTopEdge((prev) => !prev)}> {/* Toggle button position */}
          Button Position: {nearTopEdge ? 'Near Top Edge' : 'Lower Down'} {/* Show current mode */}
        </button> {/* Close position toggle button */}
      </div> {/* Close controls wrapper */}
      <div style={{ marginTop: nearTopEdge ? '4px' : '120px', textAlign: 'center' }}> {/* Shift target button vertically */}
        <button // Trigger button for tooltip
          ref={buttonRef} // Attach ref to measure button coordinates
          onClick={() => setIsOpen((prev) => !prev)} // Toggle tooltip visibility
          style={{ padding: '10px 16px', cursor: 'pointer' }} // Button styling
        > {/* Close opening button tag */}
          {isOpen ? 'Hide Tooltip' : 'Show Smart Tooltip'} {/* Dynamic button label */}
        </button> {/* Close trigger button */}
      </div> {/* Close button wrapper */}
      {isOpen && ( // Render tooltip only when open
        <div // Tooltip box element
          ref={tooltipRef} // Attach ref to measure tooltip height and width
          role="tooltip" // Accessibility role
          style={{ // Apply computed fixed viewport coordinates
            position: 'fixed', // Position relative to viewport
            top: `${coords.top}px`, // Computed vertical offset
            left: `${coords.left}px`, // Computed horizontal offset
            padding: '8px 12px', // Inner padding
            backgroundColor: '#1e293b', // Dark background
            color: '#ffffff', // White text
            borderRadius: '6px', // Rounded corners
            fontSize: '14px', // Font size
            pointerEvents: 'none', // Let clicks pass through tooltip
          }} // End tooltip styles
        > {/* Close opening tooltip div */}
          Placed on: <strong>{coords.placement}</strong> (zero flicker!) {/* Show resolved placement */}
        </div> // Close tooltip div
      )} {/* End conditional tooltip render */}
    </div> // Close outer container
  ); // End return statement
} // End App component
