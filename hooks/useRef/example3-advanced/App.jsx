/**
 * @fileoverview Example 3: Advanced Pattern — Tracking Previous State & Auto-Scrolling List
 * Composes useRef, useState, and useEffect to:
 * 1. Remember the previous value of state across renders.
 * 2. Automatically scroll a chat/log container to the newest item using a DOM ref.
 */
import { useEffect, useRef, useState } from 'react'; // Import useEffect, useRef, and useState

export default function App() { // Define and export the default App component
  const [price, setPrice] = useState(100); // Current price stored in state
  const [history, setHistory] = useState([100]); // Array of price history entries for the log
  const prevPriceRef = useRef(price); // Ref to capture the previous render's price
  const listEndRef = useRef(null); // DOM ref placed at the bottom of the scrollable history list

  useEffect(() => { // Effect runs AFTER render commits to the DOM
    prevPriceRef.current = price; // Save current price into the ref so it is available as "previous" next render
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Smoothly scroll the bottom marker into view
  }, [price]); // Re-run whenever 'price' changes

  const previousPrice = prevPriceRef.current; // Read the previous price from before this render's effect runs
  const delta = price - previousPrice; // Compute the change since the last price update
  const trendLabel = delta > 0 ? '📈 Up' : delta < 0 ? '📉 Down' : '➖ No Change'; // Choose a visual trend indicator

  const updatePrice = (change) => { // Helper function to apply a price change and log it
    const nextPrice = Math.max(0, price + change); // Prevent price from dropping below 0
    setPrice(nextPrice); // Update current price state
    setHistory((prev) => [...prev, nextPrice]); // Append new price to the history log
  }; // End updatePrice

  return ( // Return the UI
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '440px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}> {/* Card container */}
      <h2>📊 Price Tracker (Previous Value + Auto-Scroll)</h2> {/* Heading */}
      <p>Current Price: <strong>${price}</strong></p> {/* Current price display */}
      <p>Previous Price: <strong>${previousPrice}</strong></p> {/* Previous price read from prevPriceRef */}
      <p>Trend: <strong>{trendLabel}</strong> ({delta >= 0 ? `+${delta}` : delta})</p> {/* Trend and delta display */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}> {/* Button row */}
        <button onClick={() => updatePrice(10)} style={{ padding: '8px 12px', cursor: 'pointer' }}>+$10</button> {/* Increase price by $10 */}
        <button onClick={() => updatePrice(-10)} style={{ padding: '8px 12px', cursor: 'pointer' }}>-$10</button> {/* Decrease price by $10 */}
      </div> {/* End button row */}
      <div style={{ height: '120px', overflowY: 'auto', border: '1px solid #eee', padding: '8px', borderRadius: '4px', background: '#fafafa' }}> {/* Scrollable log container */}
        {history.map((item, idx) => ( // Map over each recorded price
          <div key={idx} style={{ padding: '2px 0' }}>Update #{idx + 1}: ${item}</div> // Render history entry
        ))} {/* End map */}
        <div ref={listEndRef} /> {/* Empty marker div targeted by listEndRef for auto-scrolling */}
      </div> {/* End scrollable container */}
    </div> // End card container
  ); // End return
} // End App component
