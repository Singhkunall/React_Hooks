/**
 * @fileoverview Example 1 — Basic Counter using useReducer.
 * Demonstrates the core building blocks: initialState, a pure reducer function,
 * dispatching actions with and without payloads, and rendering state in the UI.
 */
import { useReducer } from "react"; // Import the useReducer hook from React

const initialState = { count: 0 }; // Define the starting state object with count initialized to 0

function counterReducer(state, action) { // Pure reducer function: takes current state and action, returns next state
  switch (action.type) { // Inspect action.type to decide which state transition to perform
    case "INCREMENT": // Handle the INCREMENT action
      return { count: state.count + 1 }; // Return a brand-new state object with count increased by 1
    case "DECREMENT": // Handle the DECREMENT action
      return { count: state.count - 1 }; // Return a brand-new state object with count decreased by 1
    case "ADD_AMOUNT": // Handle the ADD_AMOUNT action which includes a numeric payload
      return { count: state.count + action.payload }; // Return a new state object adding action.payload to count
    case "RESET": // Handle the RESET action
      return initialState; // Return the original initialState object to reset count back to 0
    default: // Fallback branch if an unknown action type is ever dispatched
      throw new Error(`Unhandled action type: ${action.type}`); // Throw a descriptive error to catch typos immediately
  } // End switch statement
} // End counterReducer function

export default function App() { // Export the App component as the default export
  const [state, dispatch] = useReducer(counterReducer, initialState); // Initialize useReducer and destructure state and dispatch

  return ( // Return the JSX to render in the browser
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: "420px" }}> {/* Main container with readable spacing */}
      <h1>useReducer Counter</h1> {/* Page heading */}
      <p style={{ fontSize: "2rem", fontWeight: "bold" }}>Count: {state.count}</p> {/* Display the current count value */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}> {/* Flex container for action buttons */}
        <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button> {/* Dispatch DECREMENT action on click */}
        <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button> {/* Dispatch INCREMENT action on click */}
        <button onClick={() => dispatch({ type: "ADD_AMOUNT", payload: 5 })}>+5</button> {/* Dispatch ADD_AMOUNT with payload 5 */}
        <button onClick={() => dispatch({ type: "RESET" })}>Reset</button> {/* Dispatch RESET action to return to 0 */}
      </div> {/* End button container */}
    </div> // End main container
  ); // End return statement
} // End App component
