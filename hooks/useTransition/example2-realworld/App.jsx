/**
 * @fileoverview Example 2: Real-World Tab Switcher with useTransition.
 * Demonstrates keeping tab button highlights instant (urgent state) while deferring
 * heavy tab panel rendering (non-urgent transition state) with visual pending feedback.
 */
import { useState, useTransition, memo } from 'react'; // Import hooks and memo from React
const DashboardTab = memo(function DashboardTab() { // Memoized Dashboard tab panel to avoid unnecessary re-renders
  const metrics = ['Revenue', 'Users', 'Orders', 'Refunds', 'Sessions', 'Bounce Rate']; // Metric labels for summary cards
  const activityRows = Array.from({ length: 40 }, (_, i) => `User #${(i * 17) % 500 + 1} performed action #${i + 1}`); // Generate deterministic activity rows
  return ( // Return Dashboard panel JSX
    <div style={tabStyles.panel}> {/* Panel wrapper */}
      <h2 style={tabStyles.panelTitle}>📊 Dashboard</h2> {/* Panel heading */}
      <p style={tabStyles.panelSubtitle}>Welcome to your dashboard. Here is your summary for today.</p> {/* Subtitle text */}
      <div style={tabStyles.grid}> {/* 3-column grid for metric cards */}
        {metrics.map((metric, idx) => ( // Render a card for each metric
          <div key={metric} style={tabStyles.card}> {/* Metric card container */}
            <strong>{metric}</strong> {/* Metric name */}
            <span style={tabStyles.value}>{(idx + 1) * 142}</span> {/* Deterministic metric value */}
          </div> // Close metric card
        ))} {/* End metrics map */}
      </div> {/* Close grid */}
      <h3 style={tabStyles.subheading}>Recent Activity</h3> {/* Activity section heading */}
      {activityRows.map((text, i) => ( // Render each activity row
        <div key={i} style={tabStyles.row}> {/* Activity row container */}
          <span>{text}</span> {/* Activity description */}
        </div> // Close activity row
      ))} {/* End activityRows map */}
    </div> // Close panel wrapper
  ); // End return statement
}); // End DashboardTab component
const AnalyticsTab = memo(function AnalyticsTab() { // Memoized Analytics tab panel simulating a heavy chart view
  const bars = Array.from({ length: 30 }, (_, i) => ((i * 37) % 140) + 25); // Generate 30 deterministic bar heights
  const stats = [ // Summary statistics displayed below the chart
    { label: 'Avg. Session', value: '3m 24s' }, // Average session duration
    { label: 'Bounce Rate', value: '42%' }, // Bounce rate percentage
    { label: 'New Users', value: '1,204' }, // Count of new users
    { label: 'Conversions', value: '8.3%' }, // Conversion rate percentage
  ]; // End stats array
  return ( // Return Analytics panel JSX
    <div style={tabStyles.panel}> {/* Panel wrapper */}
      <h2 style={tabStyles.panelTitle}>📈 Analytics</h2> {/* Panel heading */}
      <p style={tabStyles.panelSubtitle}>Detailed analytics for the past 30 days.</p> {/* Subtitle text */}
      <div style={tabStyles.chart}> {/* Bar chart container */}
        {bars.map((height, i) => ( // Render 30 vertical bars
          <div // Individual chart bar
            key={i} // Unique key per bar
            style={{ // Dynamic inline style for each bar
              ...tabStyles.bar, // Base bar styles
              height: `${height}px`, // Bar height in pixels
              backgroundColor: `hsl(${240 + i * 2}, 70%, 60%)`, // Subtle purple-to-violet gradient
            }} // End bar style object
            title={`Day ${i + 1}: ${height} visits`} // Native tooltip on hover
          /> // Close bar element
        ))} {/* End bars map */}
      </div> {/* Close chart container */}
      <div style={tabStyles.statRow}> {/* Row of summary stat blocks */}
        {stats.map(stat => ( // Render each summary stat
          <div key={stat.label} style={tabStyles.statBlock}> {/* Stat block wrapper */}
            <div style={tabStyles.statValue}>{stat.value}</div> {/* Prominent stat value */}
            <div style={tabStyles.statLabel}>{stat.label}</div> {/* Stat label */}
          </div> // Close stat block
        ))} {/* End stats map */}
      </div> {/* Close statRow */}
    </div> // Close panel wrapper
  ); // End return statement
}); // End AnalyticsTab component
const SettingsTab = memo(function SettingsTab() { // Memoized Settings tab panel with interactive toggles
  const [notifications, setNotifications] = useState(true); // State for email notifications toggle
  const [darkMode, setDarkMode] = useState(false); // State for dark mode toggle
  const [autoSave, setAutoSave] = useState(true); // State for auto-save drafts toggle
  const settings = [ // List of toggleable settings
    { label: 'Email Notifications', value: notifications, setter: setNotifications }, // Notifications row config
    { label: 'Dark Mode', value: darkMode, setter: setDarkMode }, // Dark mode row config
    { label: 'Auto-save Drafts', value: autoSave, setter: setAutoSave }, // Auto-save row config
  ]; // End settings array
  return ( // Return Settings panel JSX
    <div style={tabStyles.panel}> {/* Panel wrapper */}
      <h2 style={tabStyles.panelTitle}>⚙️ Settings</h2> {/* Panel heading */}
      <p style={tabStyles.panelSubtitle}>Manage your account preferences.</p> {/* Subtitle text */}
      {settings.map(setting => ( // Render a row for each setting
        <div key={setting.label} style={tabStyles.settingRow}> {/* Setting row container */}
          <span style={tabStyles.settingLabel}>{setting.label}</span> {/* Setting name */}
          <button // Interactive toggle button
            onClick={() => setting.setter(prev => !prev)} // Flip boolean state on click
            style={{ // Dynamic button style
              ...tabStyles.toggle, // Base toggle styles
              backgroundColor: setting.value ? '#6c63ff' : '#ccc', // Purple when ON, gray when OFF
            }} // End button style object
            aria-pressed={setting.value} // Expose toggle state to screen readers
          > {/* Close button opening tag */}
            {setting.value ? 'ON' : 'OFF'} {/* Display ON or OFF label */}
          </button> {/* Close toggle button */}
        </div> // Close setting row
      ))} {/* End settings map */}
    </div> // Close panel wrapper
  ); // End return statement
}); // End SettingsTab component
const TABS = [ // Configuration array mapping tab IDs to labels and components
  { id: 'dashboard', label: '📊 Dashboard', Component: DashboardTab }, // Dashboard tab config
  { id: 'analytics', label: '📈 Analytics', Component: AnalyticsTab }, // Analytics tab config
  { id: 'settings', label: '⚙️ Settings', Component: SettingsTab }, // Settings tab config
]; // End TABS array
export default function App() { // Export the main App component
  const [activeTab, setActiveTab] = useState('dashboard'); // Urgent state for which tab button looks selected
  const [renderedTab, setRenderedTab] = useState('dashboard'); // Deferred state for which tab panel is rendered
  const [isPending, startTransition] = useTransition(); // Track whether the panel switch transition is pending
  function handleTabClick(tabId) { // Handle user clicking a tab button
    setActiveTab(tabId); // Urgent: update tab button highlight immediately
    startTransition(() => { // Non-urgent: defer rendering the new tab panel
      setRenderedTab(tabId); // Schedule heavy tab content switch at low priority
    }); // End startTransition callback
  } // End handleTabClick function
  const activeConfig = TABS.find(tab => tab.id === renderedTab) || TABS[0]; // Look up the component for the deferred tab
  const ActiveComponent = activeConfig.Component; // Extract the React component to render
  return ( // Return the component JSX
    <div style={appStyles.container}> {/* Outer page container */}
      <h1 style={appStyles.title}>Real-World Tab Switcher</h1> {/* Page heading */}
      <p style={appStyles.subtitle}> {/* Subtitle explaining behavior */}
        Tab highlights switch instantly; heavy tab panels render with <code>useTransition</code>. {/* Description text */}
      </p> {/* Close subtitle */}
      <div style={appStyles.tabBar} role="tablist"> {/* Horizontal tab bar */}
        {TABS.map(tab => ( // Render a button for each tab
          <button // Tab button element
            key={tab.id} // Unique key for React list reconciliation
            role="tab" // ARIA role for accessibility
            onClick={() => handleTabClick(tab.id)} // Trigger urgent + transition updates on click
            style={{ // Dynamic tab button styles
              ...appStyles.tabButton, // Base tab button styling
              ...(activeTab === tab.id ? appStyles.tabButtonActive : {}), // Highlight if this tab is active
            }} // End style object
            aria-selected={activeTab === tab.id} // Announce active tab to assistive tech
          > {/* Close button opening tag */}
            {tab.label} {/* Render tab label */}
          </button> // Close tab button
        ))} {/* End TABS map */}
      </div> {/* Close tab bar */}
      <div // Content area displaying the active tab panel
        style={{ // Dynamic content area styles
          ...appStyles.contentArea, // Base content area styling
          opacity: isPending ? 0.6 : 1, // Dim previous panel while new panel renders
          transition: 'opacity 0.2s ease', // Smoothly animate opacity changes
        }} // End style object
      > {/* Close content area opening tag */}
        {isPending && ( // Show floating badge while transition is pending
          <div style={appStyles.loadingBadge}> {/* Floating badge container */}
            ⏳ Loading tab content... {/* Pending status text */}
          </div> // Close badge container
        )} {/* End isPending check */}
        <ActiveComponent /> {/* Render the deferred tab panel component */}
      </div> {/* Close content area */}
    </div> // Close outer container
  ); // End return statement
} // End App component
const appStyles = { // Inline styles for the outer shell and tab bar
  container: { // Outer page wrapper styles
    maxWidth: '800px', // Limit width for comfortable reading
    margin: '40px auto', // Center horizontally with top/bottom space
    fontFamily: 'system-ui, sans-serif', // Clean system font
    padding: '0 24px', // Horizontal padding
  }, // End container styles
  title: { // Main heading styles
    color: '#1a1a2e', // Dark navy color
    margin: '0 0 4px', // Bottom margin only
  }, // End title styles
  subtitle: { // Subtitle styles
    color: '#666', // Medium gray color
    margin: '0 0 24px', // Bottom margin before tab bar
  }, // End subtitle styles
  tabBar: { // Tab bar container styles
    display: 'flex', // Arrange tab buttons in a row
    gap: '4px', // Small gap between buttons
    borderBottom: '2px solid #e5e5e5', // Bottom divider line
  }, // End tabBar styles
  tabButton: { // Default tab button styles
    padding: '12px 20px', // Clickable button padding
    border: 'none', // Remove default border
    background: 'none', // Transparent background
    cursor: 'pointer', // Pointer cursor on hover
    fontSize: '15px', // Readable button text
    color: '#666', // Gray text for inactive tabs
    borderBottom: '3px solid transparent', // Reserve space for active underline
    marginBottom: '-2px', // Overlap tab bar bottom border
    borderRadius: '6px 6px 0 0', // Rounded top corners
    transition: 'all 0.15s', // Smooth hover/active transition
  }, // End tabButton styles
  tabButtonActive: { // Active tab button overrides
    color: '#6c63ff', // Purple text color
    borderBottomColor: '#6c63ff', // Purple active underline
    fontWeight: '600', // Semi-bold label
    background: '#f8f7ff', // Subtle purple tint
  }, // End tabButtonActive styles
  contentArea: { // Tab panel container styles
    position: 'relative', // Anchor for floating loading badge
    border: '1px solid #e5e5e5', // Light border around panel
    borderTop: 'none', // Connect seamlessly to tab bar
    borderRadius: '0 0 12px 12px', // Rounded bottom corners
    minHeight: '300px', // Consistent minimum height
  }, // End contentArea styles
  loadingBadge: { // Floating pending badge styles
    position: 'absolute', // Position relative to contentArea
    top: '12px', // Offset from top edge
    right: '12px', // Offset from right edge
    background: '#6c63ff', // Purple background
    color: 'white', // White text
    padding: '6px 12px', // Pill padding
    borderRadius: '20px', // Pill border radius
    fontSize: '13px', // Compact font size
    fontStyle: 'italic', // Italicized status text
    zIndex: 10, // Layer above panel content
  }, // End loadingBadge styles
}; // End appStyles object
const tabStyles = { // Inline styles shared by tab panel components
  panel: { // Panel inner padding
    padding: '24px', // Uniform padding inside panel
  }, // End panel styles
  panelTitle: { // Panel heading styles
    marginTop: 0, // Remove top margin
    color: '#1a1a2e', // Dark navy text
  }, // End panelTitle styles
  panelSubtitle: { // Panel subtitle styles
    color: '#555', // Medium gray text
    marginBottom: '16px', // Space below subtitle
  }, // End panelSubtitle styles
  grid: { // Metric cards grid layout
    display: 'grid', // Enable CSS Grid
    gridTemplateColumns: 'repeat(3, 1fr)', // Three equal columns
    gap: '12px', // Gap between cards
    margin: '16px 0', // Vertical margin
  }, // End grid styles
  card: { // Metric card styles
    background: '#f8f7ff', // Light purple tint
    border: '1px solid #e0dcff', // Soft purple border
    borderRadius: '8px', // Rounded corners
    padding: '16px', // Inner card padding
    display: 'flex', // Flex container
    flexDirection: 'column', // Stack label and value vertically
    gap: '8px', // Space between label and value
  }, // End card styles
  value: { // Metric number styles
    fontSize: '24px', // Large prominent number
    fontWeight: 'bold', // Bold weight
    color: '#6c63ff', // Purple accent color
  }, // End value styles
  subheading: { // Section subheading styles
    color: '#333', // Dark gray text
    marginTop: '24px', // Space above subheading
  }, // End subheading styles
  row: { // Activity row styles
    padding: '8px 0', // Vertical row padding
    borderBottom: '1px solid #f0f0f0', // Subtle row separator
    fontSize: '14px', // Compact font size
    color: '#555', // Medium gray text
  }, // End row styles
  chart: { // Bar chart container styles
    display: 'flex', // Arrange bars horizontally
    alignItems: 'flex-end', // Align bars to bottom baseline
    gap: '4px', // Space between bars
    height: '180px', // Fixed chart height
    padding: '0 0 8px', // Bottom padding above axis
    borderBottom: '2px solid #eee', // Baseline axis border
    margin: '16px 0', // Vertical spacing
    overflowX: 'auto', // Allow horizontal scroll if needed
  }, // End chart styles
  bar: { // Individual bar styles
    minWidth: '12px', // Minimum bar width
    borderRadius: '3px 3px 0 0', // Rounded top corners
    flexShrink: 0, // Prevent bars from shrinking
  }, // End bar styles
  statRow: { // Summary stats row layout
    display: 'flex', // Arrange stat blocks in a row
    flexWrap: 'wrap', // Wrap on narrow viewports
    gap: '24px', // Space between stat blocks
    marginTop: '16px', // Space above row
  }, // End statRow styles
  statBlock: { // Individual stat block styles
    minWidth: '100px', // Minimum width for alignment
  }, // End statBlock styles
  statValue: { // Stat value text styles
    fontSize: '28px', // Large stat number
    fontWeight: 'bold', // Bold emphasis
    color: '#6c63ff', // Purple accent color
  }, // End statValue styles
  statLabel: { // Stat label text styles
    fontSize: '12px', // Small label text
    color: '#888', // Muted gray color
    marginTop: '2px', // Small gap below value
  }, // End statLabel styles
  settingRow: { // Settings row container styles
    display: 'flex', // Flex row layout
    justifyContent: 'space-between', // Push label left and toggle right
    alignItems: 'center', // Vertically center items
    padding: '16px 0', // Vertical row padding
    borderBottom: '1px solid #f0f0f0', // Subtle divider line
  }, // End settingRow styles
  settingLabel: { // Setting label text styles
    fontSize: '16px', // Readable label size
    color: '#333', // Dark gray text
  }, // End settingLabel styles
  toggle: { // Toggle button styles
    padding: '8px 20px', // Pill button padding
    border: 'none', // Remove default border
    borderRadius: '20px', // Rounded pill shape
    color: 'white', // White ON/OFF text
    cursor: 'pointer', // Pointer cursor
    fontWeight: 'bold', // Bold text
    fontSize: '13px', // Compact button text
    transition: 'background-color 0.2s', // Smooth color transition
  }, // End toggle styles
}; // End tabStyles object
