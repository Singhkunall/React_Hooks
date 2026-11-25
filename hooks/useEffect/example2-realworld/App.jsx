/**
 * @file App.jsx
 * @description Example 2 — Real World Use Case: User Search with Live API Data
 *
 * WHAT THIS TEACHES:
 *   - Fetching data from a real public API (JSONPlaceholder)
 *   - Handling loading, error, and success states together
 *   - Using the cancellation pattern to prevent race conditions
 *   - Chaining effects: search input → debounce delay → fetch
 *   - Rendering different UI based on async state (loading/error/data)
 *
 * REAL WORLD SCENARIO:
 *   A "user directory" panel that lets you:
 *     1. Browse all users from an API
 *     2. Click a user to see their detailed profile
 *     3. Search/filter users by name
 *
 * API USED:
 *   https://jsonplaceholder.typicode.com — a free, fake REST API for testing
 *   No API key or authentication required.
 *
 * HOW TO RUN:
 *   1. Set up a React project (Vite recommended: npm create vite@latest)
 *   2. Replace src/App.jsx with this file
 *   3. npm run dev — works out of the box, no extra packages needed
 *
 * @author   React Hooks Learning Module
 * @version  1.0.0
 */

import React, { useState, useEffect } from "react"; // Import React and the hooks we need

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const API_BASE = "https://jsonplaceholder.typicode.com"; // Base URL for all API requests

// ─────────────────────────────────────────────
// Styles — defined once, outside the component
// ─────────────────────────────────────────────
const s = {                                            // Abbreviated name to keep JSX concise
  page: {                                              // Page wrapper styles
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Clean readable font
    maxWidth: "900px",                                 // Max width for readability on wide screens
    margin: "0 auto",                                  // Center on page
    padding: "2rem 1rem",                              // Comfortable padding
    minHeight: "100vh",                                // Fill full viewport height
    background: "#f7f8fc",                             // Very light grey background
    color: "#1a1a2e",                                  // Dark text for contrast
  },
  header: {                                            // Header section
    marginBottom: "1.5rem",                            // Space below header
    borderBottom: "2px solid #e0e0e0",                 // Separator line
    paddingBottom: "1rem",                             // Padding before the separator
  },
  layout: {                                            // Two-column layout wrapper
    display: "grid",                                   // CSS Grid
    gridTemplateColumns: "1fr 1.6fr",                  // Left column narrower, right wider
    gap: "1.5rem",                                     // Gap between columns
    alignItems: "start",                               // Don't stretch columns vertically
  },
  panel: {                                             // Generic card/panel
    background: "#fff",                                // White background
    border: "1px solid #e0e0e0",                       // Light border
    borderRadius: "12px",                              // Rounded corners
    padding: "1.25rem",                                // Inner padding
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",           // Subtle shadow
  },
  searchInput: {                                       // Search input field
    width: "100%",                                     // Full width of its container
    padding: "0.6rem 0.75rem",                         // Comfortable padding inside input
    fontSize: "1rem",                                  // Normal font size
    border: "1px solid #ccc",                          // Light border
    borderRadius: "8px",                               // Rounded corners
    marginBottom: "1rem",                              // Space below input
    boxSizing: "border-box",                           // Include padding in width calculation
    outline: "none",                                   // Remove default focus outline
  },
  userList: {                                          // User list container
    maxHeight: "420px",                                // Scrollable when many users
    overflowY: "auto",                                 // Show scrollbar when needed
    listStyle: "none",                                 // Remove bullet points
    margin: 0,                                         // Remove default margin
    padding: 0,                                        // Remove default padding
  },
  userItem: (isSelected) => ({                         // User list item — a function to allow dynamic styles
    padding: "0.75rem",                                // Inner padding
    borderRadius: "8px",                               // Rounded corners
    cursor: "pointer",                                 // Pointer cursor to signal it's clickable
    marginBottom: "0.4rem",                            // Space between items
    background: isSelected ? "#4f46e5" : "#f0f0f0",   // Indigo when selected, grey otherwise
    color: isSelected ? "#fff" : "#333",               // White text when selected, dark otherwise
    transition: "background 0.15s ease",               // Smooth color transition on selection
    userSelect: "none",                                // Prevent text selection on click
  }),
  detailLabel: {                                       // Label in the detail panel
    fontSize: "0.78rem",                               // Smaller than body text
    color: "#888",                                     // Grey color
    textTransform: "uppercase",                        // ALL CAPS for label distinction
    letterSpacing: "0.08em",                           // Slightly spaced letters
    marginBottom: "0.1rem",                            // Tiny space below label
    display: "block",                                  // Block so value goes on next line
  },
  detailValue: {                                       // Value next to label
    fontSize: "1rem",                                  // Normal size
    color: "#1a1a2e",                                  // Dark color
    marginBottom: "0.9rem",                            // Space below each field
    display: "block",                                  // Block
  },
  badge: {                                             // Status badge (count)
    display: "inline-block",                           // Inline
    background: "#4f46e5",                             // Indigo
    color: "#fff",                                     // White text
    borderRadius: "999px",                             // Pill shape
    padding: "0.1rem 0.55rem",                         // Tight padding
    fontSize: "0.78rem",                               // Small text
    marginLeft: "0.4rem",                              // Space from sibling
  },
  error: {                                             // Error message styles
    color: "#c0392b",                                  // Red color
    background: "#fdecea",                             // Light red background
    border: "1px solid #e74c3c",                       // Red border
    borderRadius: "8px",                               // Rounded
    padding: "0.75rem",                                // Inner padding
    fontSize: "0.9rem",                                // Slightly smaller text
  },
  avatar: {                                            // Avatar placeholder circle
    width: "60px",                                     // Fixed width
    height: "60px",                                    // Fixed height
    borderRadius: "50%",                               // Circular
    background: "#4f46e5",                             // Indigo background
    color: "#fff",                                     // White text (initials)
    display: "flex",                                   // Flexbox to center initials
    alignItems: "center",                              // Vertically center
    justifyContent: "center",                          // Horizontally center
    fontSize: "1.5rem",                                // Large letter
    fontWeight: "bold",                                // Bold
    marginBottom: "1rem",                              // Space below avatar
  },
  postItem: {                                          // Individual post card
    background: "#f7f8fc",                             // Light background
    borderRadius: "8px",                               // Rounded
    padding: "0.75rem",                                // Inner padding
    marginBottom: "0.6rem",                            // Space between posts
    fontSize: "0.9rem",                                // Slightly smaller text
    borderLeft: "3px solid #4f46e5",                   // Indigo left border accent
  },
  spinner: {                                           // Loading spinner text
    color: "#4f46e5",                                  // Indigo
    fontSize: "1rem",                                  // Normal size
    padding: "1rem 0",                                 // Vertical padding
    textAlign: "center",                               // Centered
  },
};

// ─────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────
function App() {                                       // Define the main component

  // ── State: User List ──────────────────────
  const [users, setUsers] = useState([]);              // All users fetched from the API; starts empty
  const [usersLoading, setUsersLoading] = useState(true); // True while fetching the user list
  const [usersError, setUsersError] = useState(null); // Holds an error message if the fetch fails

  // ── State: Search/Filter ─────────────────
  const [searchQuery, setSearchQuery] = useState("");  // The text the user has typed in the search box

  // ── State: Selected User Detail ──────────
  const [selectedUserId, setSelectedUserId] = useState(null); // ID of the user the user clicked on
  const [userDetail, setUserDetail] = useState(null);  // Full detail object of the selected user
  const [detailLoading, setDetailLoading] = useState(false); // True while fetching user details
  const [detailError, setDetailError] = useState(null); // Error from fetching user detail

  // ── State: User's Posts ───────────────────
  const [posts, setPosts] = useState([]);              // Posts belonging to the selected user
  const [postsLoading, setPostsLoading] = useState(false); // True while fetching posts

  // ─────────────────────────────────────────────────────────────────────
  // Effect 1: Fetch all users when the component first mounts
  // Dependencies: [] — runs once only
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {                                    // Start Effect 1
    let cancelled = false;                             // Cancellation flag for cleanup

    const fetchUsers = async () => {                   // Async function inside the effect
      try {                                            // Attempt the fetch
        setUsersLoading(true);                         // Show loading state
        setUsersError(null);                           // Clear any previous error

        const response = await fetch(`${API_BASE}/users`); // Fetch user list from API

        if (!response.ok) {                            // If the server returned an error status
          throw new Error(`Server error: ${response.status}`); // Throw with the status code
        }

        const data = await response.json();            // Parse JSON response body

        if (!cancelled) {                              // Only update state if still mounted
          setUsers(data);                              // Store the user list in state
        }
      } catch (err) {                                  // Catch network errors or thrown errors
        if (!cancelled) {                              // Only update if still mounted
          setUsersError(err.message);                  // Store the error message
        }
      } finally {                                      // Runs regardless of success or failure
        if (!cancelled) {                              // Only update if still mounted
          setUsersLoading(false);                      // Hide loading indicator
        }
      }
    };

    fetchUsers();                                      // Kick off the async fetch

    return () => {                                     // Cleanup function
      cancelled = true;                                // Mark as cancelled on unmount
    };
  }, []);                                              // ← Empty array: run once on mount

  // ─────────────────────────────────────────────────────────────────────
  // Effect 2: Fetch user detail + their posts when selectedUserId changes
  // Dependencies: [selectedUserId] — re-runs whenever the user clicks a different person
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {                                    // Start Effect 2
    if (selectedUserId === null) return;               // If no user is selected, do nothing

    let cancelled = false;                             // Cancellation flag

    const fetchDetailAndPosts = async () => {          // Async function for parallel fetches
      setDetailLoading(true);                          // Show loading for the detail panel
      setDetailError(null);                            // Clear previous error
      setUserDetail(null);                             // Clear previous detail
      setPostsLoading(true);                           // Show loading for posts
      setPosts([]);                                    // Clear previous posts

      try {                                            // Attempt both fetches
        // Fetch user detail AND posts at the same time using Promise.all
        // This is more efficient than sequential awaits
        const [userRes, postsRes] = await Promise.all([ // Run both fetches in parallel
          fetch(`${API_BASE}/users/${selectedUserId}`),  // Fetch the specific user's detail
          fetch(`${API_BASE}/users/${selectedUserId}/posts`), // Fetch their posts
        ]);

        if (!userRes.ok) {                             // Check if user detail fetch succeeded
          throw new Error(`Failed to load user (${userRes.status})`); // Throw on failure
        }

        const userData = await userRes.json();         // Parse user detail JSON
        const postsData = await postsRes.json();       // Parse posts JSON

        if (!cancelled) {                              // Only update state if still mounted
          setUserDetail(userData);                     // Store user detail
          setPosts(postsData.slice(0, 5));             // Store only first 5 posts (keep UI clean)
        }
      } catch (err) {                                  // Catch any errors from either fetch
        if (!cancelled) {                              // Only update if still mounted
          setDetailError(err.message);                 // Store the error message
        }
      } finally {                                      // Always runs
        if (!cancelled) {                              // Only update if still mounted
          setDetailLoading(false);                     // Hide detail loading
          setPostsLoading(false);                      // Hide posts loading
        }
      }
    };

    fetchDetailAndPosts();                             // Call the async function

    return () => {                                     // Cleanup function
      cancelled = true;                                // Cancel on unmount or when selectedUserId changes
    };
  }, [selectedUserId]);                                // ← Re-run when selectedUserId changes

  // ─────────────────────────────────────────────────────────────────────
  // Derived Data: Filter users based on the search query
  // This is NOT an effect — it's just computed during render
  // ─────────────────────────────────────────────────────────────────────
  const filteredUsers = users.filter(user =>          // Filter the users array
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive name match
  );

  // ─────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────
  return (                                             // Start rendering JSX
    <div style={s.page}>                               {/* Page wrapper */}

      {/* ── Page Header ── */}
      <div style={s.header}>                           {/* Header section */}
        <h1 style={{ margin: 0 }}>👥 User Directory</h1> {/* Main heading */}
        <p style={{ margin: "0.5rem 0 0", color: "#555" }}> {/* Subtitle */}
          Real-world <code>useEffect</code> demo — data from{" "}
          <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noreferrer"> {/* API link */}
            JSONPlaceholder
          </a>
        </p>
      </div>

      {/* ── Two-Column Layout ── */}
      <div style={s.layout}>                           {/* Grid layout wrapper */}

        {/* ── Left Column: User List ── */}
        <div style={s.panel}>                          {/* Left panel */}
          <h2 style={{ marginTop: 0 }}>               {/* Panel heading */}
            Users
            {!usersLoading && (                        /* Show count badge only when loaded */
              <span style={s.badge}>{filteredUsers.length}</span> /* Number of matching users */
            )}
          </h2>

          <input                                       /* Search box */
            type="text"                                /* Text input type */
            style={s.searchInput}                      /* Apply search input styles */
            placeholder="🔍 Search by name…"           /* Placeholder text */
            value={searchQuery}                        /* Controlled value from state */
            onChange={e => setSearchQuery(e.target.value)} /* Update search state on each keystroke */
          />

          {usersLoading && (                           /* Show spinner while loading */
            <p style={s.spinner}>⏳ Loading users…</p> /* Loading message */
          )}

          {usersError && (                             /* Show error if fetch failed */
            <div style={s.error}>❌ {usersError}</div>  /* Error display */
          )}

          {!usersLoading && !usersError && (           /* Show list only when loaded and no error */
            <ul style={s.userList}>                   {/* Scrollable user list */}
              {filteredUsers.length === 0              /* Handle empty search results */
                ? <li style={{ color: "#888", padding: "0.5rem" }}>No users match "{searchQuery}"</li>
                : filteredUsers.map(user => (          /* Map each user to a list item */
                  <li                                 /* Individual user item */
                    key={user.id}                     /* Unique key for React reconciliation */
                    style={s.userItem(user.id === selectedUserId)} /* Dynamic styles based on selection */
                    onClick={() => setSelectedUserId(user.id)} /* Select this user on click */
                  >
                    <strong>{user.name}</strong>      {/* User's full name */}
                    <br />                            {/* Line break */}
                    <small>{user.email}</small>       {/* User's email in smaller text */}
                  </li>
                ))
              }
            </ul>
          )}
        </div>

        {/* ── Right Column: User Detail ── */}
        <div style={s.panel}>                          {/* Right panel */}

          {selectedUserId === null && (                /* No user selected yet */
            <div style={{ textAlign: "center", color: "#888", padding: "3rem 0" }}> {/* Centered placeholder */}
              <p style={{ fontSize: "2rem" }}>👈</p>  {/* Arrow emoji */}
              <p>Select a user from the list to see their profile.</p> {/* Instruction */}
            </div>
          )}

          {detailLoading && (                          /* Loading state for the detail panel */
            <p style={s.spinner}>⏳ Loading profile…</p> /* Loading message */
          )}

          {detailError && (                            /* Error state */
            <div style={s.error}>❌ {detailError}</div> /* Error display */
          )}

          {userDetail && !detailLoading && (           /* Show detail only when loaded */
            <div>                                      {/* Detail content wrapper */}

              {/* Avatar Circle (uses first letter of the name) */}
              <div style={s.avatar}>                   {/* Circular avatar */}
                {userDetail.name.charAt(0)}            {/* First letter of name as initials */}
              </div>

              <h2 style={{ marginTop: 0, marginBottom: "1rem" }}> {/* User name heading */}
                {userDetail.name}
              </h2>

              {/* User Fields */}
              <span style={s.detailLabel}>Username</span>    {/* Label */}
              <span style={s.detailValue}>@{userDetail.username}</span> {/* Value */}

              <span style={s.detailLabel}>Email</span>        {/* Label */}
              <span style={s.detailValue}>{userDetail.email}</span> {/* Value */}

              <span style={s.detailLabel}>Phone</span>        {/* Label */}
              <span style={s.detailValue}>{userDetail.phone}</span> {/* Value */}

              <span style={s.detailLabel}>Website</span>      {/* Label */}
              <span style={s.detailValue}>{userDetail.website}</span> {/* Value */}

              <span style={s.detailLabel}>Company</span>      {/* Label */}
              <span style={s.detailValue}>{userDetail.company.name}</span> {/* Value */}

              <span style={s.detailLabel}>City</span>         {/* Label */}
              <span style={s.detailValue}>{userDetail.address.city}</span> {/* Value */}

              {/* Recent Posts Section */}
              <h3 style={{ borderTop: "1px solid #eee", paddingTop: "1rem" }}> {/* Posts heading with separator */}
                📝 Recent Posts
                {postsLoading && " ⏳"}               {/* Show spinner inline when loading posts */}
              </h3>

              {posts.length === 0 && !postsLoading && ( /* No posts found */
                <p style={{ color: "#888" }}>No posts found.</p> /* Fallback text */
              )}

              {posts.map(post => (                     /* Map each post to a card */
                <div key={post.id} style={s.postItem}> {/* Post card */}
                  <strong>{post.title}</strong>        {/* Post title in bold */}
                  <p style={{ margin: "0.3rem 0 0", color: "#555" }}> {/* Post body */}
                    {post.body.substring(0, 80)}…      {/* Truncate body to 80 chars */}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );                                                   // End return
}                                                      // End App component

export default App;                                    // Export as default
