/**
 * @fileoverview Advanced Undoable Task Board demonstrating lazy state initialization,
 * immutable nested updates, derived state, and a history stack with Undo support.
 */
import { useState } from "react"; // Import the useState hook from React

const DEFAULT_TASKS = [ // Starter tasks used only on initial mount
  { id: 1, title: "Learn useState basics", done: true }, // First sample task
  { id: 2, title: "Practice immutable updates", done: false }, // Second sample task
]; // End DEFAULT_TASKS

function App() { // Define the main App functional component
  const [history, setHistory] = useState(() => [DEFAULT_TASKS]); // Lazy-initialize history stack once on mount
  const [draft, setDraft] = useState(""); // Track the text input for a new task
  const [filter, setFilter] = useState("all"); // Track active filter: 'all', 'active', or 'done'

  const currentTasks = history[history.length - 1]; // Derive the latest task list from top of history
  const remainingCount = currentTasks.filter((t) => !t.done).length; // Derive count of incomplete tasks

  const visibleTasks = currentTasks.filter((task) => { // Filter tasks based on active filter state
    if (filter === "active") return !task.done; // Keep only incomplete tasks
    if (filter === "done") return task.done; // Keep only completed tasks
    return true; // Keep all tasks when filter is 'all'
  }); // End visibleTasks filter

  function commitTasks(nextTasks) { // Push a new immutable snapshot onto history
    setHistory((prevHistory) => [...prevHistory, nextTasks]); // Append nextTasks without mutating prevHistory
  } // End commitTasks

  function handleAddTask(event) { // Add a new task from the draft input
    event.preventDefault(); // Prevent default form submission reload
    const trimmed = draft.trim(); // Trim leading and trailing whitespace
    if (!trimmed) return; // Ignore empty task titles
    const newTask = { id: Date.now(), title: trimmed, done: false }; // Build new task object
    commitTasks([...currentTasks, newTask]); // Commit new list with appended task
    setDraft(""); // Clear the draft input field
  } // End handleAddTask

  function handleToggleTask(taskId) { // Toggle completion status for a specific task
    const nextTasks = currentTasks.map((task) => // Create a new array via map
      task.id === taskId ? { ...task, done: !task.done } : task // Clone and flip 'done' for matching task
    ); // End map
    commitTasks(nextTasks); // Save updated snapshot to history
  } // End handleToggleTask

  function handleUndo() { // Revert to the previous snapshot in history
    if (history.length <= 1) return; // Stop if no previous snapshots exist
    setHistory((prevHistory) => prevHistory.slice(0, -1)); // Drop the latest snapshot immutably
  } // End handleUndo

  return ( // Return JSX for the task board
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: "460px", margin: "40px auto", padding: "24px", border: "1px solid #e2e8f0", borderRadius: "12px" }}> {/* Main container */}
      <h1 style={{ marginTop: 0 }}>Undoable Task Board</h1> {/* Heading */}
      <form onSubmit={handleAddTask} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}> {/* New task form */}
        <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a task..." style={{ flex: 1, padding: "8px" }} /> {/* Controlled draft input */}
        <button type="submit" style={{ padding: "8px 14px", cursor: "pointer" }}>Add</button> {/* Add task button */}
        <button type="button" onClick={handleUndo} disabled={history.length <= 1} style={{ padding: "8px 14px", cursor: "pointer" }}>Undo</button> {/* Undo button */}
      </form> {/* End form */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "0.9rem" }}> {/* Status and filter bar */}
        <span>{remainingCount} remaining (History: {history.length})</span> {/* Show derived counts */}
        <div style={{ display: "flex", gap: "4px" }}> {/* Filter button group */}
          {["all", "active", "done"].map((mode) => ( // Render a button for each filter mode
            <button key={mode} onClick={() => setFilter(mode)} style={{ fontWeight: filter === mode ? "bold" : "normal", cursor: "pointer" }}> {/* Filter button */}
              {mode} {/* Display filter name */}
            </button> // End filter button
          ))} {/* End filter map */}
        </div> {/* End filter button group */}
      </div> {/* End status bar */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}> {/* Task list */}
        {visibleTasks.map((task) => ( // Render each visible task
          <li key={task.id} style={{ padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}> {/* Task row */}
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", textDecoration: task.done ? "line-through" : "none" }}> {/* Task label */}
              <input type="checkbox" checked={task.done} onChange={() => handleToggleTask(task.id)} /> {/* Controlled checkbox */}
              <span>{task.title}</span> {/* Task title text */}
            </label> {/* End task label */}
          </li> // End task row
        ))} {/* End task map */}
      </ul> {/* End task list */}
    </main> // End main container
  ); // End return statement
} // End App component

export default App; // Export App as the default export
