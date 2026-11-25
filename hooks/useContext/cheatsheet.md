# `useContext` Cheatsheet

### Syntax at a Glance

```jsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light'); // 1. Create context (+ optional default)

function App() {
  return (
    <ThemeContext.Provider value="dark">   {/* 2. Provide value to subtree */}
      <Button />
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext);  // 3. Consume value anywhere inside
  return <button className={theme}>Click</button>;
}
```

---

### 5 Quick Patterns

1. **Custom Hook Guard (Recommended):**
   ```jsx
   const useTheme = () => {
     const ctx = useContext(ThemeContext);
     if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
     return ctx;
   };
   ```

2. **Memoized Object Value (Prevents Extra Re-renders):**
   ```jsx
   const value = useMemo(() => ({ user, login, logout }), [user]);
   <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
   ```

3. **Split State & Dispatch Contexts (with `useReducer`):**
   ```jsx
   <StateContext.Provider value={state}>
     <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
   </StateContext.Provider>
   ```

4. **Overriding Context in a Subtree (Nearest Provider Wins):**
   ```jsx
   <ThemeContext.Provider value="light">
     <Header /> {/* light */}
     <ThemeContext.Provider value="dark">
       <Sidebar /> {/* dark */}
     </ThemeContext.Provider>
   </ThemeContext.Provider>
   ```

5. **Dedicated Provider Component:**
   ```jsx
   export function ThemeProvider({ children }) {
     const [theme, setTheme] = useState('light');
     return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
   }
   ```

---

### Do's and Don'ts

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Use for truly global/subtree data (theme, auth, locale, toast). | Use for simple 1–2 level parent-to-child data (just use props). |
| Wrap `value={{ ... }}` objects in `useMemo` when the Provider re-renders often. | Pass a fresh inline object literal `value={{ a, b }}` if performance matters. |
| Split unrelated concerns into separate Contexts (`AuthContext`, `ThemeContext`). | Dump all app state into one giant `AppContext`. |
| Wrap `useContext` in a custom hook (`useAuth()`) with a missing-Provider check. | Import and call `useContext(RawContext)` everywhere without a guard. |
| Separate `StateContext` and `DispatchContext` for `useReducer` stores. | Force action-only buttons to re-render on every state update. |

---

### Common Errors & Fixes

| Error / Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `useContext(...)` returns `undefined` or `null` | Component is rendered outside `<MyContext.Provider>` (or at the same level as the Provider). | Move `<MyContext.Provider>` higher in the tree so it wraps all consumers. |
| `Cannot destructure property 'user' of 'useContext(...)' as it is null` | Missing Provider fell back to `createContext(null)`. | Wrap the component in `<Provider>` or use a custom hook that throws a clear error. |
| Consumers re-render on every parent render | Passing a new object/array literal `value={{ a, b }}` every render. | Memoize `value` with `useMemo` (and callbacks with `useCallback`). |
| `TypeError: useContext(...) is not a function` | Passed `MyContext.Provider` or `MyContext.Consumer` into `useContext()`. | Pass the context object itself: `useContext(MyContext)`. |
