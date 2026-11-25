# `useReducer` Cheatsheet

---

## Syntax at a Glance

```jsx
import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "ACTION_NAME":
      return { ...state, value: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

const [state, dispatch] = useReducer(reducer, initialArg, initOptional);
```

---

## 5 Quick Patterns

### 1. Basic Counter / Toggle
```jsx
const [on, dispatch] = useReducer((state) => !state, false);
// Usage: <button onClick={dispatch}>Toggle</button>
```

### 2. Action with `payload`
```jsx
dispatch({ type: "SET_STEP", payload: 5 });
// Inside reducer: case "SET_STEP": return { ...state, step: action.payload };
```

### 3. Lazy Initialization (`init` 3rd argument)
```jsx
const init = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const [items, dispatch] = useReducer(reducer, "saved_items", init);
```

### 4. Async Fetch State Machine
```jsx
// States: { status: "idle" | "loading" | "success" | "error", data: null, error: null }
dispatch({ type: "FETCH_START" });
dispatch({ type: "FETCH_SUCCESS", payload: data });
dispatch({ type: "FETCH_ERROR", payload: err.message });
```

### 5. Reducer + Context (Global State Without Prop Drilling)
```jsx
const StateContext = createContext(null);
// In parent: <StateContext.Provider value={{ state, dispatch }}>...</StateContext.Provider>
// In child:  const { state, dispatch } = useContext(StateContext);
```

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Return a **new** object/array (`{ ...state }`, `[...arr]`) | Mutate `state` directly (`state.items.push(x)`) |
| Keep reducers **pure** (only compute next state) | Run `fetch`, `localStorage`, or timers inside a reducer |
| Always include a `default` branch in `switch` | Omit `default` (returns `undefined` on typos!) |
| Name actions after **what happened** (`"SUBMIT_FORM"`) | Name actions after setters (`"SET_ALL_FIELDS"`) |
| Use `init` (3rd arg) for expensive initial state | Call `JSON.parse()` directly as the 2nd arg on every render |
| Pass `dispatch` directly to children (it's stable!) | Wrap `dispatch` in `useCallback` unnecessarily |

---

## Common Errors & Fixes

| Symptom / Error | Likely Cause | Fix |
| :--- | :--- | :--- |
| UI doesn't update after `dispatch` | Mutated `state` in place and returned the same reference | Return a new object/array: `return { ...state, count: state.count + 1 }` |
| `Cannot read properties of undefined` | Forgot `default` case in `switch`, so reducer returned `undefined` | Add `default: return state;` or `default: throw new Error(...)` |
| `console.log(state)` after `dispatch` shows old value | `dispatch` schedules the next render; `state` is a snapshot of current render | Read the new `state` in JSX or in `useEffect(..., [state])` |
| Reducer runs twice in development | React Strict Mode double-invokes pure functions to catch side effects | Ensure your reducer is pure; move side effects to `useEffect` or handlers |
| Too many re-renders / infinite loop | Calling `dispatch(...)` directly inside the component body during render | Call `dispatch` only inside event handlers or `useEffect` |
