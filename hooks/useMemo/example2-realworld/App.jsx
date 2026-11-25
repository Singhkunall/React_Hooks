/**
 * Example 2: Real-World Use Case of useMemo
 *
 * Demonstrates filtering and sorting a large product catalog with search text
 * and category filters, while keeping unrelated UI state (like a shopping cart
 * counter) snappy and avoiding unnecessary array recalculations.
 */
import React, { useState, useMemo } from "react"; // Import React, useState, and useMemo

// Sample product catalog data (kept outside the component so it is created once)
const PRODUCTS = [ // Define a constant array of product objects
  { id: 1, name: "Mechanical Keyboard", category: "Electronics", price: 120 }, // Product 1
  { id: 2, name: "Ergonomic Mouse", category: "Electronics", price: 65 }, // Product 2
  { id: 3, name: "Standing Desk Mat", category: "Office", price: 45 }, // Product 3
  { id: 4, name: "USB-C Monitor", category: "Electronics", price: 340 }, // Product 4
  { id: 5, name: "Notebook & Pen Set", category: "Office", price: 18 }, // Product 5
  { id: 6, name: "Noise-Canceling Headphones", category: "Electronics", price: 220 }, // Product 6
  { id: 7, name: "Desk Lamp", category: "Office", price: 55 }, // Product 7
]; // End of PRODUCTS array

export default function App() { // Define and export the main App component
  const [searchQuery, setSearchQuery] = useState(""); // Store the user's search text
  const [selectedCategory, setSelectedCategory] = useState("All"); // Store the selected category filter
  const [sortOrder, setSortOrder] = useState("asc"); // Store price sort direction ("asc" or "desc")
  const [cartCount, setCartCount] = useState(0); // Unrelated state: number of items in the cart

  // Memoize the filtered and sorted list of products
  const visibleProducts = useMemo(() => { // Compute visibleProducts only when filter/sort inputs change
    console.log("Filtering & sorting products..."); // Log to verify when recalculation happens

    const filtered = PRODUCTS.filter((product) => { // Filter the catalog array
      const matchesCategory = // Check if product matches the selected category
        selectedCategory === "All" || product.category === selectedCategory; // Match all or exact category
      const matchesSearch = product.name // Check if product name includes the search query
        .toLowerCase() // Convert product name to lowercase for case-insensitive matching
        .includes(searchQuery.toLowerCase().trim()); // Compare against trimmed lowercase search query
      return matchesCategory && matchesSearch; // Keep product only if both conditions are true
    }); // End filter callback

    return [...filtered].sort((a, b) => { // Sort a shallow copy so we never mutate `filtered`
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price; // Sort ascending or descending by price
    }); // End sort callback
  }, [searchQuery, selectedCategory, sortOrder]); // Recompute only when search, category, or sortOrder changes

  // Memoize the total value of all currently visible products
  const totalVisibleValue = useMemo(() => { // Derive total price from `visibleProducts`
    return visibleProducts.reduce((sum, item) => sum + item.price, 0); // Sum up prices of visible items
  }, [visibleProducts]); // Only recalculate when `visibleProducts` reference changes

  return ( // Return the component's JSX
    <div style={{ fontFamily: "sans-serif", maxWidth: "560px", margin: "24px auto" }}> {/* Main wrapper */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}> {/* Top bar */}
        <h2>Product Catalog</h2> {/* Page title */}
        <button onClick={() => setCartCount((c) => c + 1)}> {/* Button to simulate adding to cart */}
          Cart Items: {cartCount} (Click to +1) {/* Display current cart count */}
        </button> {/* Close cart button */}
      </header> {/* Close header */}

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}> {/* Filter controls row */}
        <input // Search input field
          type="text" // Standard text input
          placeholder="Search products..." // Placeholder hint
          value={searchQuery} // Controlled input value
          onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on typing
          style={{ flex: 1, padding: "8px" }} // Allow input to grow and add padding
        /> {/* Close search input */}

        <select // Category dropdown
          value={selectedCategory} // Controlled select value
          onChange={(e) => setSelectedCategory(e.target.value)} // Update selectedCategory on change
          style={{ padding: "8px" }} // Add padding
        > {/* Close opening select tag */}
          <option value="All">All Categories</option> {/* Option for all categories */}
          <option value="Electronics">Electronics</option> {/* Option for Electronics */}
          <option value="Office">Office</option> {/* Option for Office */}
        </select> {/* Close select */}

        <button // Toggle sort order button
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))} // Flip sort direction
          style={{ padding: "8px 12px" }} // Add padding
        > {/* Close opening button tag */}
          Price: {sortOrder === "asc" ? "Low → High" : "High → Low"} {/* Show current sort order */}
        </button> {/* Close sort button */}
      </div> {/* Close controls row */}

      <ul style={{ listStyle: "none", padding: 0 }}> {/* Unstyled list for products */}
        {visibleProducts.map((product) => ( // Map over memoized `visibleProducts`
          <li // List item for each product
            key={product.id} // Unique React key
            style={{ // Inline styling for product row
              display: "flex", // Flex layout for name and price
              justifyContent: "space-between", // Push name left and price right
              padding: "10px", // Inner spacing
              borderBottom: "1px solid #e2e8f0", // Subtle divider line
            }} // End style object
          > {/* Close opening li tag */}
            <span> {/* Wrapper for name and category */}
              <strong>{product.name}</strong>{" "} {/* Product name in bold */}
              <small style={{ color: "#64748b" }}>({product.category})</small> {/* Muted category label */}
            </span> {/* Close span */}
            <span>${product.price}</span> {/* Product price */}
          </li> // Close li
        ))} {/* End map */}
      </ul> {/* Close product list */}

      <p style={{ marginTop: "12px", fontWeight: "bold" }}> {/* Summary footer */}
        Showing {visibleProducts.length} items — Combined Value: ${totalVisibleValue} {/* Display count and total */}
      </p> {/* Close summary */}
    </div> // Close main wrapper
  ); // End return statement
} // End App component
