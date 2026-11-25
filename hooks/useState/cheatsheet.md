# `useState` Cheatsheet

### Syntax at a Glance

```jsx
import { useState } from "react";

const [value, setValue] = useState(initialValue);
```

- `value` — Current state for this render.
- `setValue(next)` — Schedules a re-render with `next`.
- `initialValue` — Used **only** on the first render (or pass `() => compute()` for lazy init).

---

### 5 Quick Patterns

1. **Boolean Toggle**
   ```jsx
   const [isOpen, setIsOpen] = useState(false);
   <button onClick={() => setIsOpen((prev) => !prev)}>Toggle</button>
   ```

2. **Controlled Input**
   ```jsx
   const [text, setText] = useState("");
   <input value={text} onChange={(e) => setText(e.target.value)} />
   ```

3. **Functional Updater (Safe Multiple Updates)**
   ```jsx
   const [count, setCount] = useState(0);
   setCount((prev) => prev + 1); // Always uses latest queued state
   ```

4. **Immutable Object Update**
   ```jsx
   const [user, setUser] = useState({ name: "Ada", role: "Dev" });
   setUser((prev) => ({ ...prev, role: "Lead" })); // Copy + override
   ```

5. **Immutable Array Add / Remove**
   ```jsx
   const [items, setItems] = useState(["a", "b"]);
   setItems((prev) => [...prev, "c"]);                  // Add
   setItems((prev) => prev.filter((item) => item !== "a")); // Remove
   ```

---

### Do's and Don'ts

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Call `useState` at the top level of your component. | Call `useState` inside `if`, `for`, or nested functions. |
| Create new arrays/objects (`[...arr]`, `{ ...obj }`) when updating. | Mutate state in place (`arr.push()`, `obj.key = val`). |
| Use `prev => ...` when the next state depends on the previous state. | Call `setCount(count + 1)` multiple times in one handler. |
| Pass `() => heavyFn()` for expensive initial state. | Pass `heavyFn()` directly (runs on every render). |
| Derive computed values during render (`const total = a + b`). | Store redundant derived values in a separate `useState`. |

---

### Common Errors & Fixes

| Symptom / Error | Cause | Fix |
| :--- | :--- | :--- |
| UI doesn't update after `setItems(items)` | Mutated array/object in place; same reference | Return a new copy: `setItems([...items, newItem])` |
| `console.log(state)` prints the old value | `setState` schedules the *next* render; current variable is a snapshot | Log the new value before calling `setState`, or use `useEffect` |
| `Rendered more hooks than during the previous render` | `useState` was called conditionally (`if (...) useState(...)`) | Move all `useState` calls to the very top of the component |
| `Too many re-renders` infinite loop | Called `setState(...)` directly in the render body or `onClick={setCount(1)}` | Wrap in an event handler: `onClick={() => setCount(1)}` |
| Updating state 3 times only increments by 1 | Read stale `count` snapshot 3 times | Use functional updater: `setCount(c => c + 1)` |
