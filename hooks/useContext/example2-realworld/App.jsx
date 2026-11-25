/**
 * Example 2 — Real-World Use Case: Authentication & Role-Based Dashboard
 *
 * Shows how apps share the currently logged-in user, their role, and
 * login/logout actions across unrelated parts of the UI (Navbar, Main Workspace,
 * and Status Footer) using a custom `useAuth` hook and `useMemo`.
 */
import { createContext, useContext, useMemo, useState } from 'react'; // Import React hooks for context, memoization, and state

const AuthContext = createContext(null); // Create AuthContext with null default so missing Providers are easy to catch

function useAuth() { // Define a custom hook that wraps useContext(AuthContext)
  const context = useContext(AuthContext); // Read the nearest AuthContext.Provider value
  if (!context) { // Check if the hook was called outside of AuthProvider
    throw new Error('useAuth must be used inside an <AuthContext.Provider>'); // Throw a clear developer-friendly error
  } // End guard check
  return context; // Return the authenticated context value
} // End useAuth custom hook

function Navbar() { // Define a top navigation bar that displays session status
  const { user, logout } = useAuth(); // Subscribe to user and logout from AuthContext

  return ( // Return the navbar JSX
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#0f172a', color: '#f8fafc', borderRadius: '8px' }}> {/* Dark header bar */}
      <strong>Acme Workspace</strong> {/* Brand name on the left */}
      {user ? ( // Render user info and logout button when signed in
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}> {/* Right-side user controls */}
          <span>{user.name} <em>({user.role})</em></span> {/* Show signed-in user name and role */}
          <button onClick={logout}>Sign Out</button> {/* Trigger logout when clicked */}
        </div> // Close right-side controls
      ) : ( // Render guest badge when signed out
        <span style={{ color: '#94a3b8' }}>Guest Mode</span> // Muted guest indicator
      )} {/* End conditional branch */}
    </header> // Close header
  ); // End return
} // End Navbar component

function WorkspacePanel() { // Define the main workspace area that reacts to auth state
  const { user, login } = useAuth(); // Subscribe to user and login from AuthContext

  if (!user) { // Show sign-in options if no user is currently logged in
    return ( // Return login prompt JSX
      <section style={{ padding: '24px', marginTop: '16px', border: '1px solid #cbd5e1', borderRadius: '8px' }}> {/* Card container */}
        <h2>Sign in to continue</h2> {/* Prompt heading */}
        <p>Choose a demo account to see how context updates every component at once:</p> {/* Helper description */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}> {/* Button group */}
          <button onClick={() => login('Ada Lovelace', 'Admin')}>Sign In as Admin</button> {/* Log in with Admin privileges */}
          <button onClick={() => login('Grace Hopper', 'Editor')}>Sign In as Editor</button> {/* Log in with Editor privileges */}
        </div> {/* Close button group */}
      </section> // Close card container
    ); // End return
  } // End unauthenticated branch

  return ( // Return authenticated dashboard JSX
    <main style={{ padding: '24px', marginTop: '16px', border: '1px solid #cbd5e1', borderRadius: '8px' }}> {/* Main dashboard card */}
      <h2>Welcome, {user.name}!</h2> {/* Personalized greeting */}
      <p>Your current role is <strong>{user.role}</strong>.</p> {/* Display active role */}
      {user.role === 'Admin' ? ( // Show role-specific capabilities based on user.role
        <div style={{ padding: '12px', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '6px' }}> {/* Admin notice box */}
          Admin Access: You can manage team members, billing, and API keys. {/* Admin-only message */}
        </div> // Close Admin notice
      ) : ( // Otherwise show Editor capabilities
        <div style={{ padding: '12px', background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '6px' }}> {/* Editor notice box */}
          Editor Access: You can create and publish content, but billing is restricted. {/* Editor-only message */}
        </div> // Close Editor notice
      )} {/* End role check */}
    </main> // Close main card
  ); // End return
} // End WorkspacePanel component

function SessionFooter() { // Define a footer component at the bottom of the page
  const { user } = useAuth(); // Read only the user state from AuthContext
  return ( // Return footer JSX
    <footer style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}> {/* Muted footer text */}
      Session status: {user ? `Active session for ${user.name}` : 'No active session'} {/* Reflect live auth state */}
    </footer> // Close footer
  ); // End return
} // End SessionFooter component

export default function App() { // Define and export the root App component
  const [user, setUser] = useState(null); // Store the active user object or null when logged out

  const login = (name, role) => setUser({ name, role }); // Update user state with the selected demo account
  const logout = () => setUser(null); // Clear user state back to null on sign out

  const authValue = useMemo(() => ({ user, login, logout }), [user]); // Memoize the context value so consumers only re-render when user changes

  return ( // Return the app wrapped in AuthContext.Provider
    <AuthContext.Provider value={authValue}> {/* Provide memoized auth state and actions to all children */}
      <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif' }}> {/* Centered layout container */}
        <Navbar /> {/* Render top navigation bar */}
        <WorkspacePanel /> {/* Render main workspace content */}
        <SessionFooter /> {/* Render session status footer */}
      </div> {/* Close layout container */}
    </AuthContext.Provider> // Close AuthContext.Provider
  ); // End return
} // End App component
