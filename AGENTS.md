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

### Project Structure (Feature-Sliced Design)

The project follows Feature-Sliced Design (FSD) architecture:

```
├── app/                    # Next.js App Router (routing only)
│   ├── (authenticated)/   # Protected routes group
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Entry page
├── entities/               # Business entities
│   ├── access/            # Access claims (AccessClaim enum)
│   │   └── model/         # types.ts, constants.ts
│   ├── currency/          # Currency types and utils
│   │   ├── model/         # types, constants
│   │   └── lib/           # getCurrencySymbol
│   ├── salary/            # Salary types
│   │   └── model/         # types.ts
│   └── user/              # User entity
│       ├── model/         # store.ts, types.ts
│       └── lib/           # useOwnerId hook
├── features/              # Business features
│   └── <feature>/
│       ├── api/           # React Query hooks
│       ├── model/         # Types, stores, config, utils
│       └── ui/            # Feature-specific components
├── shared/                # Reusable infrastructure
│   ├── config/            # API endpoints, axios, react-query
│   ├── constants/         # ROUTES
│   ├── hooks/             # usePrefetch
│   ├── i18n/              # Internationalization config
│   ├── lib/               # Utilities (format, time, colors)
│   └── ui/                # Shared UI components
├── views/                 # Page-level components
│   └── <page>/
│       └── index.tsx      # Page component
└── widgets/               # Composite UI blocks
    └── bottom-menu/
```

### Layer Dependencies (FSD)

```
app → views → widgets → features → entities → shared
```

- Higher layers can import from lower layers
- Never import from higher layers into lower layers
- `shared` has no dependencies on other layers

### Imports

- Use path aliases (`@/`) for all imports
- Import from index files, not internal files
- Order: external → internal → relative

```typescript
// Good
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStatisticsData } from '@/features/statistics';
import { useUserStore } from '@/entities/user';
import { StatisticsTable } from './statistics-table';

// Bad
import { useStatisticsData } from '@/features/statistics/model/use-statistics-data';
```

### TypeScript

- Define prop types explicitly
- Use `type` for unions/primitives, `interface` for objects
- Use `as const` for configuration objects
- Never use `any`

```typescript
type Props = {
    year: number;
    month: number;
    onChange: (year: number, month: number) => void;
    isLoading?: boolean;
};

const salaryTypeConfig = {
    HOURLY: { label: 'Почасовая', color: '#facc15' },
} as const;
```

### Naming Conventions

- **Components**: PascalCase (`StatisticsPage`, `MonthSelector`)
- **Hooks**: camelCase with `use` prefix (`useStatisticsData`)
- **Types**: PascalCase (`User`, `SalaryType`)
- **Files**: kebab-case (`statistics-page.tsx`)
- **Constants**: SCREAMING_SNAKE_CASE

```typescript
export function StatisticsPage() {}
export const useStatisticsData = () => {};
export type ShiftStatisticsItem = {};
```

### React Components

- Function components only
- `'use client'` for interactive components
- Destructure props in signature

```typescript
'use client';

type Props = {
    title: string;
    onSave: () => void;
};

export function MyComponent({ title, onSave }: Props) {
    const [value, setValue] = useState('');
    return <div>{title}</div>;
}
```

### React Query

- Use `useQuery` for data fetching
- Encapsulate in custom hooks
- Include all dependencies in query keys

```typescript
export function useGetStatistics(year: number, month: number) {
    return useQuery({
        queryKey: ['statistics', year, month] as const,
        queryFn: () => fetchStatistics(year, month),
        enabled: Number.isFinite(year) && Number.isFinite(month),
    });
}
```

### State Management

- **Server state**: React Query
- **Client state**: Zustand
- **UI state**: local `useState`

```typescript
// Zustand store
export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
```

### Internationalization

- Use `useTranslations` from `next-intl`
- Translations in `public/locales/{ru,en}.json`

```typescript
import { useTranslations } from 'next-intl';

export function StatisticsPage() {
    const t = useTranslations('statistics');
    return <h1>{t('title')}</h1>;
}
```

### Error Handling

- Use try/catch for async operations
- Display errors via toast notifications

```typescript
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

```tsx
<div className="flex items-center gap-4 p-4">
    <button className="btn btn-primary">Save</button>
</div>
```

### File Organization

- Named exports for components/hooks
- Index files for clean imports

```typescript
// features/statistics/index.ts
export { useGetStatistics } from './api';
export type { StatisticsResponse } from './model';
export { StatisticsTable } from './ui';
```

---

## 3. Common Patterns

### Adding a New Feature

1. Create `features/<feature>/model/types.ts` for types
2. Create `features/<feature>/api/` for React Query hooks
3. Create `features/<feature>/ui/` for components
4. Export from `features/<feature>/index.ts`
5. Create page in `views/`

### Adding a New Entity

1. Create `entities/<entity>/model/types.ts`
2. Add store if needed in `entities/<entity>/model/store.ts`
3. Add utils in `entities/<entity>/lib/`
4. Export from `entities/<entity>/index.ts`

---

## 4. Important Notes

- **Next.js 16** with App Router
- All client interactivity requires `'use client'`
- Path aliases: `@/` prefix
- Linting: ESLint with Next.js config
- No test framework configured
