# CLAUDE.md — React Project Best Practices

This document provides comprehensive guidance for AI assistants (and developers) working within a React codebase. Follow these conventions to produce idiomatic, performant, and maintainable React code.

---

## Project Overview

This is a React application built with modern tooling (Vite, TypeScript, React 19+). It follows component-driven architecture with a strong emphasis on composition, type safety, and accessibility.

---

## Technology Stack

- **Framework**: React 19+
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Package Manager**: pnpm (preferred) or npm
- **Styling**: Tailwind CSS / CSS Modules
- **State Management**: React built-in (useState, useReducer, Context) + Zustand for global state
- **Routing**: React Router v7+
- **Testing**: Vitest + React Testing Library + Playwright
- **Linting**: ESLint with eslint-plugin-react, eslint-plugin-react-hooks
- **Formatting**: Prettier

---

## Project Structure

```
src/
├── assets/                  # Static assets (images, fonts, SVGs)
├── components/              # Reusable UI components
│   ├── ui/                  # Primitive/generic components (Button, Input, Modal, Card)
│   ├── layout/              # Layout components (Header, Footer, Sidebar, PageWrapper)
│   └── features/            # Feature-specific components grouped by domain
│       ├── auth/
│       ├── dashboard/
│       └── settings/
├── hooks/                   # Custom React hooks
├── contexts/                # React Context providers and definitions
├── lib/                     # Utility functions, constants, and helpers
│   ├── utils.ts
│   ├── constants.ts
│   ├── api.ts               # API client configuration and helpers
│   └── validators.ts
├── pages/                   # Top-level route page components
│   ├── HomePage.tsx
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
├── routes/                  # Route definitions and configuration
│   └── index.tsx
├── stores/                  # Global state stores (Zustand)
├── types/                   # Shared TypeScript type definitions
│   ├── api.ts
│   ├── user.ts
│   └── global.d.ts
├── styles/                  # Global styles, Tailwind config, CSS variables
│   └── globals.css
├── App.tsx                  # Root application component
├── main.tsx                 # Application entry point
└── vite-env.d.ts            # Vite type declarations
```

---

## Naming Conventions

### Files and Directories

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserProfile.tsx`, `DataTable.tsx` |
| Hooks | camelCase, prefixed with `use` | `useAuth.ts`, `useDebounce.ts` |
| Utilities | camelCase | `formatDate.ts`, `cn.ts` |
| Types | camelCase | `user.ts`, `api.ts` |
| Constants | camelCase file, UPPER_SNAKE_CASE exports | `constants.ts` → `export const API_BASE_URL` |
| Pages | PascalCase, suffixed with `Page` | `DashboardPage.tsx`, `SettingsPage.tsx` |
| Contexts | PascalCase, suffixed with `Context` / `Provider` | `AuthContext.tsx`, `ThemeProvider.tsx` |
| Test files | Same name as source, `.test.tsx` suffix | `Button.test.tsx` |
| Style files | Same name as component, `.module.css` suffix | `Button.module.css` |
| Directories | kebab-case or lowercase | `components/`, `auth/`, `user-settings/` |

### Variables and Functions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `function UserCard() {}` |
| Hooks | camelCase, `use` prefix | `function useLocalStorage() {}` |
| Event handlers | camelCase, `handle` prefix | `handleClick`, `handleSubmit`, `handleInputChange` |
| Callback props | camelCase, `on` prefix | `onClick`, `onSubmit`, `onChange` |
| Boolean variables | `is`, `has`, `can`, `should` prefix | `isLoading`, `hasError`, `canEdit` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `DEFAULT_PAGE_SIZE` |
| Types/Interfaces | PascalCase | `interface UserProfile {}`, `type ButtonVariant` |
| Generics | Single uppercase letter or descriptive PascalCase | `T`, `TItem`, `TResponse` |
| Enums | PascalCase name, PascalCase members | `enum Status { Active, Inactive }` |

---

## Component Patterns

### Functional Components Only

Always use function declarations (not arrow functions) for components. Never use class components.

```tsx
// GOOD
function UserCard({ name, email }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}

// AVOID — arrow function components
const UserCard = ({ name, email }: UserCardProps) => { ... };

// NEVER — class components
class UserCard extends React.Component { ... }
```

### Props Interface Pattern

Define props as an interface directly above the component. Name it `{ComponentName}Props`.

```tsx
interface UserCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  isActive?: boolean;
  onSelect?: (id: string) => void;
  children?: React.ReactNode;
}

function UserCard({ name, email, avatarUrl, isActive = true, onSelect, children }: UserCardProps) {
  // ...
}
```

### Composition Over Configuration

Prefer composable components with `children` over monolithic components with many props.

```tsx
// GOOD — composable
<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
    <CardDescription>Manage your preferences</CardDescription>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>

// AVOID — monolithic
<Card
  title="Settings"
  description="Manage your preferences"
  content={<div>...</div>}
  footer={<div>...</div>}
/>
```

### Render Props and Children as Function

Use when components need to share internal state or logic with their children.

```tsx
function Toggle({ children }: { children: (props: { on: boolean; toggle: () => void }) => React.ReactNode }) {
  const [on, setOn] = useState(false);
  return <>{children({ on, toggle: () => setOn(prev => !prev) })}</>;
}
```

### Forwarding Refs

Use `React.forwardRef` (or the new React 19 `ref` as prop pattern) for components that wrap native DOM elements.

```tsx
// React 19+ — ref as a regular prop
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
}

function Input({ label, ref, ...props }: InputProps) {
  return (
    <label>
      {label}
      <input ref={ref} {...props} />
    </label>
  );
}
```

---

## Hooks Best Practices

### Rules of Hooks

1. Only call hooks at the top level of a component or custom hook — never inside loops, conditions, or nested functions.
2. Only call hooks from React function components or custom hooks — never from regular JavaScript functions.

### State Management Hierarchy

Choose the simplest tool that fits the need:

1. **`useState`** — Simple, local, independent state values.
2. **`useReducer`** — Complex state with multiple sub-values or when next state depends on previous.
3. **`useContext`** — State that needs to be shared across a subtree (theme, auth, locale).
4. **Zustand / Jotai** — True global state that multiple unrelated components need.
5. **React Query / TanStack Query** — Server state (API data, caching, synchronization).

### useState

```tsx
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// Always use functional updates when new state depends on previous state
setCount(prev => prev + 1);
setUser(prev => prev ? { ...prev, name: 'New Name' } : null);
```

### useEffect

```tsx
// Always specify dependencies explicitly — never omit the dependency array
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const response = await fetch(`/api/users/${id}`, { signal: controller.signal });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setError(error);
    }
  }

  fetchData();

  // Always clean up subscriptions, timers, and listeners
  return () => controller.abort();
}, [id]);
```

### When NOT to Use useEffect

- **Deriving state from props or other state** — compute during render instead.
- **Handling user events** — use event handlers.
- **Transforming data for display** — use `useMemo`.
- **Resetting state when a prop changes** — use a `key` on the component instead.

```tsx
// BAD — effect to derive state
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// GOOD — compute during render
const fullName = `${firstName} ${lastName}`;

// GOOD — useMemo for expensive computation
const sortedItems = useMemo(() =>
  [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);
```

### Custom Hooks

Extract reusable logic into custom hooks. A custom hook should do ONE thing well.

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}
```

---

## React 19 Features

### `use()` Hook

Read resources (promises, context) during render.

```tsx
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}
```

### Actions and `useActionState`

For form submissions with pending states and optimistic updates.

```tsx
function LoginForm() {
  const [state, submitAction, isPending] = useActionState(
    async (previousState: FormState, formData: FormData) => {
      const result = await login(formData.get('email'), formData.get('password'));
      if (result.error) return { error: result.error };
      redirect('/dashboard');
    },
    { error: null }
  );

  return (
    <form action={submitAction}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      {state.error && <p className="error">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}
```

### `useOptimisticState`

For optimistic UI updates.

```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, { ...newTodo, pending: true }]
  );

  async function addTodo(formData: FormData) {
    const newTodo = { id: crypto.randomUUID(), text: formData.get('text') as string };
    addOptimistic(newTodo);
    await saveTodo(newTodo);
  }

  return (
    <form action={addTodo}>
      <input name="text" />
      <button type="submit">Add</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>{todo.text}</li>
        ))}
      </ul>
    </form>
  );
}
```

---

## TypeScript Patterns

### Typing Component Props

```tsx
// Basic props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Extending HTML element props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

// Polymorphic component props
interface BoxProps<T extends React.ElementType> {
  as?: T;
  children: React.ReactNode;
}
type BoxPropsWithRef<T extends React.ElementType> = BoxProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof BoxProps<T>>;
```

### Typing Hooks

```tsx
// Typed useState
const [user, setUser] = useState<User | null>(null);

// Typed useRef
const inputRef = useRef<HTMLInputElement>(null);
const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

// Typed context
interface AuthContextValue {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | null>(null);

function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### Typing Event Handlers

```tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  setValue(event.target.value);
}

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  // ...
}

function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
  if (event.key === 'Enter') submit();
}
```

### Generic Components

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}
```

---

## Performance Optimization

### Memoization

```tsx
// React.memo — prevent re-renders when props haven't changed
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
});

// useMemo — cache expensive computations
const filteredItems = useMemo(
  () => items.filter(item => item.category === selectedCategory),
  [items, selectedCategory]
);

// useCallback — stabilize function references for child components
const handleDelete = useCallback((id: string) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []);
```

### When to Memoize

- **DO** memoize when passing callbacks/objects to `React.memo` wrapped children.
- **DO** memoize expensive computations (sorting, filtering large lists).
- **DO NOT** memoize everything — the overhead of memoization can be worse than re-rendering.
- **DO NOT** memoize primitive props or simple inline callbacks.

### React Compiler (React 19+)

The React Compiler automatically memoizes components and hooks. When using the compiler:
- Remove manual `useMemo`, `useCallback`, and `React.memo` — the compiler handles it.
- Write straightforward code; the compiler optimizes it.

### Code Splitting

```tsx
import { lazy, Suspense } from 'react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}
```

### List Rendering

```tsx
// ALWAYS provide stable, unique keys — never use array index for dynamic lists
{items.map(item => (
  <ListItem key={item.id} data={item} />
))}

// Index keys are ONLY acceptable for static, never-reordered lists
{menuItems.map((label, index) => (
  <MenuItem key={index}>{label}</MenuItem>
))}
```

### Virtualization

For rendering long lists (1000+ items), use windowing/virtualization:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ overflow: 'auto', height: '500px' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualItem.start}px)`,
              height: `${virtualItem.size}px`,
            }}
          >
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Error Handling

### Error Boundaries

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error boundary caught:', error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback } = this.props;
      if (typeof fallback === 'function') {
        return fallback(this.state.error, this.reset);
      }
      return fallback;
    }
    return this.props.children;
  }
}
```

### Async Error Handling

```tsx
function useAsync<T>(asyncFn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<{
    data: T | null;
    error: Error | null;
    isLoading: boolean;
  }>({ data: null, error: null, isLoading: true });

  useEffect(() => {
    let cancelled = false;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    asyncFn()
      .then(data => { if (!cancelled) setState({ data, error: null, isLoading: false }); })
      .catch(error => { if (!cancelled) setState({ data: null, error, isLoading: false }); });

    return () => { cancelled = true; };
  }, deps);

  return state;
}
```

---

## Accessibility

### Semantic HTML First

Always use the correct HTML element before reaching for ARIA attributes.

```tsx
// GOOD — native button
<button onClick={handleClick}>Submit</button>

// BAD — div pretending to be a button
<div role="button" tabIndex={0} onClick={handleClick} onKeyDown={handleKeyDown}>Submit</div>
```

### Key Accessibility Rules

1. **All interactive elements must be keyboard accessible.** Buttons, links, and form controls are keyboard-accessible by default. Only add `tabIndex` and keyboard handlers when using non-interactive elements (which should be rare).
2. **All images must have `alt` text.** Decorative images use `alt=""`.
3. **Form inputs must have labels.** Use `<label htmlFor="id">` or `aria-label`.
4. **Color is not the only indicator.** Always pair color with text, icons, or patterns.
5. **Focus management.** Modals should trap focus. Removing content should return focus to a sensible location.
6. **Use ARIA attributes correctly.** `aria-live` for dynamic content, `aria-expanded` for toggles, `aria-describedby` for additional context.
7. **Test with screen readers.** NVDA (Windows), VoiceOver (macOS), or ORCA (Linux).

### Skip Links

```tsx
function SkipLink() {
  return (
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4">
      Skip to main content
    </a>
  );
}
```

---

## Testing

### Component Tests (Vitest + React Testing Library)

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  it('renders user information', () => {
    render(<UserCard name="Alice" email="alice@example.com" />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn();
    render(<UserCard name="Alice" email="alice@example.com" onSelect={onSelect} />);
    await fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('shows loading state', () => {
    render(<UserCard name="Alice" email="alice@example.com" isLoading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

### Testing Principles

1. **Test behavior, not implementation.** Query by role, text, or label — not by CSS class or test ID.
2. **Prefer accessible queries.** `getByRole` > `getByLabelText` > `getByText` > `getByTestId`.
3. **Test user interactions.** Click, type, submit — test what the user does.
4. **Avoid testing internal state.** Test the rendered output, not `useState` values.
5. **Mock at the boundary.** Mock API calls (with MSW or `vi.fn()`), not internal functions.
6. **Co-locate tests.** Place `*.test.tsx` files next to the components they test.

### Hook Tests

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

it('increments counter', () => {
  const { result } = renderHook(() => useCounter(0));
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

---

## Styling

### Tailwind CSS (Preferred)

```tsx
function Button({ variant = 'primary', children }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
      )}
    >
      {children}
    </button>
  );
}
```

### CSS Modules

```tsx
import styles from './Button.module.css';

function Button({ variant = 'primary', children }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}
```

### Utility: `cn()` Helper (clsx + tailwind-merge)

```tsx
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## API and Data Fetching

### TanStack Query (Recommended)

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetch(`/api/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}
```

### API Client Pattern

```tsx
const API_BASE = import.meta.env.VITE_API_URL;

async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json();
}
```

---

## Common Anti-Patterns to Avoid

1. **Prop drilling through many layers** — Use Context or state management libraries instead.
2. **Unnecessary useEffect** — Derive state during render; handle events in handlers.
3. **Mutating state directly** — Always create new objects/arrays when updating state.
4. **Missing cleanup in useEffect** — Always return cleanup for subscriptions, timers, abort controllers.
5. **Using array index as key for dynamic lists** — Use stable, unique identifiers.
6. **Premature optimization** — Don't wrap everything in `React.memo` / `useMemo` / `useCallback`.
7. **Giant components** — Split components that exceed ~150-200 lines.
8. **Business logic in components** — Extract into custom hooks or utility functions.
9. **Uncontrolled-to-controlled switches** — Decide if an input is controlled or uncontrolled at mount; don't switch.
10. **Fetching in useEffect without cleanup** — Always handle race conditions with abort controllers or cancelled flags.

---

## Environment Variables

- Prefix client-exposed variables with `VITE_`: `VITE_API_URL`, `VITE_PUBLIC_KEY`.
- Access via `import.meta.env.VITE_API_URL`.
- Never expose secrets in client-side code.
- Use `.env.local` for local overrides (git-ignored).

---

## Git and Code Quality

- **Commit messages**: Use conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`).
- **Branch naming**: `feature/description`, `fix/description`, `refactor/description`.
- **Pre-commit**: ESLint + Prettier + TypeScript checking via Husky + lint-staged.
- **CI**: Run `tsc --noEmit`, `eslint .`, `vitest run`, and `playwright test` in CI.
