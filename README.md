# React — A Comprehensive Guide

React is a declarative, component-based JavaScript library for building user interfaces. Created by Facebook (Meta) and released in 2013, it has grown to become the most widely used frontend library in the world. React lets you build complex UIs from small, isolated pieces of code called "components."

---

## Table of Contents

1. [What Is React?](#what-is-react)
2. [Core Concepts](#core-concepts)
3. [Getting Started](#getting-started)
4. [JSX — JavaScript XML](#jsx--javascript-xml)
5. [Components](#components)
6. [Props](#props)
7. [State and Lifecycle](#state-and-lifecycle)
8. [Hooks In-Depth](#hooks-in-depth)
9. [Event Handling](#event-handling)
10. [Conditional Rendering](#conditional-rendering)
11. [Lists and Keys](#lists-and-keys)
12. [Forms](#forms)
13. [Context API](#context-api)
14. [Refs and the DOM](#refs-and-the-dom)
15. [React 19 Features](#react-19-features)
16. [Routing with React Router](#routing-with-react-router)
17. [State Management](#state-management)
18. [Data Fetching](#data-fetching)
19. [Styling Approaches](#styling-approaches)
20. [Performance Optimization](#performance-optimization)
21. [Error Handling](#error-handling)
22. [Testing](#testing)
23. [TypeScript with React](#typescript-with-react)
24. [Accessibility](#accessibility)
25. [Project Structure](#project-structure)
26. [Build Tools and Deployment](#build-tools-and-deployment)
27. [Common Patterns](#common-patterns)
28. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## What Is React?

React is a JavaScript library for building user interfaces, primarily for single-page applications (SPAs). It was created by Jordan Walke at Facebook and first deployed on Facebook's News Feed in 2011, then open-sourced in 2013.

### Key Characteristics

- **Declarative**: You describe WHAT the UI should look like for any given state. React figures out HOW to update the DOM to match. You never manually manipulate DOM elements.
- **Component-Based**: UIs are built from self-contained, reusable components. Each component manages its own state and renders its own markup. Components compose together like building blocks.
- **Unidirectional Data Flow**: Data flows from parent to child via props. Children communicate to parents via callback functions. This one-way flow makes state changes predictable and easy to trace.
- **Virtual DOM**: React maintains an in-memory representation of the DOM. When state changes, React computes the minimal set of DOM operations needed and applies them in a batch. This makes updates efficient.
- **Learn Once, Write Anywhere**: React's component model can render to the web (ReactDOM), mobile (React Native), desktop, VR, and more.

### How React Works Under the Hood

1. **You write components** that return JSX describing the desired UI.
2. **React creates a virtual DOM tree** — a lightweight JavaScript object representation of the DOM.
3. **When state changes**, React creates a new virtual DOM tree.
4. **React diffs** the new tree against the previous tree using its reconciliation algorithm.
5. **React computes the minimal set** of actual DOM operations needed.
6. **React batches and applies** those DOM operations in a single pass.

This process is called **reconciliation** and is what makes React efficient — instead of re-rendering the entire page, it surgically updates only what changed.

---

## Core Concepts

### The Component Mental Model

Think of React components as JavaScript functions that:
1. Accept input (props)
2. Manage internal state (useState, useReducer)
3. Return UI description (JSX)

Every time props or state change, the function runs again, producing a new JSX description. React then efficiently updates the actual DOM to match.

### Rendering

"Rendering" in React means calling your component function. It does NOT mean updating the DOM. React renders (calls your function) and then decides what DOM updates are needed.

React renders a component when:
1. It's the initial mount
2. Its state changes (via `setState`)
3. Its parent re-renders (and passes new props or not — the component still re-runs)
4. Its context value changes

### Strict Mode

In development, React's `<StrictMode>` intentionally double-invokes certain functions (component body, useState initializer, useReducer reducer, useEffect setup) to help detect side effects. This only happens in development.

---

## Getting Started

### Creating a New React Project

The recommended way to start a new React project in 2026 is with **Vite**:

```bash
# Using npm
npm create vite@latest my-app -- --template react-ts

# Using pnpm
pnpm create vite my-app --template react-ts

# Using bun
bun create vite my-app --template react-ts
```

This creates a project with:
- React 19+
- TypeScript
- Vite (build tool)
- Hot Module Replacement (HMR)

### Project Files

```
my-app/
├── public/              # Static files served as-is
│   └── vite.svg
├── src/
│   ├── App.tsx          # Root component
│   ├── App.css          # Root component styles
│   ├── main.tsx         # Entry point — renders App into the DOM
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # Vite TypeScript declarations
├── index.html           # HTML shell — Vite's entry point
├── package.json
├── tsconfig.json        # TypeScript configuration
├── tsconfig.app.json    # App-specific TS config
├── tsconfig.node.json   # Node/tooling TS config
└── vite.config.ts       # Vite configuration
```

### Entry Point

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Running the Development Server

```bash
npm run dev      # Starts dev server at http://localhost:5173
npm run build    # Creates production build in dist/
npm run preview  # Preview the production build locally
```

---

## JSX — JavaScript XML

JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. It's not a string or HTML — it's syntactic sugar for `React.createElement()` calls.

### Basic JSX Rules

```tsx
// 1. Return a single root element (or use Fragment)
function App() {
  return (
    <div>
      <h1>Hello</h1>
      <p>World</p>
    </div>
  );
}

// Fragment — no extra DOM node
function App() {
  return (
    <>
      <h1>Hello</h1>
      <p>World</p>
    </>
  );
}

// 2. All tags must be closed
<img src="photo.jpg" alt="A photo" />    // Self-closing
<br />                                    // Self-closing
<div></div>                              // Explicit close

// 3. Use camelCase for attributes
<div className="container" tabIndex={0} onClick={handleClick}>
  <label htmlFor="name">Name</label>
  <input id="name" autoFocus />
</div>
```

### Embedding JavaScript in JSX

Use curly braces `{}` to embed any JavaScript expression:

```tsx
const name = 'Alice';
const items = ['Apple', 'Banana', 'Cherry'];

function Greeting() {
  return (
    <div>
      {/* Variables */}
      <h1>Hello, {name}!</h1>

      {/* Expressions */}
      <p>{2 + 2}</p>
      <p>{name.toUpperCase()}</p>

      {/* Ternary */}
      <p>{items.length > 0 ? `${items.length} items` : 'No items'}</p>

      {/* Function calls */}
      <p>{formatDate(new Date())}</p>

      {/* Object properties (double braces for inline styles) */}
      <div style={{ color: 'red', fontSize: '16px' }}>Styled text</div>
    </div>
  );
}
```

### What You CANNOT Do in JSX

```tsx
// NO statements (if, for, while) — use expressions instead
// NO: {if (condition) { ... }}
// YES: {condition ? <A /> : <B />}
// YES: {condition && <A />}

// NO: {for (let i...) { ... }}
// YES: {items.map(item => <li key={item.id}>{item.name}</li>)}
```

---

## Components

Components are the building blocks of a React application. Each component is a self-contained piece of UI that manages its own rendering and, optionally, its own state.

### Function Components

```tsx
// Basic component
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Component with props
function Greeting({ name, age }: { name: string; age: number }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Usage
function App() {
  return (
    <div>
      <Welcome />
      <Greeting name="Alice" age={30} />
      <Greeting name="Bob" age={25} />
    </div>
  );
}
```

### Component Composition

Components can contain other components, creating a tree structure:

```tsx
function App() {
  return (
    <Layout>
      <Header />
      <main>
        <Sidebar />
        <Content>
          <ArticleList />
        </Content>
      </main>
      <Footer />
    </Layout>
  );
}
```

### Component Organization Principles

1. **Single Responsibility**: Each component does one thing well.
2. **DRY (Don't Repeat Yourself)**: Extract repeated UI patterns into components.
3. **Smart vs Presentational**: Separate data-fetching/logic components from pure display components.
4. **Composition over Inheritance**: React uses composition (nesting, children, render props) — never inheritance.

---

## Props

Props (short for "properties") are the mechanism for passing data from parent components to child components. Props are read-only — a component must never modify its own props.

### Basic Props

```tsx
interface UserCardProps {
  name: string;
  email: string;
  isAdmin?: boolean;       // Optional prop
  role?: 'user' | 'admin'; // Union type
  onEdit?: () => void;     // Callback prop
}

function UserCard({ name, email, isAdmin = false, role = 'user', onEdit }: UserCardProps) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>{email}</p>
      {isAdmin && <span className="badge">Admin</span>}
      {onEdit && <button onClick={onEdit}>Edit</button>}
    </div>
  );
}
```

### Children Prop

The `children` prop contains whatever JSX is placed between a component's opening and closing tags:

```tsx
interface CardProps {
  children: React.ReactNode;
  title?: string;
}

function Card({ children, title }: CardProps) {
  return (
    <div className="card">
      {title && <h2>{title}</h2>}
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage
<Card title="User Info">
  <p>Name: Alice</p>
  <p>Email: alice@example.com</p>
</Card>
```

### Spreading Props

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return <button className={`btn btn-${variant} ${className ?? ''}`} {...rest} />;
}

// All standard button attributes are forwarded
<Button variant="primary" onClick={handleClick} disabled={isLoading} aria-label="Submit form">
  Submit
</Button>
```

---

## State and Lifecycle

State is data that changes over time within a component. When state changes, React re-renders the component to reflect the new state.

### useState

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Key Rules of State

1. **State is immutable** — never mutate state directly. Always use the setter function.
2. **State updates are asynchronous** — React batches multiple setState calls for performance.
3. **Use functional updates** when the new state depends on the previous state: `setCount(prev => prev + 1)`.
4. **State is local and private** — no other component can access or modify a component's state.

### Object and Array State

```tsx
// Object state — always spread to create new object
const [user, setUser] = useState({ name: 'Alice', age: 30 });
setUser(prev => ({ ...prev, name: 'Bob' })); // CORRECT
// user.name = 'Bob'; // WRONG — mutation

// Array state — always create new array
const [items, setItems] = useState<string[]>([]);
setItems(prev => [...prev, 'new item']);              // Add
setItems(prev => prev.filter(item => item !== 'old'));  // Remove
setItems(prev => prev.map(item =>
  item === 'old' ? 'new' : item                       // Update
));
```

### Lazy Initialization

For expensive initial state computations, pass a function to `useState`:

```tsx
// This function only runs ONCE, on the first render
const [data, setData] = useState(() => {
  return JSON.parse(localStorage.getItem('data') ?? '{}');
});
```

### useReducer — Complex State Logic

```tsx
import { useReducer } from 'react';

interface State {
  count: number;
  step: number;
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + state.step };
    case 'decrement': return { ...state, count: state.count - state.step };
    case 'setStep':   return { ...state, step: action.payload };
    case 'reset':     return { count: 0, step: 1 };
    default:          return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+{state.step}</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-{state.step}</button>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
      />
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

---

## Hooks In-Depth

Hooks are functions that let you "hook into" React's state and lifecycle features from function components. Introduced in React 16.8, they are now the primary way to use React features.

### useState

Covered in [State and Lifecycle](#state-and-lifecycle).

### useEffect

Performs side effects: data fetching, subscriptions, DOM manipulation, timers.

```tsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Setup: runs after every render where `userId` changed
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });

    // Cleanup: runs before next effect and on unmount
    return () => controller.abort();
  }, [userId]); // Dependency array — only re-run when userId changes

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

**Dependency Array Behavior:**
- `useEffect(() => {...})` — runs after EVERY render (rarely what you want).
- `useEffect(() => {...}, [])` — runs ONCE after initial mount (like componentDidMount).
- `useEffect(() => {...}, [a, b])` — runs when `a` or `b` change.

### useMemo

Caches the result of an expensive computation:

```tsx
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items] // Only recompute when items changes
);
```

### useCallback

Caches a function reference:

```tsx
const handleDelete = useCallback(
  (id: string) => setItems(prev => prev.filter(item => item.id !== id)),
  [] // No dependencies — function never changes
);
```

### useRef

Holds a mutable value that persists across renders WITHOUT causing re-renders:

```tsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### useId

Generates unique IDs for accessibility attributes:

```tsx
function FormField({ label }: { label: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}
```

### useTransition

Marks state updates as non-urgent, keeping the UI responsive:

```tsx
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch(value: string) {
    setQuery(value); // Urgent — update input immediately
    startTransition(() => {
      setResults(filterItems(value)); // Non-urgent — can be interrupted
    });
  }

  return (
    <div>
      <input value={query} onChange={e => handleSearch(e.target.value)} />
      {isPending && <p>Searching...</p>}
      <ul>{results.map(item => <li key={item.id}>{item.name}</li>)}</ul>
    </div>
  );
}
```

### useDeferredValue

Defers updating a value, showing stale content while fresh content loads:

```tsx
function Search({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <SearchResults query={deferredQuery} />
    </div>
  );
}
```

---

## Event Handling

React wraps native DOM events in SyntheticEvent objects that work identically across browsers.

```tsx
function EventExamples() {
  // Click events
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log('Clicked at', event.clientX, event.clientY);
  }

  // Form events
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(Object.fromEntries(formData));
  }

  // Input events
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log('New value:', event.target.value);
  }

  // Keyboard events
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      console.log('Enter pressed');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} onKeyDown={handleKeyDown} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

### Passing Arguments to Event Handlers

```tsx
// Arrow function wrapper
<button onClick={() => handleDelete(item.id)}>Delete</button>

// Or bind (less common)
<button onClick={handleDelete.bind(null, item.id)}>Delete</button>
```

---

## Conditional Rendering

```tsx
function Dashboard({ user }: { user: User | null }) {
  // Early return
  if (!user) return <LoginPrompt />;

  return (
    <div>
      {/* Ternary — when you have both branches */}
      {user.isAdmin ? <AdminPanel /> : <UserPanel />}

      {/* Logical AND — when you only have the truthy branch */}
      {user.notifications.length > 0 && <NotificationBadge count={user.notifications.length} />}

      {/* Nullish/falsy guard — AVOID 0 rendering as text */}
      {user.notifications.length > 0 && <Badge count={user.notifications.length} />}
      {/* NOT: {user.notifications.length && <Badge />} — renders "0" */}

      {/* IIFE or variable for complex logic */}
      {(() => {
        switch (user.role) {
          case 'admin': return <AdminView />;
          case 'editor': return <EditorView />;
          default: return <UserView />;
        }
      })()}
    </div>
  );
}
```

---

## Lists and Keys

```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

### Key Rules

1. **Keys must be unique among siblings** — they identify which item is which during re-renders.
2. **Use stable, unique IDs** — database IDs, UUIDs, or other persistent identifiers.
3. **Never use array index as key** for dynamic lists that can be reordered, filtered, or modified. Index keys cause bugs with component state and animations.
4. **Keys are not passed as props** — they're consumed by React internally. If you need the ID in the child, pass it as a separate prop.

```tsx
// GOOD — stable ID
{items.map(item => <Item key={item.id} item={item} />)}

// BAD — index (only OK for static, never-changing lists)
{items.map((item, index) => <Item key={index} item={item} />)}

// BAD — random values (creates new key every render, destroying component state)
{items.map(item => <Item key={Math.random()} item={item} />)}
```

---

## Forms

### Controlled Components

The component controls the input's value through state:

```tsx
function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Submitting:', formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" value={formData.name} onChange={handleChange} />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />

      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" value={formData.message} onChange={handleChange} />

      <button type="submit">Send</button>
    </form>
  );
}
```

### Uncontrolled Components with FormData (Simpler)

```tsx
function SimpleForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue="" />
      <input name="email" type="email" defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### React 19 Form Actions

```tsx
function LoginForm() {
  const [state, submitAction, isPending] = useActionState(
    async (_prevState: { error: string | null }, formData: FormData) => {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      try {
        await login(email, password);
        return { error: null };
      } catch (err) {
        return { error: 'Invalid credentials' };
      }
    },
    { error: null }
  );

  return (
    <form action={submitAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      {state.error && <p className="error">{state.error}</p>}
      <button disabled={isPending}>{isPending ? 'Logging in...' : 'Log in'}</button>
    </form>
  );
}
```

---

## Context API

Context provides a way to pass data through the component tree without manually passing props at every level ("prop drilling").

### Creating and Using Context

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Define the context shape
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// 2. Create context with null default
const ThemeContext = createContext<ThemeContextValue | null>(null);

// 3. Create a custom hook for consuming (with safety check)
function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 4. Create the provider component
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 5. Use in components
function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}

// 6. Wrap your app
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}
```

### When to Use Context

- **Theme** (light/dark mode)
- **Authentication** (current user, login/logout)
- **Locale/i18n** (language, translations)
- **Feature flags**

### When NOT to Use Context

- **Frequently changing data** (e.g., mouse position, scroll offset) — causes re-renders of all consumers.
- **Large application state** — use a dedicated state management library (Zustand, Jotai) instead.
- **Data only needed 1-2 levels deep** — just pass props directly.

---

## Refs and the DOM

Refs provide a way to access DOM elements directly and persist mutable values across renders without causing re-renders.

```tsx
import { useRef, useEffect } from 'react';

function AutoFocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="I focus on mount" />;
}

function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function play() { videoRef.current?.play(); }
  function pause() { videoRef.current?.pause(); }

  return (
    <div>
      <video ref={videoRef} src={src} />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </div>
  );
}
```

### Refs as Instance Variables

```tsx
function StopWatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // These values persist across renders but don't trigger re-renders when changed
  function start() {
    startTimeRef.current = Date.now() - time;
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  return (
    <div>
      <p>{(time / 1000).toFixed(2)}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

---

## React 19 Features

React 19 (released December 2024) introduced several major features:

### Server Components

Components that run on the server and send rendered HTML to the client. They can directly access databases, file systems, and other server resources without API endpoints.

```tsx
// This component runs ONLY on the server
async function BlogPost({ slug }: { slug: string }) {
  const post = await db.posts.findBySlug(slug); // Direct DB access
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
    </article>
  );
}
```

### The `use()` Hook

Reads the value of a resource (Promise or Context) during render:

```tsx
import { use, Suspense } from 'react';

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // Suspends until resolved
  return <h1>{user.name}</h1>;
}

// Must be wrapped in Suspense
<Suspense fallback={<Skeleton />}>
  <UserProfile userPromise={fetchUser(id)} />
</Suspense>
```

### Actions and useActionState

Simplify form handling with async server-side logic:

```tsx
import { useActionState } from 'react';

function CreatePostForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: { message: string }, formData: FormData) => {
      const title = formData.get('title') as string;
      await createPost({ title });
      return { message: 'Post created!' };
    },
    { message: '' }
  );

  return (
    <form action={formAction}>
      <input name="title" required />
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

### useOptimistic

For optimistic UI updates:

```tsx
import { useOptimistic } from 'react';

function MessageList({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, { ...newMessage, sending: true }]
  );

  async function sendMessage(formData: FormData) {
    const text = formData.get('text') as string;
    const newMsg = { id: crypto.randomUUID(), text, sending: false };
    addOptimistic(newMsg);
    await postMessage(newMsg);
  }

  return (
    <div>
      {optimisticMessages.map(msg => (
        <p key={msg.id} style={{ opacity: msg.sending ? 0.5 : 1 }}>{msg.text}</p>
      ))}
      <form action={sendMessage}>
        <input name="text" />
        <button>Send</button>
      </form>
    </div>
  );
}
```

### Document Metadata

React 19 natively supports `<title>`, `<meta>`, and `<link>` in components:

```tsx
function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <title>{post.title} | My Blog</title>
      <meta name="description" content={post.excerpt} />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### ref as a Prop

No more `forwardRef` — `ref` is now a regular prop:

```tsx
function Input({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <input ref={ref} {...props} />;
}

// Usage
const inputRef = useRef<HTMLInputElement>(null);
<Input ref={inputRef} placeholder="Type here" />
```

---

## Routing with React Router

React Router v7 is the standard routing solution for React SPAs.

### Setup

```tsx
import { BrowserRouter, Routes, Route, Link, NavLink, Outlet, Navigate } from 'react-router';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="blog" element={<BlogLayout />}>
            <Route index element={<BlogListPage />} />
            <Route path=":slug" element={<BlogPostPage />} />
          </Route>
          <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div>
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/blog">Blog</NavLink>
      </nav>
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}
```

### Route Parameters and Navigation

```tsx
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router';

function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  return (
    <div>
      <h1>Post: {slug}</h1>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <button onClick={() => navigate('/blog')}>All Posts</button>
    </div>
  );
}
```

### Protected Routes

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

---

## State Management

### When to Use What

| Scope | Tool | Use Case |
|---|---|---|
| Component-local | `useState` / `useReducer` | Form inputs, toggles, local UI state |
| Subtree-shared | `useContext` | Theme, auth, locale |
| Global client state | Zustand / Jotai | Shopping cart, app settings, UI preferences |
| Server state | TanStack Query | API data, caching, pagination, real-time sync |
| URL state | React Router | Current page, search filters, pagination |
| Form state | React Hook Form / Formik | Complex multi-step forms with validation |

### Zustand Example

```tsx
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set(state => ({ items: [...state.items, item] })),
  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
  totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));

// Usage in components
function CartIcon() {
  const itemCount = useCartStore(state => state.items.length);
  return <span className="badge">{itemCount}</span>;
}
```

---

## Data Fetching

### TanStack Query (Recommended)

```tsx
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // Data is fresh for 5 minutes
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

// Fetching data
function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ul>
      {users.map((user: User) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Mutating data
function DeleteUserButton({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => fetch(`/api/users/${userId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <button onClick={() => mutate()} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

## Styling Approaches

### Tailwind CSS

The most popular approach in 2026. Utility-first CSS framework:

```tsx
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="text-gray-600">{children}</div>
    </div>
  );
}
```

### CSS Modules

Scoped CSS with zero runtime overhead:

```tsx
// Button.module.css
// .button { padding: 8px 16px; border-radius: 4px; }
// .primary { background: blue; color: white; }

import styles from './Button.module.css';

function Button({ variant = 'primary' }: { variant?: string }) {
  return <button className={`${styles.button} ${styles[variant]}`}>Click</button>;
}
```

### Inline Styles (Rare — for truly dynamic values)

```tsx
<div style={{ transform: `translateX(${position}px)`, opacity: isVisible ? 1 : 0 }}>
  Content
</div>
```

---

## Performance Optimization

### Key Strategies

1. **Code splitting** — `React.lazy()` + `<Suspense>` for route-based splitting.
2. **Memoization** — `React.memo`, `useMemo`, `useCallback` (or let the React Compiler handle it).
3. **Virtualization** — `@tanstack/react-virtual` for long lists.
4. **Debouncing** — Debounce expensive operations triggered by rapid user input.
5. **Image optimization** — Lazy-load images, use modern formats (WebP, AVIF), serve correct sizes.
6. **Bundle analysis** — Use `rollup-plugin-visualizer` to identify large dependencies.

### React DevTools Profiler

Use the React DevTools Profiler to:
- Identify slow components
- See render counts and durations
- Find unnecessary re-renders
- Trace what triggered a render

---

## Error Handling

### Error Boundaries

Class-based components that catch rendering errors in their child tree:

```tsx
class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error boundary caught:', error, info);
    // Report to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <MyComponent />
</ErrorBoundary>
```

### Error Boundaries Don't Catch

- Event handler errors (use try/catch)
- Async errors (use try/catch in async functions)
- Server-side rendering errors
- Errors in the error boundary itself

---

## Testing

### Vitest + React Testing Library

```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick handler', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when isLoading', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Testing Hooks

```tsx
import { renderHook, act } from '@testing-library/react';

it('useCounter increments', () => {
  const { result } = renderHook(() => useCounter(0));
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

### E2E Testing with Playwright

```tsx
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'user@example.com');
  await page.fill('[name=password]', 'password123');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

---

## TypeScript with React

### Essential Type Patterns

```tsx
// ReactNode — anything renderable
children: React.ReactNode;

// ReactElement — JSX element specifically
element: React.ReactElement;

// Component type as prop
icon: React.ComponentType<{ size?: number }>;

// Event handlers
onClick: React.MouseEventHandler<HTMLButtonElement>;
onChange: React.ChangeEventHandler<HTMLInputElement>;

// Style prop
style: React.CSSProperties;

// HTML attributes pass-through
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type DivProps = React.HTMLAttributes<HTMLDivElement>;
```

---

## Accessibility

### Core Principles

1. Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`, `<section>`)
2. All inputs have labels
3. All images have alt text
4. Keyboard navigation works throughout
5. Focus is managed properly (especially modals, dropdowns)
6. Color contrast meets WCAG AA (4.5:1 for text)
7. Dynamic content announces changes via `aria-live`

### Tools

- **eslint-plugin-jsx-a11y** — Catches accessibility issues in JSX
- **React DevTools** — Inspect component tree and props
- **axe DevTools** — Browser extension for accessibility auditing
- **Lighthouse** — Built into Chrome DevTools

---

## Project Structure

```
src/
├── assets/              # Images, fonts, SVGs
├── components/
│   ├── ui/              # Button, Input, Modal, Card, Badge, Tooltip
│   ├── layout/          # Header, Footer, Sidebar, PageWrapper
│   └── features/        # Feature-grouped components
│       ├── auth/
│       ├── dashboard/
│       └── settings/
├── hooks/               # Custom hooks
├── contexts/            # Context providers
├── lib/                 # Utilities, API client, validators
├── pages/               # Route-level page components
├── routes/              # Route configuration
├── stores/              # Global state (Zustand)
├── types/               # Shared TypeScript types
├── styles/              # Global CSS
├── App.tsx
└── main.tsx
```

---

## Build Tools and Deployment

### Vite

Vite is the recommended build tool for React in 2026:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
```

### Deployment Options

- **Vercel** — Zero-config React deployment
- **Netlify** — Static site hosting with serverless functions
- **Cloudflare Pages** — Edge deployment
- **AWS S3 + CloudFront** — Static hosting with CDN
- **Docker + Nginx** — Self-hosted

### Production Build

```bash
npm run build    # Output in dist/
npm run preview  # Preview locally
```

---

## Common Patterns

### Container/Presentational Pattern

```tsx
// Container — handles data and logic
function UserListContainer() {
  const { data: users, isLoading } = useUsers();
  if (isLoading) return <Skeleton />;
  return <UserList users={users} />;
}

// Presentational — handles display only
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </ul>
  );
}
```

### Custom Hook Pattern

Extract reusable logic into hooks:

```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### Compound Components

```tsx
function Tabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="tabs-list" role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ index, children }: { index: number; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button role="tab" aria-selected={activeTab === index} onClick={() => setActiveTab(index)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ index, children }: { index: number; children: React.ReactNode }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== index) return null;
  return <div role="tabpanel">{children}</div>;
};
```

---

## Anti-Patterns to Avoid

1. **Prop drilling** — Pass data through 5+ component layers. Use Context or state management instead.
2. **God components** — Single component that does everything. Split into smaller, focused components.
3. **Derived state in useEffect** — `useEffect(() => { setB(a * 2) }, [a])`. Compute `b` during render instead.
4. **Not cleaning up effects** — Memory leaks from subscriptions, timers, and listeners.
5. **Mutating state** — `state.items.push(newItem)`. Always create new references.
6. **Using index as key in dynamic lists** — Causes state bugs and broken animations.
7. **Overusing Context for high-frequency updates** — Causes unnecessary re-renders. Use Zustand/Jotai.
8. **Fetching in useEffect without cancellation** — Race conditions. Use AbortController or TanStack Query.
9. **Too many useState calls** — More than 3-4 related pieces of state belong in `useReducer`.
10. **Ignoring TypeScript strictness** — Don't use `any`. Don't use `as` to bypass type checking.

---

## Further Resources

- [React Documentation](https://react.dev) — Official docs
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) — TypeScript patterns
- [TanStack Query](https://tanstack.com/query) — Server state management
- [Zustand](https://zustand-demo.pmnd.rs/) — Client state management
- [React Router](https://reactrouter.com/) — Routing
- [Vitest](https://vitest.dev/) — Testing framework
- [Playwright](https://playwright.dev/) — E2E testing
