/**
 * @fileoverview Advanced useLayoutEffect example: an animated sliding tab indicator
 * composing useState, useRef, useEffect (for window resize), and an SSR-safe
 * useIsomorphicLayoutEffect to measure tab geometry before paint.
 */
import { useState, useRef, useLayoutEffect, useEffect } from 'react'; // Import React hooks

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect; // Guard against SSR warnings

const TABS = ['Overview', 'Architecture', 'Performance', 'API Reference']; // Define tab labels

export default function App() { // Define and export the main App component
  const [activeIndex, setActiveIndex] = useState(0); // Track currently selected tab index
  const [indicator, setIndicator] = useState({ left: 0, width: 0 }); // Track underline left offset and width
  const tabRefs = useRef([]); // Store DOM references for each tab button

  const measureActiveTab = () => { // Helper to measure the active tab button's position and width
    const activeButton = tabRefs.current[activeIndex]; // Get DOM element for active tab
    if (!activeButton) return; // Guard if ref is not mounted yet
    setIndicator({ // Update indicator geometry
      left: activeButton.offsetLeft, // Horizontal offset inside tab bar
      width: activeButton.offsetWidth, // Exact button width in pixels
    }); // Close setIndicator call
  }; // End measureActiveTab helper

  useIsomorphicLayoutEffect(() => { // Run synchronously after DOM update and before paint
    measureActiveTab(); // Measure active tab so underline is positioned before first paint
  }, [activeIndex]); // Re-run when active tab changes

  useEffect(() => { // Attach window resize listener after paint
    window.addEventListener('resize', measureActiveTab); // Recalculate indicator on viewport resize
    return () => window.removeEventListener('resize', measureActiveTab); // Clean up listener on unmount or re-run
  }, [activeIndex]); // Re-bind with latest activeIndex

  return ( // Return component UI
    <div style={{ fontFamily: 'sans-serif', padding: '24px', maxWidth: '600px' }}> {/* Main container */}
      <h1>Sliding Tab Indicator</h1> {/* Heading */}
      <div // Tab bar container
        role="tablist" // Accessibility role for tabs
        style={{ position: 'relative', display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0' }} // Flex layout with bottom border
      > {/* Close tablist opening tag */}
        {TABS.map((label, index) => ( // Render each tab button
          <button // Tab button element
            key={label} // Unique key for list rendering
            role="tab" // Accessibility role
            aria-selected={activeIndex === index} // Screen reader active state
            ref={(el) => (tabRefs.current[index] = el)} // Store DOM node in tabRefs array
            onClick={() => setActiveIndex(index)} // Activate clicked tab
            style={{ // Tab button styles
              padding: '10px 14px', // Inner spacing
              border: 'none', // Remove default border
              background: 'transparent', // Transparent background
              cursor: 'pointer', // Pointer cursor on hover
              fontWeight: activeIndex === index ? '700' : '400', // Bold active tab
              color: activeIndex === index ? '#2563eb' : '#475569', // Blue text for active tab
            }} // End button styles
          > {/* Close button opening tag */}
            {label} {/* Display tab label */}
          </button> // Close tab button
        ))} {/* End map over TABS */}
        <span // Sliding underline indicator
          style={{ // Position and animate the underline
            position: 'absolute', // Position relative to tablist
            bottom: '-2px', // Align with bottom border
            left: `${indicator.left}px`, // Measured horizontal offset
            width: `${indicator.width}px`, // Measured tab width
            height: '2px', // Underline thickness
            backgroundColor: '#2563eb', // Blue underline color
            transition: 'left 220ms ease, width 220ms ease', // Smooth slide and resize animation
          }} // End indicator styles
        /> {/* Close indicator span */}
      </div> {/* Close tablist container */}
      <p style={{ marginTop: '20px', color: '#334155' }}> {/* Active tab content panel */}
        Active Tab: <strong>{TABS[activeIndex]}</strong> {/* Display current tab name */}
      </p> {/* Close content paragraph */}
    </div> // Close main container
  ); // End return statement
} // End App component
