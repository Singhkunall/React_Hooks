/**
 * @fileoverview Example 3 — Advanced Pattern: Accessible FAQ Accordion with useId
 * Demonstrates deriving coordinated button and panel IDs from a single useId()
 * call to wire aria-expanded, aria-controls, role="region", and aria-labelledby.
 */
import { useState, useId } from 'react'; // Import useState for open/closed state and useId for ARIA IDs
function AccordionItem({ title, children, isOpen, onToggle }) { // Single controlled accordion item component
  const baseId = useId(); // Generate a unique base ID for this accordion item instance
  const buttonId = `${baseId}-button`; // Derive unique ID for the header toggle button
  const panelId = `${baseId}-panel`; // Derive unique ID for the collapsible content panel
  return ( // Return the accessible accordion item markup
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' }}> {/* Card wrapper for one item */}
      <button // Interactive header button that toggles the panel
        id={buttonId} // Assign buttonId so the panel's aria-labelledby can reference it
        type="button" // Explicit button type to prevent form submission
        aria-expanded={isOpen} // Announce expanded/collapsed state to screen readers
        aria-controls={panelId} // Link this button to the panel it controls
        onClick={onToggle} // Invoke parent toggle handler on click
        style={{ // Style the full-width header button
          display: 'flex', // Align title and chevron horizontally
          justifyContent: 'space-between', // Push title left and chevron right
          alignItems: 'center', // Vertically center contents
          width: '100%', // Span full width of the item
          padding: '16px 20px', // Comfortable click target padding
          backgroundColor: isOpen ? '#eff6ff' : '#ffffff', // Soft blue highlight when expanded
          border: 'none', // Remove default button border
          cursor: 'pointer', // Show pointer cursor on hover
          fontSize: '16px', // Readable header text
          fontWeight: '600', // Bold question text
          color: '#1e3a5f', // Deep navy text color
          textAlign: 'left', // Align question text to the left
        }} // End button style object
      > {/* Close opening button tag */}
        <span>{title}</span> {/* Render the accordion item title */}
        <span aria-hidden="true" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s', display: 'inline-block' }}> {/* Decorative chevron icon */}
          ▼ {/* Downward triangle indicator */}
        </span> {/* Close chevron span */}
      </button> {/* Close header button */}
      <div // Collapsible region controlled by the button above
        id={panelId} // Assign panelId referenced by the button's aria-controls
        role="region" // Expose panel as a landmark region when expanded
        aria-labelledby={buttonId} // Name this region using the header button's text
        hidden={!isOpen} // Hide panel from layout and assistive tech when collapsed
        style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', backgroundColor: '#fafafa', fontSize: '15px', lineHeight: '1.6', color: '#374151' }} // Panel content styling
      > {/* Close opening panel div */}
        <p style={{ margin: '0 0 10px 0' }}>{children}</p> {/* Render the answer text */}
        <div style={{ fontSize: '12px', color: '#6b7280' }}> {/* Subtle metadata bar showing ARIA wiring */}
          ARIA link: <code>aria-controls=&quot;{panelId}&quot;</code> ↔ <code>aria-labelledby=&quot;{buttonId}&quot;</code> {/* Display live generated IDs */}
        </div> {/* Close metadata bar */}
      </div> {/* Close panel div */}
    </div> // Close item wrapper
  ); // End AccordionItem return
} // End AccordionItem component
function App() { // Top-level component managing an FAQ accordion list
  const faqItems = [ // Static array of FAQ entries
    { id: 'react', title: 'What is React?', content: 'React is a JavaScript library for building composable user interfaces.' }, // First FAQ item
    { id: 'hooks', title: 'What is a React Hook?', content: 'Hooks let function components use state, refs, effects, and IDs without classes.' }, // Second FAQ item
    { id: 'useid', title: 'Why use useId?', content: 'useId generates unique, SSR-safe IDs for linking labels and ARIA attributes.' }, // Third FAQ item
    { id: 'ssr', title: 'Is useId safe for SSR?', content: 'Yes! IDs are derived from the component tree position, preventing hydration mismatches.' }, // Fourth FAQ item
  ]; // End faqItems array
  const [openIds, setOpenIds] = useState(['react']); // Track which FAQ item IDs are currently expanded
  const toggleItem = (itemId) => { // Toggle a single item's open state
    setOpenIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId])); // Add or remove itemId from openIds
  }; // End toggleItem
  const expandAll = () => setOpenIds(faqItems.map((item) => item.id)); // Expand every FAQ item
  const collapseAll = () => setOpenIds([]); // Collapse every FAQ item
  return ( // Render the FAQ page
    <div style={{ padding: '40px 24px', maxWidth: '680px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}> {/* Centered page container */}
      <h1 style={{ marginBottom: '8px', color: '#1e3a5f' }}>useId — Advanced ARIA Accordion</h1> {/* Page heading */}
      <p style={{ marginBottom: '20px', color: '#6b7280', fontSize: '15px' }}> {/* Page description */}
        Each item derives coordinated button and panel IDs from a single <code>useId()</code> call. {/* Explain the pattern */}
      </p> {/* Close description paragraph */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}> {/* Toolbar for bulk expand/collapse */}
        <button type="button" onClick={expandAll} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff', cursor: 'pointer' }}> {/* Expand all button */}
          Expand All {/* Button text */}
        </button> {/* Close expand all button */}
        <button type="button" onClick={collapseAll} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff', cursor: 'pointer' }}> {/* Collapse all button */}
          Collapse All {/* Button text */}
        </button> {/* Close collapse all button */}
      </div> {/* Close toolbar */}
      {faqItems.map((item) => ( // Render an AccordionItem for each FAQ entry
        <AccordionItem // Render controlled accordion item
          key={item.id} // Use stable data ID as the React list key (never useId!)
          title={item.title} // Pass question title
          isOpen={openIds.includes(item.id)} // Pass whether this item is currently open
          onToggle={() => toggleItem(item.id)} // Pass toggle callback for this item
        > {/* Close opening AccordionItem tag */}
          {item.content} {/* Pass answer content as children */}
        </AccordionItem> // Close AccordionItem
      ))} {/* End faqItems map */}
    </div> // Close page container
  ); // End App return
} // End App component
export default App; // Export App as default
