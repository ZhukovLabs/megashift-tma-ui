# AGENTS.md - Developer Guidelines

This document provides guidelines for AI agents working in this codebase.

---

## 1. Build, Lint, and Test Commands

### Development
```bash
npm run dev          # Start development server
```

### Build
```bash
npm run build        # Build for production
npm start            # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint
```

**Note:** This project does not currently have a test framework configured. Do not write tests unless explicitly requested.

---

## 2. Code Style Guidelines

### Project Structure (FSD-inspired)

The project is transitioning to Feature-Sliced Design (FSD):

```
src/
├── app/              # Next.js App Router pages
├── features/         # Business features (entities + logic + ui)
│   └── <feature>/
│       ├── api/      # API hooks (React Query)
│       ├── model/    # Business logic, types, state
│       └── ui/      # Feature-specific UI components
├── entities/         # Core domain entities (User, Salary, Currency)
│   └── <entity>/
│       └── model/   # Types, stores, config
├── views/            # Page-level components (replaces traditional pages/)
├── components/       # Shared UI components
├── hooks/            # Custom React hooks
├── shared/           # Utilities, configs, libs
├── i18n/             # Internationalization (next-intl)
└── constants/        # App-wide constants
```

### Imports

- Use path aliases (`@/`) for all imports
- Order imports: external → internal → relative
- Group: imports, then blank line, then code

```typescript
// Good
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useStatisticsData } from '@/features/statistics/model';
import { SalaryType } from '@/entities/salary';
import { StatisticsTable } from './statistics-table';

// Bad
import {StatisticsTable} from"./statistics-table";
import { useStatisticsData } from '@/features/statistics/model/use-statistics-data';
```

### TypeScript

- **Always** define prop types explicitly
- Use interfaces for object shapes, types for unions/primitives
- Prefer `type` over `enum` where possible (enums are okay for domain constants)
- Use `as const` for configuration objects
- Never use `any` unless absolutely necessary

```typescript
// Good
type Props = {
    year: number;
    month: number;
    onChange: (year: number, month: number) => void;
    isLoading?: boolean;
};

interface User {
    id: string;
    name: string;
    email?: string;
}

// Good - const assertions for config
const salaryTypeConfig = {
    HOURLY: { label: 'Почасовая', color: '#facc15' },
} as const;

// Bad
const props = { year: 1, month: 1 }; // implicit any
```

### Naming Conventions

- **Components**: PascalCase (`StatisticsPage`, `MonthSelector`)
- **Hooks**: camelCase with `use` prefix (`useStatisticsData`, `useUserStore`)
- **Types/Interfaces**: PascalCase (`User`, `SalaryType`)
- **Files**: kebab-case for components (`statistics-page.tsx`), camelCase for utils
- **Constants**: SCREAMING_SNAKE_CASE for config values, camelCase for objects

```typescript
// Good
export function StatisticsPage() {}
export const useStatisticsData = () => {};
export type ShiftStatisticsItem = {};

// Bad
export const StatisticsPage = () => {};  // not a component
export const getStatisticsData = () => {};  // should be use*
```

### React Components

- Use function components only
- Add `'use client'` directive for client-side components
- Destructure props in component signature
- Use explicit return types for complex components

```typescript
// Good
'use client';

import { useState } from 'react';

type Props = {
    title: string;
    onSave: () => void;
};

export function MyComponent({ title, onSave }: Props) {
    const [value, setValue] = useState('');

    return <div>{title}</div>;
}

// Bad - no 'use client' for interactive components
export default function Page() {
    const [state, setState] = useState();
    return <button onClick={() => setState(!state)}>Click</button>;
}
```

### React Query

- Use `useQuery` for data fetching
- Custom hooks should encapsulate query logic
- Use query keys that include all dependencies

```typescript
// Good
const queryKey = ['statistics', year, month] as const;

export function useGetStatistics(year: number, month: number) {
    return useQuery({
        queryKey,
        queryFn: () => fetchStatistics(year, month),
        enabled: Number.isFinite(year) && Number.isFinite(month),
    });
}
```

### State Management

- Use React Query for server state
- Use Zustand for client state
- Use local `useState` for UI state

```typescript
// Zustand store
import { create } from 'zustand';

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
```

### Internationalization (next-intl)

- Use `useTranslations` hook for UI text
- Add translation keys to `public/locales/ru.json` and `public/locales/en.json`
- Use nesting for related keys

```typescript
// Good
import { useTranslations } from 'next-intl';

export function StatisticsPage() {
    const t = useTranslations('statistics');
    return <h1>{t('title')}</h1>;
}

// Translation file
{
    "statistics": {
        "title": "Статистика",
        "total": "Всего"
    }
}
```

### Error Handling

- Use try/catch for async operations
- Display errors via toast notifications
- Provide fallback UI for error states

```typescript
// Good
try {
    await updateProfile(data);
    toast.success('Сохранено');
} catch (error) {
    toast.error('Ошибка сохранения');
}
```

### Styling

- Use Tailwind CSS utility classes
- Use DaisyUI components when available
- Use `className` for Tailwind, not `style`

```tsx
// Good
<div className="flex items-center gap-4 p-4">
    <button className="btn btn-primary">Save</button>
</div>

// Bad
<div style={{ display: 'flex', padding: '16px' }}>
```

### Server Actions

- Use `'use server'` directive
- Place in `actions.ts` files in appropriate layer
- Validate input with Zod

```typescript
// Good
'use server';

import { z } from 'zod';

const schema = z.object({
    name: z.string().min(1),
});

export async function setLocale(locale: string) {
    const valid = schema.parse({ name: locale });
    // ...
}
```

### File Organization

- One export per line (or grouped)
- Default export for page components
- Named exports for reusable components/hooks
- Index files for clean imports

```typescript
// features/statistics/api/index.ts
export { useGetStatistics } from './use-get-statistics';
export type { StatisticsResponse } from './types';
```

---

## 3. Common Patterns

### Feature Development Flow

1. Add API endpoint to `shared/config/api.ts`
2. Create hook in `features/<feature>/api/`
3. Add types in `features/<feature>/model/`
4. Create UI in `features/<feature>/ui/`
5. Create page in `views/<page>/` or `app/`
6. Add translations to locale files

### Adding a New Page

1. Create component in `views/` or `app/`
2. Add route in Next.js App Router (`app/.../page.tsx`)
3. Add to navigation if needed
4. Add translation keys

---

## 4. Important Notes

- This project uses **Next.js 16** with App Router
- All client-side interactivity requires `'use client'`
- Path aliases are configured in `tsconfig.json` with `@/` prefix
- Linting is via ESLint with Next.js config
- No test framework is currently set up
