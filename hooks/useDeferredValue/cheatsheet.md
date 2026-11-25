# 🪝 useDeferredValue — Quick Cheatsheet

> Defer non-urgent UI updates so high-priority interactions (typing, clicking, dragging) stay instant.

---

## 📖 Syntax at a Glance

```jsx
import { useDeferredValue } from 'react';

// React 18+
const deferredValue = useDeferredValue(value);

// React 19+ (optional initialValue for the very first render)
const deferredValue = useDeferredValue(value, initialValue);
```

- **Input:** `value` (any primitive, object, or array).
- **Output:** `deferredValue` — lags behind `value` during rapid updates, then catches up when React is idle.
- **Stale check:** `const isStale = value !== deferredValue;`

---

## ⚡ 5 Quick Patterns

### 1. Responsive Search Input + Slow List
```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);

return (
  <>
    <input value={query} onChange={(e) => setQuery(e.target.value)} />
    <SlowList query={deferredQuery} />
  </>
);
```

### 2. Visual Stale Feedback (Dimming)
```jsx
const deferredQuery = useDeferredValue(query);
const isStale = query !== deferredQuery;

<div style={{ opacity: isStale ? 0.6 : 1, transition: 'opacity 0.15s' }}>
  <SlowList query={deferredQuery} />
</div>
```

### 3. Memoizing the Expensive Child (Required!)
```jsx
const SlowList = memo(function SlowList({ query }) {
  // Only re-renders when `deferredQuery` changes, not on every keystroke
  return <HeavyItems query={query} />;
});
```

### 4. Deferring Multiple Filter Values
```jsx
const deferredQuery = useDeferredValue(query);
const deferredCategory = useDeferredValue(category);
const isStale = query !== deferredQuery || category !== deferredCategory;
```

### 5. Keeping Old Suspense Content Visible
```jsx
const deferredQuery = useDeferredValue(committedQuery);

<Suspense fallback={<Spinner />}>
  {/* Shows previous results instead of <Spinner /> during updates */}
  <SearchResults query={deferredQuery} />
</Suspense>
```

---

## ✅ Do's and ❌ Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| ✅ Pass the **live** value to `<input value={query} />` | ❌ Pass `deferredValue` to `<input value={deferredQuery} />` (makes typing laggy) |
| ✅ Wrap expensive child components in `React.memo()` | ❌ Forget `memo()` — the child will still re-render on every keystroke |
| ✅ Defer primitive values (`string`, `number`, `boolean`) or memoized objects | ❌ Pass a fresh inline object `useDeferredValue({ query })` every render |
| ✅ Show subtle stale feedback (`opacity`, status text) via `value !== deferredValue` | ❌ Use `useDeferredValue` to debounce network requests (`fetch` on every render) |
| ✅ Pair with `Suspense` to avoid jarring loading spinner flashes | ❌ Expect `useDeferredValue` to fix slowness if the render itself blocks for seconds without yielding |

---

## 🐛 Common Errors & Fixes

| Symptom / Error | Cause | Fix |
|---|---|---|
| **Input feels laggy when typing** | `deferredValue` was passed to `<input value={...} />` instead of the live state | Bind `<input value={query} />` to live state and pass `deferredQuery` only to the heavy child |
| **No performance improvement at all** | Heavy child component is not wrapped in `memo()` | Wrap the heavy child in `const Heavy = memo(function Heavy({ query }) { ... })` |
| **Infinite re-render loop** | Passing a newly created object/array literal directly to `useDeferredValue({ a })` | Defer primitives directly, or memoize the object with `useMemo` before passing it |
| **Suspense flashes spinner on every update** | Passing live `query` instead of `deferredQuery` to the suspending child | Pass `deferredQuery` to the child inside `<Suspense>` so old UI stays visible |
| **UI never shows loading feedback** | Not comparing `value !== deferredValue` | Compute `const isStale = value !== deferredValue;` and dim or label the container |
