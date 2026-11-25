# `useCallback` Cheatsheet

## Syntax at a Glance

```jsx
import { useCallback } from 'react';

const memoizedFn = useCallback(
  (arg) => {
    // Function body (not called immediately — just cached!)
  },
  [dep1, dep2] // Re-create only when any dependency changes
);
```

---

## 5 Quick Patterns

1. **Stable callback for `React.memo` child (no dependencies):**
   ```jsx
   const handleReset = useCallback(() => setCount(0), []);
   ```

2. **Functional state update (avoids stale closures & keeps `[]` empty):**
   ```jsx
   const handleAdd = useCallback(() => setItems((prev) => [...prev, 'New']), []);
   ```

3. **Callback depending on props or state:**
   ```jsx
   const handleSave = useCallback(() => saveUser(userId, name), [userId, name]);
   ```

4. **Safe function inside `useEffect`:**
   ```jsx
   const fetchProfile = useCallback(() => api.get(id), [id]);
   useEffect(() => { fetchProfile(); }, [fetchProfile]);
   ```

5. **Returning stable actions from a custom hook:**
   ```jsx
   function useToggle(init = false) {
     const [on, setOn] = useState(init);
     const toggle = useCallback(() => setOn((v) => !v), []);
     return [on, toggle];
   }
   ```

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Pair `useCallback` with `React.memo` on child components. | Wrap every single function in `useCallback` "just in case." |
| Include **all** reactive values used inside `fn` in `[deps]`. | Leave `[deps]` empty when reading state/props (causes stale bugs). |
| Use functional updaters (`setCount(c => c + 1)`) to shrink `[deps]`. | Depend on `useCallback` to *execute* code (use `useMemo` for values). |
| Use `useCallback` for functions passed into `useEffect` dependencies. | Forget that `useCallback` still evaluates the inline function on render. |

---

## Common Errors & Fixes

| Symptom / Error | Cause | Fix |
| :--- | :--- | :--- |
| Callback uses old/stale state value | Missing state/prop in dependency array `[deps]` | Add the missing variable to `[deps]` or use `setState(prev => ...)` |
| Child still re-renders every time | Child component is not wrapped in `React.memo` | Wrap the child component with `React.memo(Child)` |
| `useEffect` runs in an infinite loop | Function in `useEffect` deps isn't memoized | Wrap the function in `useCallback` with proper `[deps]` |
| ESLint `exhaustive-deps` warning | Referenced variable omitted from `[deps]` | Add all referenced props/state/helpers to `[deps]` |
