# useMemo Cheatsheet

## Syntax at a Glance

```jsx
import { useMemo } from "react";

const cachedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

- **First argument (`calculateValue`)**: Pure function with no arguments that returns the value to cache.
- **Second argument (`dependencies`)**: Array of reactive values (`props`, `state`, variables) used inside `calculateValue`.

---

## 5 Quick Patterns

### 1. Expensive Calculation
```jsx
const primeCount = useMemo(() => countPrimes(limit), [limit]);
```

### 2. Filtering & Sorting a List
```jsx
const visibleItems = useMemo(
  () => items.filter((item) => item.active).sort((a, b) => a.price - b.price),
  [items]
);
```

### 3. Stabilizing an Object Prop for `React.memo`
```jsx
const styleConfig = useMemo(() => ({ color, fontSize }), [color, fontSize]);
return <MemoizedChild styleConfig={styleConfig} />;
```

### 4. Stabilizing a `useEffect` Dependency
```jsx
const queryOptions = useMemo(() => ({ page, filter }), [page, filter]);
useEffect(() => {
  fetchResults(queryOptions);
}, [queryOptions]);
```

### 5. Derived Totals / Aggregations
```jsx
const cartTotal = useMemo(
  () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
  [cart]
);
```

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Use `useMemo` for genuinely slow calculations (e.g., >1ms) or large list transforms. | Wrap every single variable or trivial arithmetic (`a + b`) in `useMemo`. |
| Keep the `useMemo` callback **pure** (same inputs → same output, no side effects). | Perform API calls, `setState`, or DOM mutations inside `useMemo`. |
| Include **every** reactive value read inside the callback in the dependency array. | Omit dependencies to "trick" React into skipping recalculations. |
| Combine `useMemo` with `React.memo` when passing object/array props to heavy children. | Use `useMemo` for object props if the child is not wrapped in `React.memo`. |
| Measure performance with React DevTools Profiler before optimizing. | Rely on `useMemo` as a semantic guarantee (React may discard cache in future). |

---

## Common Errors & Fixes

| Error / Symptom | Cause | Fix |
| :--- | :--- | :--- |
| **Stale value returned** | A variable used inside `useMemo` is missing from `[deps]`. | Add all referenced `props`, `state`, and local values to the dependency array. |
| **Recalculates on every render** | A dependency is a new object/array/function created on every render. | Memoize that dependency too (`useMemo` / `useCallback`) or move constants outside the component. |
| **Infinite re-render loop** | Calling `setState` inside `useMemo` triggers a render, which re-runs `useMemo`. | Move state updates to event handlers or `useEffect`; keep `useMemo` pure. |
| **`React.memo` child still re-renders** | Passing an inline `{}` or `[]` prop without `useMemo`, or an un-memoized callback. | Wrap object/array props in `useMemo` and callback props in `useCallback`. |
| **Hook called conditionally error** | `useMemo` placed inside an `if`, loop, or after an early `return`. | Always call `useMemo` at the top level of your component before any returns. |
