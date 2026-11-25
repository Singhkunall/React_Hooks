/**
 * @fileoverview Example 3 — Advanced Pattern: Task Board with Undo History,
 * Lazy Initialization (3rd argument), Context Sharing, and localStorage Sync.
 */
import { createContext, useContext, useEffect, useReducer, useState } from "react"; // Import React hooks for reducer, context, effects, and input state

const STORAGE_KEY = "usereducer_tasks_v1"; // Key used to save and load tasks in localStorage
const TaskContext = createContext(null); // Create a React Context to share state and dispatch with child components

function initTasks(storageKey) { // Lazy initializer function passed as the 3rd argument to useReducer
  try { // Wrap localStorage access in try/catch in case storage is blocked or JSON is invalid
    const saved = localStorage.getItem(storageKey); // Read saved JSON string from localStorage
    const parsed = saved ? JSON.parse(saved) : []; // Parse saved tasks array or fall back to empty array
    return { tasks: parsed, history: [] }; // Return initial state containing loaded tasks and empty undo history
  } catch { // Handle any storage or JSON parsing errors gracefully
    return { tasks: [], history: [] }; // Return safe default empty state
  } // End try/catch
} // End initTasks function

function taskReducer(state, action) { // Pure reducer managing tasks along with an undo history stack
  switch (action.type) { // Inspect action.type to determine the state transition
    case "ADD_TASK": { // Add a new task while saving the previous task list to history
      const newTask = { id: Date.now(), text: action.payload, done: false }; // Create a new task object with a unique id
      return { // Return new state object
        history: [...state.history, state.tasks], // Push current tasks snapshot onto the undo history stack
        tasks: [...state.tasks, newTask], // Append the new task immutably
      }; // End returned state
    } // End ADD_TASK case
    case "TOGGLE_TASK": { // Toggle a task's completion status while saving undo history
      return { // Return new state object
        history: [...state.history, state.tasks], // Push current tasks snapshot onto the undo history stack
        tasks: state.tasks.map((t) => (t.id === action.payload ? { ...t, done: !t.done } : t)), // Flip done flag on matching task
      }; // End returned state
    } // End TOGGLE_TASK case
    case "UNDO": { // Revert tasks to the most recent snapshot in history
      if (state.history.length === 0) return state; // Return current state unchanged if history is empty
      const previousTasks = state.history[state.history.length - 1]; // Read the most recent snapshot from history
      return { // Return restored state object
        tasks: previousTasks, // Replace current tasks with the previous snapshot
        history: state.history.slice(0, -1), // Remove the used snapshot from the end of history
      }; // End returned state
    } // End UNDO case
    default: // Fallback for unrecognized action types
      throw new Error(`Unknown action: ${action.type}`); // Throw an explicit error for easier debugging
  } // End switch statement
} // End taskReducer function

function TaskList() { // Child component consuming state and dispatch directly from TaskContext
  const { state, dispatch } = useContext(TaskContext); // Access state and dispatch without receiving props
  return ( // Render the list of tasks
    <ul> {/* Unordered list container */}
      {state.tasks.map((task) => ( // Loop over each task in state.tasks
        <li key={task.id} style={{ marginBottom: "0.4rem" }}> {/* List item keyed by task.id */}
          <label style={{ textDecoration: task.done ? "line-through" : "none", cursor: "pointer" }}> {/* Strike through completed tasks */}
            <input type="checkbox" checked={task.done} onChange={() => dispatch({ type: "TOGGLE_TASK", payload: task.id })} />{" "} {/* Dispatch TOGGLE_TASK on toggle */}
            {task.text} {/* Render the task description */}
          </label> {/* End label */}
        </li> // End list item
      ))} {/* End state.tasks.map */}
    </ul> // End unordered list
  ); // End return statement
} // End TaskList component

export default function App() { // Export main App component as default
  const [state, dispatch] = useReducer(taskReducer, STORAGE_KEY, initTasks); // Initialize useReducer with lazy initTasks function
  const [text, setText] = useState(""); // Use simple useState for the controlled text input field

  useEffect(() => { // Side effect: persist tasks to localStorage whenever state.tasks updates
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks)); // Serialize and store tasks array
  }, [state.tasks]); // Dependency array ensures effect runs only when state.tasks changes

  function handleSubmit(e) { // Form submit handler for adding a new task
    e.preventDefault(); // Prevent default browser form submission reload
    if (!text.trim()) return; // Do nothing if input is empty or whitespace only
    dispatch({ type: "ADD_TASK", payload: text.trim() }); // Dispatch ADD_TASK with trimmed text
    setText(""); // Clear the controlled input field after adding
  } // End handleSubmit function

  return ( // Render the Task Board wrapped in TaskContext.Provider
    <TaskContext.Provider value={{ state, dispatch }}> {/* Share state and dispatch with all descendant components */}
      <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: "480px" }}> {/* Main container */}
        <h1>Task Board (with Undo)</h1> {/* App title */}
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}> {/* Form to add tasks */}
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New task..." /> {/* Controlled text input */}
          <button type="submit">Add</button> {/* Submit button */}
          <button type="button" disabled={state.history.length === 0} onClick={() => dispatch({ type: "UNDO" })}> {/* Undo button disabled when no history exists */}
            Undo ({state.history.length}) {/* Display number of available undo steps */}
          </button> {/* End Undo button */}
        </form> {/* End form */}
        <TaskList /> {/* Render TaskList which consumes TaskContext */}
      </div> {/* End main container */}
    </TaskContext.Provider> // End TaskContext.Provider
  ); // End return statement
} // End App component
