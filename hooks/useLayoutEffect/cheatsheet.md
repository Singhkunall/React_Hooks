# `useLayoutEffect` Cheatsheet

## Syntax at a Glance

```jsx
import { useLayoutEffect } from 'react';

useLayoutEffect(() => {
  // Runs synchronously after DOM mutations, BEFORE browser paint
  const rect = ref.current.getBoundingClientRect();

  return () => {
    // Optional cleanup before next run or unmount
  };
}, [dependency]);
```

---

## 5 Quick Patterns

1. **Measure an element's size before paint:**
   ```jsx
   useLayoutEffect(() => {
     setWidth(boxRef.current.offsetWidth);
   }, [text]);
   ```
2. **Flip a tooltip if it overflows the viewport:**
   ```jsx
   useLayoutEffect(() => {
     const rect = tipRef.current.getBoundingClientRect();
     if (rect.top < 0) setPlacement('bottom');
   }, [isOpen]);
   ```
3. **Keep a chat list scrolled to the bottom:**
   ```jsx
   useLayoutEffect(() => {
     listRef.current.scrollTop = listRef.current.scrollHeight;
   }, [messages.length]);
   ```
4. **SSR-safe `useIsomorphicLayoutEffect`:**
   ```jsx
   const useIsomorphicLayoutEffect =
     typeof window !== 'undefined' ? useLayoutEffect : useEffect;
   ```
5. **Prevent unnecessary re-renders when measuring:**
   ```jsx
   useLayoutEffect(() => {
     const h = elRef.current.offsetHeight;
     setHeight((prev) => (prev === h ? prev : h));
   }, [content]);
   ```

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Use it to measure DOM sizes/positions (`getBoundingClientRect`) | Use it for API calls, `fetch`, or logging |
| Keep the callback fast so painting isn't delayed | Run heavy loops or expensive sorting inside it |
| Guard with `typeof window !== 'undefined'` in SSR apps | Call it directly in SSR without an isomorphic wrapper |
| Always provide an accurate dependency array | Omit dependencies when calling `setState` unconditionally |
| Default to `useEffect` unless you see a visual flicker | Use `useLayoutEffect` everywhere "just in case" |

---

## Common Errors & Fixes

| Error / Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `Warning: useLayoutEffect does nothing on the server` | Running `useLayoutEffect` during SSR (Next.js/Remix) | Use `useIsomorphicLayoutEffect` (`typeof window !== 'undefined'`) |
| UI freezes / "Maximum update depth exceeded" | Calling `setState` inside `useLayoutEffect` without a dependency array or equality guard | Add `[deps]` and bail out if the measured value hasn't changed |
| `Cannot read properties of null (reading 'getBoundingClientRect')` | Ref is not attached yet (e.g., conditional render) | Guard with `if (!ref.current) return;` at the top |
| Sluggish page transitions | Heavy computation or async work blocking browser paint | Move non-layout logic to `useEffect` or `useMemo` |
