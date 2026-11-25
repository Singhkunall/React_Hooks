# ⚡ useEffect Cheat Sheet

> One-page reference. Keep this open while coding.

---

## Syntax at a Glance

```jsx
useEffect(
  () => {
    // 👈 Side-effect code runs here (after render)

    return () => {
      // 👈 Optional cleanup — runs before next effect OR on unmount
    };
  },
  [dep1, dep2]  // 👈 Dependency array controls WHEN this runs
);
```

| Dependency Array | When Effect Runs |
|---|---|
| *(omitted)* | After **every** render |
| `[]` | Only after the **first** render (mount) |
| `[a, b]` | After mount + whenever `a` or `b` **changes** |

---

## 5 Quick Patterns

### 1. Run once on mount (like componentDidMount)

```jsx
useEffect(() => {
  // Runs once when component appears on screen
  console.log("Mounted!");

  return () => {
    // Runs once when component disappears (unmounts)
    console.log("Unmounted!");
  };
}, []); // ← empty array = once only
```

---

### 2. React to a prop or state change

```jsx
useEffect(() => {
  // Runs after mount AND after any render where `userId` changed
  fetchUser(userId);
}, [userId]); // ← re-runs when userId changes
```

---

### 3. Set up and clean up a timer

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setSeconds(s => s + 1); // ✅ functional update — no stale closure
  }, 1000);

  return () => clearInterval(id); // ✅ cleanup prevents memory leak
}, []);
```

---

### 4. Add and remove an event listener

```jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") closeModal();
  };

  document.addEventListener("keydown", handleKeyDown); // Add

  return () => {
    document.removeEventListener("keydown", handleKeyDown); // Remove
  };
}, [closeModal]); // include anything from scope used inside
```

---

### 5. Fetch data (with race-condition guard)

```jsx
useEffect(() => {
  let cancelled = false; // ← guard against stale updates

  const load = async () => {
    const data = await fetchData(id);
    if (!cancelled) setData(data); // ← only update if still mounted
  };

  load();

  return () => { cancelled = true; }; // ← cancel on cleanup
}, [id]);
```

---

## ✅ Do's and ❌ Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Return a cleanup function when you start a timer, subscription, or event listener | Forget cleanup — it causes memory leaks and stale callbacks |
| Use the functional update form `setState(prev => ...)` inside intervals | Read state directly inside a timer (`setState(count + 1)`) — stale closure! |
| List every variable from your component scope that the effect uses in the deps array | Lie about dependencies (omitting values) to suppress warnings |
| Define async functions *inside* the effect and call them | Pass an `async` function directly as the effect (`useEffect(async () => …)`) |
| Put user-action code in event handlers, not effects | Reach for `useEffect` when an event handler would be simpler and clearer |
| Use `[]` for one-time setup (mount only) | Use no array when you only mean "run once" — omitting deps means every render |
| Install and trust `eslint-plugin-react-hooks` to catch dependency mistakes | Disable the `exhaustive-deps` ESLint rule without understanding why |
| Use the cancellation pattern (`let cancelled = false`) when fetching | Update state after a component unmounts (causes React warnings) |
| Split separate concerns into separate `useEffect` calls | Cram unrelated logic into one `useEffect` — keep concerns separate |

---

## Common Errors & Fixes

| Error / Symptom | Likely Cause | Fix |
|---|---|---|
| **Infinite re-render loop** | An object/array dependency is recreated each render | Memoize with `useMemo`/`useCallback`, or move it outside the component |
| **"Can't perform a state update on unmounted component"** | Async callback updates state after unmount | Use the `cancelled` flag pattern in cleanup |
| **Stale state inside timer** | Closed over state value never updates | Use functional state update: `setState(prev => prev + 1)` |
| **Effect runs but nothing happens** | Missing dependency — effect fires on stale values | Add all used variables to the dependency array |
| **Effect runs on EVERY render** | No dependency array, or dependencies include new objects each time | Add `[]` or stabilize object references with `useMemo` |
| **TypeScript error: effect returns a Promise** | Used `async` directly as effect | Wrap async logic in a named function inside the effect |
| **Event listener fires multiple times** | Added listener without cleanup, re-runs add duplicates | Always return `() => removeEventListener(...)` from effect |
| **Data from previous search shows briefly** | Race condition — fast user changes trigger effects in wrong order | Use cancellation flag and clear previous data at start of effect |

---

## Quick Mental Model

```
Render → Paint DOM → Run Effect
            ↑               |
            |         (on next render)
            |         Run Cleanup
            └───────────────┘
                 (loop)

On Unmount → Run Final Cleanup
```

---

*📖 Full guide: `README.md` · 💻 Examples: `example1-basics/`, `example2-realworld/`, `example3-advanced/`*
