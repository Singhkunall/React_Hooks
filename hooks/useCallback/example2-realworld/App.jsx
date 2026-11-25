/**
 * Example 2 — Real World Use Case: Product Catalog with Cart & Search
 *
 * Demonstrates using useCallback to keep an "Add to Cart" handler stable
 * across renders so memoized ProductRow items don't re-render when the user
 * types into an unrelated coupon code field or updates the cart.
 */
import React, { useState, useCallback } from 'react'; // Import React, useState, and useCallback

const PRODUCTS = [ // Define a static catalog of products outside the component so it isn't recreated
  { id: 1, name: 'Mechanical Keyboard', price: 89 }, // First product entry
  { id: 2, name: 'USB-C Docking Hub', price: 49 }, // Second product entry
  { id: 3, name: 'Studio Headphones', price: 179 }, // Third product entry
  { id: 4, name: 'Vertical Mouse', price: 59 }, // Fourth product entry
]; // End of PRODUCTS array

const ProductRow = React.memo(function ProductRow({ product, onAddToCart }) { // Memoize each product row so it skips re-rendering if props are unchanged
  console.log(`Rendered ProductRow: ${product.name}`); // Log row renders to verify memoization in DevTools
  return ( // Return the JSX for a single product row
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}> {/* Flex container with bottom border */}
      <span>{product.name} — <strong>${product.price}</strong></span> {/* Show product name and formatted price */}
      <button onClick={() => onAddToCart(product)} style={{ padding: '6px 12px', cursor: 'pointer' }}> {/* Trigger the stable onAddToCart callback with this product */}
        Add to Cart {/* Button label */}
      </button> {/* Close button */}
    </div> // Close product row div
  ); // End of return statement
}); // Close React.memo wrapper

export default function App() { // Export the main App component as default
  const [search, setSearch] = useState(''); // State for the product search filter input
  const [cart, setCart] = useState([]); // State for storing items added to the cart
  const [coupon, setCoupon] = useState(''); // Unrelated state for a promo/coupon input field

  const handleAddToCart = useCallback((product) => { // Memoize the add-to-cart function so ProductRow receives the exact same function reference
    setCart((prevCart) => [...prevCart, product]); // Append the clicked product using the functional state updater
  }, []); // Empty dependency array because functional updater doesn't need 'cart' in closure

  const filteredProducts = PRODUCTS.filter((item) => // Filter the catalog based on the current search text
    item.name.toLowerCase().includes(search.toLowerCase()) // Perform a case-insensitive substring match
  ); // End of filter call

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0); // Calculate the total dollar amount of items in the cart

  return ( // Return the store interface
    <div style={{ maxWidth: '480px', padding: '24px', fontFamily: 'system-ui, sans-serif' }}> {/* Main layout container */}
      <h2>Tech Store</h2> {/* Store heading */}
      <p>Cart: <strong>{cart.length}</strong> items (${cartTotal})</p> {/* Display live cart count and total price */}
      <input // Search input to filter visible products
        type="text" // Standard text input
        placeholder="Search products..." // Placeholder prompt
        value={search} // Bind input value to search state
        onChange={(e) => setSearch(e.target.value)} // Update search state when user types
        style={{ width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box' }} // Full-width input styling
      /> {/* Close search input */}
      <div style={{ marginBottom: '16px' }}> {/* Wrapper for the filtered product rows */}
        {filteredProducts.map((product) => ( // Iterate through matching products
          <ProductRow key={product.id} product={product} onAddToCart={handleAddToCart} /> // Render memoized row with stable callback
        ))} {/* Close map */}
      </div> {/* Close product list wrapper */}
      <input // Unrelated coupon input to test that ProductRow doesn't re-render
        type="text" // Standard text input
        placeholder="Promo code (typing here won't re-render rows)" // Explain the demo behavior
        value={coupon} // Bind input value to coupon state
        onChange={(e) => setCoupon(e.target.value)} // Update coupon state on change
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} // Full-width input styling
      /> {/* Close coupon input */}
    </div> // Close main container
  ); // End of return statement
} // Close App component
