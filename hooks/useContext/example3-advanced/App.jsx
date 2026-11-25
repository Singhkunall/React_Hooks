/**
 * Example 3 — Advanced Pattern: Split State & Dispatch Contexts + useReducer
 *
 * Demonstrates how to scale useContext by combining it with useReducer and
 * splitting State and Dispatch into two separate Contexts. Components that
 * only dispatch actions (like ProductRow) never re-render when cart state changes.
 */
import { createContext, useContext, useReducer } from 'react'; // Import createContext, useContext, and useReducer from React

const CartStateContext = createContext(null); // Create a context exclusively for reading cart state
const CartDispatchContext = createContext(null); // Create a separate context exclusively for dispatching actions

function cartReducer(state, action) { // Define a pure reducer to manage all shopping cart updates
  switch (action.type) { // Inspect the action type to determine the next state
    case 'ADD_ITEM': { // Handle adding a product or increasing its quantity
      const existing = state.items.find((item) => item.id === action.item.id); // Look for an existing item with the same id
      const nextItems = existing // Choose between incrementing qty or appending a new entry
        ? state.items.map((item) => (item.id === action.item.id ? { ...item, qty: item.qty + 1 } : item)) // Increment qty for matching item
        : [...state.items, { ...action.item, qty: 1 }]; // Add new item with initial quantity of 1
      return { ...state, items: nextItems }; // Return the updated state object
    } // End ADD_ITEM case
    case 'DECREMENT_ITEM': { // Handle decreasing an item's quantity by 1
      const nextItems = state.items // Transform the items array
        .map((item) => (item.id === action.id ? { ...item, qty: item.qty - 1 } : item)) // Subtract 1 from the matching item's qty
        .filter((item) => item.qty > 0); // Remove the item automatically if its quantity reaches 0
      return { ...state, items: nextItems }; // Return the updated state object
    } // End DECREMENT_ITEM case
    case 'CLEAR_CART': // Handle emptying the entire cart
      return { items: [] }; // Reset items to an empty array
    default: // Catch any unrecognized action types
      throw new Error(`Unknown cart action: ${action.type}`); // Fail fast with a descriptive error
  } // End switch statement
} // End cartReducer

function useCartState() { // Custom hook for components that need to read cart items
  const context = useContext(CartStateContext); // Subscribe to CartStateContext
  if (!context) throw new Error('useCartState must be used inside <CartProvider>'); // Guard against missing Provider
  return context; // Return the current cart state
} // End useCartState

function useCartDispatch() { // Custom hook for components that only need to dispatch actions
  const context = useContext(CartDispatchContext); // Subscribe to CartDispatchContext (dispatch identity is always stable)
  if (!context) throw new Error('useCartDispatch must be used inside <CartProvider>'); // Guard against missing Provider
  return context; // Return the stable dispatch function
} // End useCartDispatch

function CartProvider({ children }) { // Encapsulate reducer state and both Providers in one reusable wrapper
  const [state, dispatch] = useReducer(cartReducer, { items: [] }); // Initialize cart state with an empty items list
  return ( // Return nested State and Dispatch Providers
    <CartStateContext.Provider value={state}> {/* Provide reactive cart state */}
      <CartDispatchContext.Provider value={dispatch}> {/* Provide stable dispatch reference */}
        {children} {/* Render wrapped child components */}
      </CartDispatchContext.Provider> {/* Close Dispatch Provider */}
    </CartStateContext.Provider> // Close State Provider
  ); // End return
} // End CartProvider

function ProductRow({ product }) { // Product row only dispatches actions and never subscribes to CartStateContext
  const dispatch = useCartDispatch(); // Read only dispatch so this component skips re-renders when cart items change
  return ( // Return product row JSX
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}> {/* Row container */}
      <span><strong>{product.name}</strong> — ${product.price}</span> {/* Show product name and unit price */}
      <button onClick={() => dispatch({ type: 'ADD_ITEM', item: product })}>Add to Cart</button> {/* Dispatch ADD_ITEM on click */}
    </div> // Close row container
  ); // End return
} // End ProductRow component

function CartSummary() { // Cart summary subscribes to both state (to display items) and dispatch (to modify them)
  const { items } = useCartState(); // Read current cart items from CartStateContext
  const dispatch = useCartDispatch(); // Read dispatch from CartDispatchContext
  const totalCost = items.reduce((sum, item) => sum + item.price * item.qty, 0); // Calculate total price across all items
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0); // Calculate total number of units in the cart

  return ( // Return cart summary JSX
    <aside style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px' }}> {/* Summary box */}
      <h3>Cart ({totalCount} items) — Total: ${totalCost}</h3> {/* Display live item count and total cost */}
      {items.length === 0 ? ( // Check if the cart is empty
        <p style={{ color: '#64748b' }}>Your cart is empty. Add a product above!</p> // Empty state message
      ) : ( // Otherwise list each item with quantity controls
        <ul style={{ listStyle: 'none', padding: 0 }}> {/* Unstyled list for cart items */}
          {items.map((item) => ( // Render one list item per product in the cart
            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}> {/* Item row */}
              <span>{item.name} × {item.qty} (${item.price * item.qty})</span> {/* Show name, quantity, and line subtotal */}
              <div style={{ display: 'flex', gap: '6px' }}> {/* Quantity adjustment buttons */}
                <button onClick={() => dispatch({ type: 'DECREMENT_ITEM', id: item.id })}>-</button> {/* Decrease quantity */}
                <button onClick={() => dispatch({ type: 'ADD_ITEM', item })}>+</button> {/* Increase quantity */}
              </div> {/* Close button group */}
            </li> // Close item row
          ))} {/* End items map */}
        </ul> // Close list
      )} {/* End empty check */}
      {items.length > 0 && ( // Only show Clear Cart button when there is at least one item
        <button onClick={() => dispatch({ type: 'CLEAR_CART' })} style={{ marginTop: '8px' }}>Clear Cart</button> // Dispatch CLEAR_CART
      )} {/* End conditional button */}
    </aside> // Close summary box
  ); // End return
} // End CartSummary component

export default function App() { // Define and export the root App component
  const catalog = [ // Define a static list of sample products
    { id: 1, name: 'Mechanical Keyboard', price: 120 }, // Product 1
    { id: 2, name: 'USB-C Hub', price: 45 }, // Product 2
    { id: 3, name: 'Ergonomic Mouse', price: 75 }, // Product 3
  ]; // End catalog array

  return ( // Return the app wrapped in CartProvider
    <CartProvider> {/* Supply both CartStateContext and CartDispatchContext */}
      <div style={{ maxWidth: '560px', margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif' }}> {/* Centered container */}
        <h1>Tech Store (Split Context + useReducer)</h1> {/* Page heading */}
        {catalog.map((product) => <ProductRow key={product.id} product={product} />)} {/* Render each catalog product */}
        <CartSummary /> {/* Render the live shopping cart summary */}
      </div> {/* Close container */}
    </CartProvider> // Close CartProvider
  ); // End return
} // End App component
