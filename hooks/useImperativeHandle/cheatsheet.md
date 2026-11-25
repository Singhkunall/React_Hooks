# `useImperativeHandle` Cheatsheet

---

## ⚡ Syntax at a Glance

```jsx
import { forwardRef, useImperativeHandle, useRef } from 'react';

const Child = forwardRef(function Child(props, ref) {
  const internalRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => internalRef.current?.focus(),
      clear: () => { if (internalRef.current) internalRef.current.value = ''; },
    }),
    [] // Optional dependency array
  );

  return <input ref={internalRef} />;
});
```
> *React 19+*: You can skip `forwardRef` and accept `ref` directly as a prop: `function Child({ ref })`.

---

## 🧩 5 Quick Patterns

### 1. Focus & Select Input
```jsx
useImperativeHandle(ref, () => ({
  focusAndSelect: () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  },
}), []);
```

### 2. Scroll Container to Bottom
```jsx
useImperativeHandle(ref, () => ({
  scrollToBottom: () => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });
  },
}), []);
```

### 3. Media Player Controls
```jsx
useImperativeHandle(ref, () => ({
  play: () => videoRef.current?.play(),
  pause: () => videoRef.current?.pause(),
}), []);
```

### 4. Imperative State Getter (with Dependencies)
```jsx
useImperativeHandle(ref, () => ({
  getCount: () => count,
}), [count]); // Include `count` to avoid stale closures!
```

### 5. Resetting Internal Child State
```jsx
useImperativeHandle(ref, () => ({
  reset: () => {
    setText('');
    setError(null);
  },
}), []);
```

---

## ✅ Do's and ❌ Don'ts

| ✅ Do | ❌ Don't |
| :--- | :--- |
| Expose a minimal object of specific methods (`{ focus, reset }`). | Return the entire raw DOM node (`() => inputRef.current`). |
| Use declarative props (`isOpen`, `value`) whenever possible. | Use `useImperativeHandle` for things props can easily handle. |
| Include any state/props read inside `createHandle` in the `deps` array. | Pass `[]` when your methods read changing state (causes stale closures). |
| Use optional chaining (`childRef.current?.focus()`) in the parent. | Assume `ref.current` is always non-null (it's `null` before mount / after unmount). |

---

## 🛠️ Common Errors & Fixes

| Error / Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `ref` is `undefined` inside child (React ≤18) | Forgot to wrap the child component with `forwardRef`. | Wrap child in `forwardRef(function Child(props, ref) { ... })`. |
| `TypeError: ref.current.myMethod is not a function` | `ref` wasn't passed, or `useImperativeHandle` hasn't run yet (e.g., called during render). | Call `ref.current?.myMethod()` only in event handlers or `useEffect`. |
| Method always returns initial state (e.g., `0` or `""`) | Stale closure due to missing dependency in `useImperativeHandle(..., deps)`. | Add the referenced state/prop to the dependency array `[stateVar]`. |
| Parent can't access DOM properties like `.style` | `useImperativeHandle` replaced the DOM node with your custom object. | This is intentional! Add a specific method to the handle if truly needed. |
