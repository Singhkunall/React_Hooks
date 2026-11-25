/**
 * @fileoverview Example 2 — Real-World Shopping Cart using useReducer.
 * Demonstrates managing an array of cart items with add, increment, decrement,
 * remove, and clear operations centralized inside a single pure reducer.
 */
import { useReducer } from "react"; // Import the useReducer hook from React

const PRODUCTS = [ // Static product catalog available for users to add to their cart
  { id: 1, name: "Mechanical Keyboard", price: 89 }, // First product entry with id, name, and price
  { id: 2, name: "USB-C Hub", price: 35 }, // Second product entry with id, name, and price
  { id: 3, name: "Desk Mat", price: 24 }, // Third product entry with id, name, and price
]; // End PRODUCTS array

const initialCartState = { items: [] }; // Initial cart state starts with an empty items array

function cartReducer(state, action) { // Pure reducer function handling all shopping cart state transitions
  switch (action.type) { // Branch based on the dispatched action type
    case "ADD_ITEM": { // Add a product to the cart or increment its quantity if already present
      const existing = state.items.find((item) => item.id === action.payload.id); // Check if product is already in cart
      if (existing) { // If the product is already in the cart
        return { // Return a new state object
          ...state, // Copy existing state properties
          items: state.items.map((item) => // Map over items to immutably update only the matching item
            item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item // Increment qty by 1 for the matching item
          ), // End map
        }; // End returned state
      } // End if (existing)
      return { // If the product is not yet in the cart
        ...state, // Copy existing state properties
        items: [...state.items, { ...action.payload, qty: 1 }], // Append a new item object with qty set to 1
      }; // End returned state
    } // End ADD_ITEM case
    case "DECREMENT_ITEM": { // Decrease an item's quantity by 1 and remove it if quantity hits 0
      return { // Return a new state object
        ...state, // Copy existing state properties
        items: state.items // Start from current items array
          .map((item) => (item.id === action.payload ? { ...item, qty: item.qty - 1 } : item)) // Subtract 1 from matching item's qty
          .filter((item) => item.qty > 0), // Filter out any item whose qty is now 0 or less
      }; // End returned state
    } // End DECREMENT_ITEM case
    case "REMOVE_ITEM": { // Remove an item from the cart completely regardless of quantity
      return { // Return a new state object
        ...state, // Copy existing state properties
        items: state.items.filter((item) => item.id !== action.payload), // Keep all items except the one matching payload id
      }; // End returned state
    } // End REMOVE_ITEM case
    case "CLEAR_CART": // Empty all items from the cart
      return initialCartState; // Return the initial empty cart state
    default: // Fallback for any unrecognized action type
      throw new Error(`Unknown cart action: ${action.type}`); // Throw an error to surface bugs quickly
  } // End switch statement
} // End cartReducer function

export default function App() { // Export the App component as default
  const [state, dispatch] = useReducer(cartReducer, initialCartState); // Connect cartReducer and initialCartState via useReducer
  const total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0); // Compute total price from current cart items

  return ( // Render the storefront and interactive cart UI
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: "560px" }}> {/* Main layout container */}
      <h1>Tech Store</h1> {/* Storefront heading */}
      <h2>Products</h2> {/* Section heading for available products */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}> {/* Product buttons wrapper */}
        {PRODUCTS.map((product) => ( // Render a button for each product in the catalog
          <button key={product.id} onClick={() => dispatch({ type: "ADD_ITEM", payload: product })}> {/* Dispatch ADD_ITEM when clicked */}
            + {product.name} (${product.price}) {/* Button label showing product name and price */}
          </button> // End product button
        ))} {/* End PRODUCTS.map */}
      </div> {/* End product buttons wrapper */}
      <h2>Your Cart ({state.items.length} unique)</h2> {/* Cart heading displaying count of unique products */}
      {state.items.length === 0 ? ( // Check whether the cart is currently empty
        <p>Your cart is empty. Add a product above!</p> // Show helpful message when cart has no items
      ) : ( // Otherwise render the list of items in the cart
        <ul> {/* Unordered list of cart items */}
          {state.items.map((item) => ( // Loop over each item in state.items
            <li key={item.id} style={{ marginBottom: "0.5rem" }}> {/* List item keyed by unique product id */}
              <strong>{item.name}</strong> — ${item.price} x {item.qty} = ${item.price * item.qty}{" "} {/* Show name, unit price, qty, and subtotal */}
              <button onClick={() => dispatch({ type: "DECREMENT_ITEM", payload: item.id })}>-</button>{" "} {/* Dispatch DECREMENT_ITEM */}
              <button onClick={() => dispatch({ type: "ADD_ITEM", payload: item })}>+</button>{" "} {/* Dispatch ADD_ITEM to increment */}
              <button onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}>Remove</button> {/* Dispatch REMOVE_ITEM */}
            </li> // End list item
          ))} {/* End state.items.map */}
        </ul> // End unordered list
      )} {/* End conditional cart rendering */}
      <h3>Total: ${total}</h3> {/* Display the derived total cost */}
      {state.items.length > 0 && ( // Render Clear Cart button only when cart is non-empty
        <button onClick={() => dispatch({ type: "CLEAR_CART" })}>Clear Cart</button> // Dispatch CLEAR_CART on click
      )} {/* End conditional Clear Cart button */}
    </div> // End main layout container
  ); // End return statement
} // End App component
