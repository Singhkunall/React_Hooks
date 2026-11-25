/**
 * Example 1 — Basics of useImperativeHandle
 * Demonstrates how a child component (FancyInput) can expose only specific
 * imperative methods (focusInput, clearInput) to its parent without leaking
 * the underlying <input> DOM element.
 */
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'; // Import React hooks and forwardRef

// Wrap FancyInput with forwardRef so it can receive a ref from App
const FancyInput = forwardRef(function FancyInput(props, ref) { // Define child component accepting props and ref
  const inputRef = useRef(null); // Create a private ref for the internal <input> element
  const [focusCount, setFocusCount] = useState(0); // Track how many times the input was focused

  // Define the exact object that the parent's ref.current will point to
  useImperativeHandle( // Call useImperativeHandle to customize the exposed ref value
    ref, // First argument: the ref forwarded from the parent
    () => ({ // Second argument: factory function returning the public API object
      focusInput: () => { // Expose a method to focus the input
        inputRef.current?.focus(); // Safely focus the private DOM input
        setFocusCount((c) => c + 1); // Increment the internal focus counter
      }, // End of focusInput method
      clearInput: () => { // Expose a method to clear the input's text
        if (inputRef.current) { // Check that the DOM node exists
          inputRef.current.value = ''; // Reset the input value to an empty string
        } // End of null check
      }, // End of clearInput method
    }), // End of returned handle object
    [] // Empty dependency array: create this handle once when mounted
  ); // End of useImperativeHandle

  return ( // Return the JSX for FancyInput
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}> {/* Wrapper for input and counter */}
      <input // Render the actual HTML input
        ref={inputRef} // Attach our private ref to this DOM node
        type="text" // Set input type to plain text
        placeholder={props.placeholder} // Display placeholder passed via props
        style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #94a3b8' }} // Style input
      /> {/* End of input element */}
      <small style={{ color: '#475569' }}>Focused via parent: {focusCount} times</small> {/* Show focus counter */}
    </div> // End of wrapper div
  ); // End of return statement
}); // End of FancyInput component

export default function App() { // Define and export the main App component
  const fancyInputRef = useRef(null); // Create a ref to hold FancyInput's custom handle

  return ( // Return the UI for the parent App
    <div style={{ fontFamily: 'sans-serif', maxWidth: '380px', padding: '24px' }}> {/* Main container */}
      <h2>useImperativeHandle — Basics</h2> {/* Page heading */}
      <p style={{ color: '#334155' }}> {/* Helper description */}
        The parent can focus or clear the input, without touching the raw DOM node. {/* Description text */}
      </p> {/* End of paragraph */}
      <FancyInput ref={fancyInputRef} placeholder="Type something here..." /> {/* Render child with ref */}
      <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}> {/* Button container */}
        <button onClick={() => fancyInputRef.current?.focusInput()}> {/* Trigger exposed focusInput */}
          Focus Input {/* Button label */}
        </button> {/* End of Focus button */}
        <button onClick={() => fancyInputRef.current?.clearInput()}> {/* Trigger exposed clearInput */}
          Clear Input {/* Button label */}
        </button> {/* End of Clear button */}
      </div> {/* End of button container */}
    </div> // End of main container
  ); // End of return statement
} // End of App component
