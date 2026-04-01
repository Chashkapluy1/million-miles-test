# Million Miles — каталог автомобилей

Тестовое задание: парсим encar.com (корейский авторынок), сохраняем в SQLite, отдаём через FastAPI, показываем на лендинге Next.js.

## Стек

| Часть | Технологии |
|-------|------------|
| Backend | Python 3.12, FastAPI, SQLAlchemy (async), APScheduler |
| Парсер | httpx → публичный API encar.com |
| БД | SQLite (aiosqlite) |
| Frontend | Next.js 15, React 19, Tailwind CSS, TanStack Query |

## Запуск локально (без Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

При первом старте автоматически парсится encar.com (~100 машин). Документация API: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

## Docker

```bash
docker compose up --build
```

- Лендинг: http://localhost:3000
- API: http://localhost:8000
- Swagger: http://localhost:8000/docs

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/cars` | Список машин с пагинацией (фильтры: brand, min/max_year, min/max_price) |
| GET | `/api/cars/{id}` | Одна машина |
| POST | `/api/scrape` | Запустить парсинг вручную |
| GET | `/api/health` | Проверка работы |

## Парсер

- Источник: `https://api.encar.com/search/car/list/general`
- Берёт 100 последних объявлений, отсортированных по дате обновления
- Upsert в SQLite — дублей не будет
- Автозапуск каждый день в 03:00 через APScheduler

## Структура проекта

```
Million_Miles/
├── backend/
│   ├── main.py         # FastAPI, роуты
│   ├── scraper.py      # клиент encar.com
│   ├── scheduler.py    # ежедневный парсинг
│   ├── models.py       # ORM-модель
│   ├── database.py     # движок + сессия
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/        # Next.js App Router
│   │   ├── components/ # Header, Hero, CarGrid, CarCard, Filters, Footer
│   │   └── lib/api.ts  # axios + типы
│   └── ...конфиги
└── docker-compose.yml
```
