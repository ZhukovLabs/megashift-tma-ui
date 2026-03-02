# MegaShift TMA UI

Telegram Mini App для управления рабочими сменами. Позволяет сотрудникам планировать, отслеживать смены и просматривать статистику зарплат.

## Технологии

- **Next.js 16** — фреймворк
- **React 19** — UI
- **TypeScript** — типизация
- **Tailwind CSS 4** + DaisyUI — стили
- **Zustand** — управление состоянием
- **React Query** — серверное состояние
- **React Hook Form + Zod** — формы и валидация
- **TMA SDK** — интеграция с Telegram
- **next-intl** — интернационализация (ru/en)
- **Framer Motion** — анимации

## Структура проекта

```
├── app/                    # Next.js App Router страницы
│   ├── (authenticated)/    # Защищённые маршруты
│   │   ├── schedule/       # График смен
│   │   ├── shifts/         # Управление сменами
│   │   ├── statistics/     # Статистика и графики
│   │   └── settings/       # Настройки профиля
│   ├── onboarding/        # Онбординг
│   └── layout.tsx          # Корневой layout
├── components/            # UI компоненты
├── entities/              # Доменные сущности
│   ├── user/              # Пользователь
│   ├── currency/          # Валюты
│   └── salary/            # Зарплата
├── hooks/                 # Кастомные React хуки
├── store/                 # Zustand stores
├── lib/                   # Утилиты (axios, react-query)
└── i18n/                  # Интернационализация
```

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

## Скрипты

- `npm run dev` — разработка
- `npm run build` — сборка
- `npm run start` — продакшен запуск
- `npm run lint` — линтинг

## Docker

```bash
# Сборка
docker build -t planner .

# Запуск
docker run -p 3000:3000 planner
```

## Переменные окружения

Создайте `.env.local`:

```
# API URL (обязательно)
NEXT_PUBLIC_API_URL=

# Опционально
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Доступные языки

- 🇷🇺 Русский (по умолчанию)
- 🇬🇧 English

## Разработка

Проект использует feature-based архитектуру. При добавлении новой функциональности:

1. Создайте компоненты в `components/`
2. Добавьте типы в соответствующую сущность в `entities/`
3. Используйте Zustand для локального состояния
4. React Query — для серверного состояния
