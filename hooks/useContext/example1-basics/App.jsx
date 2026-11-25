/**
 * Example 1 — useContext Basics: Theme Switcher & Shared Counter
 *
 * Demonstrates the simplest possible use of React's createContext and useContext
 * to share a theme ('light' | 'dark') and a counter across nested components
 * without passing props through intermediate layers.
 */
import { createContext, useContext, useState } from 'react'; // Import createContext, useContext, and useState from React

const ThemeContext = createContext(null); // Create a Context object with null as the default fallback value

function ThemedCard() { // Define a nested child component that consumes ThemeContext
  const { theme, toggleTheme, count, increment, reset } = useContext(ThemeContext); // Read shared state and actions directly from ThemeContext
  const isDark = theme === 'dark'; // Compute a boolean flag to check if dark mode is active

  const cardStyle = { // Define inline styles that adapt to the current theme
    padding: '24px', // Add comfortable inner spacing around the card content
    borderRadius: '12px', // Round the corners of the card
    marginTop: '16px', // Add space between the info banner and this card
    backgroundColor: isDark ? '#1e293b' : '#f8fafc', // Use dark slate in dark mode or soft white in light mode
    color: isDark ? '#f8fafc' : '#0f172a', // Use light text in dark mode or dark text in light mode
    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1', // Match the border color to the active theme
    fontFamily: 'system-ui, sans-serif', // Use a clean system font stack
  }; // End cardStyle object

  return ( // Return the JSX for the themed card
    <div style={cardStyle}> {/* Render the styled card container */}
      <h2>Active Theme: {theme.toUpperCase()}</h2> {/* Display the current theme in uppercase */}
      <p>Shared Counter Value: <strong>{count}</strong></p> {/* Display the current shared counter value */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}> {/* Lay out action buttons in a horizontal row */}
        <button onClick={toggleTheme}> {/* Button that toggles between light and dark themes */}
          Switch to {isDark ? 'Light' : 'Dark'} Mode {/* Dynamic label showing the opposite theme */}
        </button> {/* Close theme toggle button */}
        <button onClick={increment}>+1 Counter</button> {/* Button that increments the shared counter */}
        <button onClick={reset}>Reset Counter</button> {/* Button that resets the shared counter to zero */}
      </div> {/* Close button row */}
    </div> // Close card container
  ); // End return statement
} // End ThemedCard component

function MiddleLayer() { // Define a middleman component to prove zero prop drilling is needed
  return ( // Return JSX wrapping ThemedCard
    <section> {/* Semantic section wrapper */}
      <p style={{ fontFamily: 'system-ui, sans-serif', color: '#64748b' }}> {/* Muted explanatory text */}
        MiddleLayer receives <strong>0 props</strong>, yet ThemedCard below reads the theme directly! {/* Explain what is happening */}
      </p> {/* Close explanatory paragraph */}
      <ThemedCard /> {/* Render ThemedCard without passing any props */}
    </section> // Close section wrapper
  ); // End return statement
} // End MiddleLayer component

export default function App() { // Define and export the root App component
  const [theme, setTheme] = useState('light'); // Store the active theme ('light' or 'dark') in local state
  const [count, setCount] = useState(0); // Store the shared counter value in local state

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')); // Flip theme between light and dark
  const increment = () => setCount((prev) => prev + 1); // Increase the counter by 1 using functional state update
  const reset = () => setCount(0); // Reset the counter back to 0

  return ( // Return the root JSX wrapped in ThemeContext.Provider
    <ThemeContext.Provider value={{ theme, toggleTheme, count, increment, reset }}> {/* Broadcast state and updaters to all descendants */}
      <div style={{ maxWidth: '520px', margin: '40px auto', padding: '0 16px' }}> {/* Center the demo on the page */}
        <h1 style={{ fontFamily: 'system-ui, sans-serif' }}>useContext Basics</h1> {/* Render page title */}
        <MiddleLayer /> {/* Render MiddleLayer inside the Provider */}
      </div> {/* Close centered container */}
    </ThemeContext.Provider> // Close ThemeContext.Provider
  ); // End return statement
} // End App component
