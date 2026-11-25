# `useRef` Cheatsheet

## Syntax at a Glance

```jsx
import { useRef } from 'react';

const myRef = useRef(initialValue); // Returns { current: initialValue }
myRef.current = newValue;           // Mutate directly (NO re-render)
<input ref={myRef} />               // Attach to a DOM element
```

---

## 5 Quick Patterns

1. **Focus an Input:**
   ```jsx
   const inputRef = useRef(null);
   const focus = () => inputRef.current?.focus();
   return <input ref={inputRef} />;
   ```
2. **Store a Timer / Interval ID:**
   ```jsx
   const timerRef = useRef(null);
   timerRef.current = setInterval(tick, 1000);
   clearInterval(timerRef.current);
   ```
3. **Track Previous State:**
   ```jsx
   const prevRef = useRef(value);
   useEffect(() => { prevRef.current = value; }, [value]);
   ```
4. **Scroll an Element into View:**
   ```jsx
   const endRef = useRef(null);
   endRef.current?.scrollIntoView({ behavior: 'smooth' });
   ```
5. **Avoid Stale Closures in Listeners:**
   ```jsx
   const latestCallbackRef = useRef(callback);
   useEffect(() => { latestCallbackRef.current = callback; });
   ```

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Use `useRef` for DOM nodes, timer IDs, and non-visual values. | Use `useRef` for data that must trigger a UI update when changed (use `useState`). |
| Read or mutate `ref.current` inside `useEffect` or event handlers. | Read or write `ref.current` directly during the component's render body. |
| Guard DOM access with optional chaining (`ref.current?.focus()`). | Assume `ref.current` is populated before the component mounts. |
| Clean up intervals/listeners stored in refs on unmount. | Leave active `setInterval` or observers running after unmount. |

---

## Common Errors & Fixes

| Error / Bug | Cause | Fix |
| :--- | :--- | :--- |
| `TypeError: Cannot read properties of null (reading 'focus')` | Accessing `ref.current` during render before the DOM mounts. | Move the access into `useEffect` or an event handler, and use `?.`. |
| UI doesn't update when `ref.current` changes | `useRef` mutations never trigger a re-render. | Switch to `useState` for any value displayed in JSX. |
| `ref.current` is `null` on a custom component | The custom component didn't attach the `ref` prop to a DOM node. | Accept `{ ref }` as a prop (React 19+) or wrap with `forwardRef` and pass to the inner DOM element. |
| Value resets to initial on every render | Used a normal `let x = 0` variable instead of `useRef(0)`. | Wrap the persistent value in `useRef(0)`. |
