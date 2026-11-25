# `useTransition` — 1-Page Cheatsheet

> **React 18+** · Marks state updates as **non-urgent (interruptible)** so urgent UI interactions (typing, clicks) stay instant.

---

## Syntax at a Glance

```jsx
import { useTransition } from 'react';

function SearchPage() {
  const [isPending, startTransition] = useTransition();
  // isPending: boolean — true while the transition render is running in background
  // startTransition: (scope: () => void) => void — wraps non-urgent state setters

  function handleUpdate(nextValue) {
    setUrgentInput(nextValue);          // 🔴 High priority: updates immediately
    startTransition(() => {             // 🟡 Low priority: interruptible background render
      setHeavyResults(filter(nextValue));
    });
  }
}
```

---

## 5 Quick Patterns

### 1. Split Urgent Input & Deferred List Filter
```jsx
setQuery(e.target.value);               // Instant keystroke feedback
startTransition(() => setResults(filterList(e.target.value))); // Deferred list render
```

### 2. Show Pending Spinner / Text
```jsx
{isPending && <span className="spinner">Updating...</span>}
```

### 3. Dim Stale Content While Rendering
```jsx
<div style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}>
  <ExpensiveView data={results} />
</div>
```

### 4. Instant Tab Highlight + Deferred Tab Content
```jsx
setActiveTab(tabId);                    // Highlight clicked tab right away
startTransition(() => setRenderedTab(tabId)); // Render heavy tab panel in background
```

### 5. Async Fetch Followed by Transition
```jsx
const data = await fetchItems(query);   // Await OUTSIDE startTransition
startTransition(() => setItems(data));  // Wrap ONLY the synchronous state setter
```

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
|---|---|
| Wrap **heavy, non-urgent** state updates (large lists, charts, tab panels). | Wrap **urgent** UI feedback (controlled `<input>` values, active button states). |
| Keep the `startTransition` callback **100% synchronous**. | Put `async` / `await` or `setTimeout` directly inside `startTransition(...)`. |
| Use `isPending` to show subtle loading states or dim stale UI. | Expect `isPending` to track network/fetch time (it only tracks React renders). |
| Call `useTransition()` at the **top level** of a component or custom hook. | Call `useTransition()` inside loops, conditions, or plain helper functions. |
| Combine with `memo()` on heavy child panels for maximum responsiveness. | Wrap every trivial `setState` (like a simple counter) in `startTransition`. |

---

## Common Errors & Fixes

| Symptom / Error | Cause | Fix |
|---|---|---|
| Input cursor jumps or typing lags | Controlled `input` state was placed inside `startTransition` | Move `setInputValue(val)` **outside** `startTransition`; defer only derived/heavy state. |
| `isPending` flips to `false` immediately during fetch | `async` function passed to `startTransition` returns a Promise React can't track | `await` the fetch **first**, then call `startTransition(() => setData(result))`. |
| `Invalid hook call` runtime error | `useTransition()` called inside a helper, condition, or event handler | Move `const [isPending, startTransition] = useTransition()` to the component's top level. |
| UI still freezes despite `useTransition` | Expensive computation runs **outside** React or `setState` isn't what's slow | Ensure heavy child trees are memoized (`memo`) and only non-urgent setters run inside `startTransition`. |
| `useTransition is not a function` | Project is running React 17 or older | Upgrade `react` and `react-dom` to **18.0+** (or use debouncing as a fallback). |
