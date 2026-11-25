/**
 * @fileoverview Real-world Feedback Form component using multiple useState hooks.
 * Demonstrates controlled form inputs, live character counting, client-side
 * validation, and conditional rendering of a confirmation screen.
 */
import { useState } from "react"; // Import the useState hook from React

function App() { // Define the main App functional component
  const [name, setName] = useState(""); // Track the user's name input
  const [category, setCategory] = useState("bug"); // Track the selected feedback category
  const [message, setMessage] = useState(""); // Track the feedback message text
  const [error, setError] = useState(""); // Track validation error messages
  const [isSubmitted, setIsSubmitted] = useState(false); // Track whether the form was submitted

  const maxLength = 200; // Maximum allowed characters for the message

  function handleSubmit(event) { // Handle form submission
    event.preventDefault(); // Stop the browser from reloading the page
    if (!name.trim() || message.trim().length < 10) { // Validate name and minimum message length
      setError("Please enter your name and at least 10 characters of feedback."); // Set error message
      return; // Exit early without submitting
    } // End validation check
    setError(""); // Clear any previous validation errors
    setIsSubmitted(true); // Switch UI to the confirmation screen
  } // End handleSubmit

  function handleReset() { // Reset all fields to submit another report
    setName(""); // Clear name input
    setCategory("bug"); // Reset category to 'bug'
    setMessage(""); // Clear message textarea
    setError(""); // Clear error state
    setIsSubmitted(false); // Return to the form view
  } // End handleReset

  if (isSubmitted) { // Check if the form has been submitted
    return ( // Render the confirmation card
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: "440px", margin: "40px auto", padding: "24px", border: "1px solid #bbf7d0", backgroundColor: "#f0fdf4", borderRadius: "12px" }}> {/* Success card */}
        <h2 style={{ marginTop: 0 }}>Thank you, {name}!</h2> {/* Personalized heading */}
        <p>Your <strong>{category}</strong> feedback has been recorded.</p> {/* Category summary */}
        <blockquote style={{ margin: "12px 0", padding: "8px 12px", background: "#ffffff", borderLeft: "4px solid #22c55e" }}> {/* Quoted message */}
          {message} {/* Display submitted message */}
        </blockquote> {/* End blockquote */}
        <button onClick={handleReset} style={{ padding: "8px 16px", cursor: "pointer" }}> {/* Reset button */}
          Submit Another {/* Button text */}
        </button> {/* End reset button */}
      </main> // End success card
    ); // End early return
  } // End isSubmitted check

  return ( // Render the feedback form
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: "440px", margin: "40px auto", padding: "24px", border: "1px solid #e2e8f0", borderRadius: "12px" }}> {/* Form card */}
      <h1 style={{ marginTop: 0 }}>Send Feedback</h1> {/* Form heading */}
      {error && <p style={{ color: "#dc2626", fontWeight: "500" }}>{error}</p>} {/* Show error if present */}
      <form onSubmit={handleSubmit}> {/* Attach submit handler to form */}
        <div style={{ marginBottom: "12px" }}> {/* Name field wrapper */}
          <label style={{ display: "block", marginBottom: "4px" }}>Name</label> {/* Name label */}
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} /> {/* Controlled name input */}
        </div> {/* End name wrapper */}
        <div style={{ marginBottom: "12px" }}> {/* Category field wrapper */}
          <label style={{ display: "block", marginBottom: "4px" }}>Category</label> {/* Category label */}
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "8px" }}> {/* Controlled category select */}
            <option value="bug">Bug Report</option> {/* Bug report option */}
            <option value="feature">Feature Request</option> {/* Feature request option */}
            <option value="general">General Question</option> {/* General question option */}
          </select> {/* End select */}
        </div> {/* End category wrapper */}
        <div style={{ marginBottom: "16px" }}> {/* Message field wrapper */}
          <label style={{ display: "block", marginBottom: "4px" }}>Message ({message.length}/{maxLength})</label> {/* Label with live counter */}
          <textarea value={message} maxLength={maxLength} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Describe what happened..." style={{ width: "100%", padding: "8px", boxSizing: "border-box" }} /> {/* Controlled textarea */}
        </div> {/* End message wrapper */}
        <button type="submit" style={{ padding: "10px 18px", cursor: "pointer" }}> {/* Submit button */}
          Submit Feedback {/* Button label */}
        </button> {/* End submit button */}
      </form> {/* End form */}
    </main> // End form card
  ); // End return statement
} // End App component

export default App; // Export App as the default export
