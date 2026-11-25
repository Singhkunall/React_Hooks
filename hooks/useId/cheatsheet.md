# `useId` Cheatsheet

A 1-page quick reference for React's `useId` hook (React 18+).

---

## Syntax at a Glance

```jsx
import { useId } from 'react';

function EmailField() {
  const id = useId(); // e.g. ":r0:" (takes no arguments)
  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} type="email" />
    </>
  );
}
```

---

## 5 Quick Patterns

1. **Label + Input Linking**
   ```jsx
   const id = useId();
   <label htmlFor={id}>Name</label>
   <input id={id} type="text" />
   ```

2. **Derived IDs from One Base ID** *(preferred for multiple elements)*
   ```jsx
   const baseId = useId();
   const inputId = `${baseId}-input`;
   const errorId = `${baseId}-error`;
   ```

3. **Input + Error Message (`aria-describedby`)**
   ```jsx
   const id = useId();
   <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
   {error && <p id={`${id}-err`} role="alert">{error}</p>}
   ```

4. **Accordion / Disclosure ARIA Wiring**
   ```jsx
   const id = useId();
   <button id={`${id}-btn`} aria-expanded={open} aria-controls={`${id}-panel`}>Toggle</button>
   <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} hidden={!open}>{children}</div>
   ```

5. **Unique SVG `<defs>` IDs**
   ```jsx
   const gradId = useId();
   <svg><defs><linearGradient id={gradId}>...</linearGradient></defs><rect fill={`url(#${gradId})`} /></svg>
   ```

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Call `useId()` at the top level of a component or custom hook | Call `useId()` inside conditions, loops, or callbacks |
| Derive multiple related IDs from one `useId()` (`${id}-error`) | Call `useId()` 5 times when 1 base ID with suffixes works |
| Use `useId()` for `<label htmlFor>`, ARIA attributes, and SVG IDs | Use `useId()` for React list `key` props (use data IDs instead) |
| Treat the returned string (`:r0:`) as an opaque unique token | Parse or rely on the internal `:r0:` format |
| Use `useRef` when you need a direct reference to a DOM node | Pass a `useId()` string into `document.querySelector('#...')` |

---

## Common Errors & Fixes

| Error / Symptom | Cause | Fix |
| :--- | :--- | :--- |
| **Hydration mismatch warning** in SSR | Using `Math.random()`, `Date.now()`, or a global counter for IDs | Replace with `useId()`, which is deterministic across server & client |
| **`SyntaxError: Failed to execute 'querySelector'`** | `useId()` values contain colons (`:r0:`), which are invalid unescaped CSS selectors | Use `useRef` to access the DOM element instead of `querySelector` |
| **Clicking a `<label>` focuses the wrong input** | Hardcoded duplicate `id="email"` across multiple component instances | Generate a unique `id` per instance with `useId()` |
| **React Hook rule violation error** | Calling `useId()` inside an `if` block or `.map()` | Move `useId()` unconditionally to the top of the component |
| **Unnecessary re-renders / unstable list state** | Using `useId()` as a `key` in `.map()` | Use a stable identifier from your data (e.g. `item.id`) |
