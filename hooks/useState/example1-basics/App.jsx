/**
 * @fileoverview Beginner-friendly Counter component demonstrating the basics of useState.
 * Shows how to store a number and a step size in state, update them via buttons
 * and a dropdown, and reset them back to their initial values.
 */
import { useState } from "react"; // Import the useState hook from React

function App() { // Define the main App functional component
  const [count, setCount] = useState(0); // Declare 'count' state starting at 0
  const [step, setStep] = useState(1); // Declare 'step' state starting at 1

  function handleIncrement() { // Handler to increase count by the current step
    setCount((prevCount) => prevCount + step); // Use functional updater for safe addition
  } // End handleIncrement

  function handleDecrement() { // Handler to decrease count by the current step
    setCount((prevCount) => prevCount - step); // Use functional updater for safe subtraction
  } // End handleDecrement

  function handleReset() { // Handler to restore default values
    setCount(0); // Reset count back to 0
    setStep(1); // Reset step size back to 1
  } // End handleReset

  return ( // Return JSX to render the UI
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: "400px", margin: "40px auto", padding: "24px", border: "1px solid #e2e8f0", borderRadius: "12px" }}> {/* Styled card container */}
      <h1 style={{ marginTop: 0 }}>useState Basics: Counter</h1> {/* Page heading */}
      <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "16px 0" }}> {/* Large counter readout */}
        Count: {count} {/* Render current count value */}
      </p> {/* End counter readout */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}> {/* Button group container */}
        <button onClick={handleDecrement} style={{ padding: "8px 16px", cursor: "pointer" }}> {/* Decrement button */}
          - {step} {/* Show current step on button */}
        </button> {/* End decrement button */}
        <button onClick={handleIncrement} style={{ padding: "8px 16px", cursor: "pointer" }}> {/* Increment button */}
          + {step} {/* Show current step on button */}
        </button> {/* End increment button */}
        <button onClick={handleReset} style={{ padding: "8px 16px", cursor: "pointer" }}> {/* Reset button */}
          Reset {/* Button label */}
        </button> {/* End reset button */}
      </div> {/* End button group */}
      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}> {/* Step selector label */}
        <span>Step Size:</span> {/* Descriptive text */}
        <select value={step} onChange={(e) => setStep(Number(e.target.value))}> {/* Controlled dropdown updating step */}
          <option value={1}>1</option> {/* Step option 1 */}
          <option value={5}>5</option> {/* Step option 5 */}
          <option value={10}>10</option> {/* Step option 10 */}
        </select> {/* End select dropdown */}
      </label> {/* End step selector label */}
    </main> // End main card container
  ); // End return statement
} // End App component

export default App; // Export App as the default export
