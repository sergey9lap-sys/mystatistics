# mystatistics

Персональный футбольный матч-центр Сергея Лапина.

## Запуск

```bash
npm install
npm run dev
```

После запуска проект доступен по адресу [http://localhost:3000](http://localhost:3000).

## Добавление матчей

Новые матчи добавляются в `data/football.ts`. Общая статистика, форма, серии и показатели по командам рассчитываются автоматически.

## Деплой на Vercel

1. Импортируйте репозиторий `sergey9lap-sys/mystatistics` в Vercel.
2. Оставьте автоматически определённый Framework Preset: `Next.js`.
3. Root Directory: корень репозитория.
4. Build Command и Output Directory не переопределяйте.

Переменные окружения проекту не требуются. Каждый новый push в `main` автоматически создаёт production deployment.
