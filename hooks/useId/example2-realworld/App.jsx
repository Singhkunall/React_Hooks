/**
 * @fileoverview Example 2 — Real-World Accessible Registration Form with useId
 * Demonstrates deriving multiple related IDs (input, error, hint) from a single
 * useId() call and wiring aria-invalid and aria-describedby for screen readers.
 */
import { useState, useId } from 'react'; // Import useState for form data/errors and useId for accessible IDs
function FormField({ label, type, value, onChange, error, hint }) { // Reusable accessible form field component
  const baseId = useId(); // Generate one unique base ID per FormField instance
  const errorId = `${baseId}-error`; // Derive a unique ID for the error message element
  const hintId = `${baseId}-hint`; // Derive a unique ID for the helper hint element
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined; // Combine active hint and error IDs for aria-describedby
  return ( // Return the accessible field markup
    <div style={{ marginBottom: '18px' }}> {/* Field container with bottom spacing */}
      <label // Label linked to the input via htmlFor
        htmlFor={baseId} // Match the input's id attribute
        style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: error ? '#dc2626' : '#374151' }} // Turn label red when field has an error
      > {/* Close opening label tag */}
        {label} {/* Render the field label text */}
      </label> {/* Close label element */}
      <input // Controlled input element with ARIA attributes
        id={baseId} // Assign baseId so label htmlFor links here
        type={type} // Input type (text, email, password)
        value={value} // Controlled value from parent state
        onChange={onChange} // Notify parent when input changes
        aria-invalid={Boolean(error)} // Inform assistive tech whether the current value is invalid
        aria-describedby={describedBy} // Link input to its hint and/or error message IDs
        style={{ // Inline input styles
          display: 'block', // Full-line block element
          width: '100%', // Fill container width
          padding: '10px 12px', // Comfortable inner padding
          fontSize: '15px', // Readable font size
          border: `2px solid ${error ? '#dc2626' : '#d1d5db'}`, // Red border on error, gray otherwise
          borderRadius: '6px', // Rounded corners
          boxSizing: 'border-box', // Include padding in total width
          backgroundColor: error ? '#fef2f2' : '#ffffff', // Subtle red tint when invalid
        }} // End style object
      /> {/* Close input element */}
      {hint && ( // Render helper hint text when provided
        <p id={hintId} style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#6b7280' }}> {/* Hint paragraph linked via hintId */}
          {hint} {/* Display the hint text */}
        </p> // Close hint paragraph
      )} {/* End conditional hint */}
      {error && ( // Render validation error message when present
        <p id={errorId} role="alert" style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#dc2626', fontWeight: '500' }}> {/* Error paragraph announced by screen readers */}
          {error} {/* Display the validation error message */}
        </p> // Close error paragraph
      )} {/* End conditional error */}
    </div> // Close field container
  ); // End FormField return
} // End FormField component
function RegistrationForm() { // Stateful registration form using FormField components
  const [name, setName] = useState(''); // Store full name input value
  const [email, setEmail] = useState(''); // Store email input value
  const [password, setPassword] = useState(''); // Store password input value
  const [errors, setErrors] = useState({}); // Store validation error messages by field key
  const [submitted, setSubmitted] = useState(false); // Track whether form submission succeeded
  const validate = () => { // Validate all fields and return an object of errors
    const nextErrors = {}; // Initialize empty errors map
    if (!name.trim()) nextErrors.name = 'Full name is required.'; // Require non-empty name
    if (!email.includes('@') || !email.includes('.')) nextErrors.email = 'Please enter a valid email address.'; // Check basic email format
    if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'; // Enforce minimum password length
    return nextErrors; // Return collected validation errors
  }; // End validate helper
  const handleSubmit = (e) => { // Handle form submission
    e.preventDefault(); // Prevent default browser page reload
    const validationErrors = validate(); // Run validation on current field values
    setErrors(validationErrors); // Update error state for UI feedback
    if (Object.keys(validationErrors).length === 0) { // Check if there are zero validation errors
      setSubmitted(true); // Mark registration as complete
    } // End success check
  }; // End handleSubmit
  const handleReset = () => { // Reset form fields and state to initial values
    setName(''); // Clear name input
    setEmail(''); // Clear email input
    setPassword(''); // Clear password input
    setErrors({}); // Clear all error messages
    setSubmitted(false); // Return to the form view
  }; // End handleReset
  if (submitted) { // Show confirmation screen after valid submission
    return ( // Return success view
      <div style={{ padding: '32px', textAlign: 'center' }}> {/* Centered success container */}
        <h2 style={{ color: '#16a34a', marginBottom: '8px' }}>Registration Successful!</h2> {/* Success heading */}
        <p style={{ color: '#374151', marginBottom: '20px' }}>Welcome, {name}! Confirmation sent to {email}.</p> {/* Personalized confirmation message */}
        <button // Button to test the form again
          type="button" // Non-submit button type
          onClick={handleReset} // Reset form state on click
          style={{ padding: '10px 18px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }} // Styled reset button
        > {/* Close opening button tag */}
          Register Another User {/* Button label */}
        </button> {/* Close button */}
      </div> // Close success container
    ); // End success return
  } // End submitted branch
  return ( // Render the registration form
    <form onSubmit={handleSubmit} noValidate style={{ padding: '32px' }}> {/* Form element with custom validation */}
      <h2 style={{ margin: '0 0 6px 0' }}>Create Account</h2> {/* Form title */}
      <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>All fields use useId() to link labels, hints, and errors.</p> {/* Subtitle */}
      <FormField // Full Name field instance
        label="Full Name" // Label text
        type="text" // Plain text input
        value={name} // Bind name state
        onChange={(e) => setName(e.target.value)} // Update name state on input
        error={errors.name} // Pass name validation error
        hint="Enter your first and last name." // Helper hint text
      /> {/* Close FormField */}
      <FormField // Email Address field instance
        label="Email Address" // Label text
        type="email" // Email input type
        value={email} // Bind email state
        onChange={(e) => setEmail(e.target.value)} // Update email state on input
        error={errors.email} // Pass email validation error
        hint="We will never share your email." // Helper hint text
      /> {/* Close FormField */}
      <FormField // Password field instance
        label="Password" // Label text
        type="password" // Masked password input
        value={password} // Bind password state
        onChange={(e) => setPassword(e.target.value)} // Update password state on input
        error={errors.password} // Pass password validation error
        hint="Must be at least 8 characters." // Helper hint text
      /> {/* Close FormField */}
      <button // Submit button for the form
        type="submit" // Trigger form onSubmit handler
        style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }} // Full-width primary button
      > {/* Close opening button tag */}
        Create Account {/* Submit button text */}
      </button> {/* Close submit button */}
    </form> // Close form element
  ); // End form return
} // End RegistrationForm component
function App() { // Top-level App wrapper
  return ( // Return centered card layout
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px 16px', fontFamily: 'sans-serif' }}> {/* Page background wrapper */}
      <div style={{ backgroundColor: '#ffffff', maxWidth: '420px', margin: '0 auto', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}> {/* White card container */}
        <RegistrationForm /> {/* Render the accessible registration form */}
      </div> {/* Close card container */}
    </div> // Close page wrapper
  ); // End App return
} // End App component
export default App; // Export App as default
