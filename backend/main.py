import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from database import init_db, get_db
from models import Car
from scraper import fetch_encar_cars
from scheduler import start_scheduler, stop_scheduler, run_scrape_job

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    await init_db()
    # initial scrape if DB is empty
    from database import AsyncSessionLocal
    async with AsyncSessionLocal() as session:
        count = await session.scalar(select(func.count()).select_from(Car))
        if count == 0:
            logger.info("DB is empty — running initial scrape...")
            await run_scrape_job()

    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(title="Million Miles — Car Listings API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CarOut(BaseModel):
    id: int
    encar_id: str
    brand: str
    model: str
    badge: str
    year: int
    mileage: int
    price: int
    photo: str
    fuel: str
    color: str
    detail_url: str

    model_config = {"from_attributes": True}


class PaginatedCars(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[CarOut]


@app.get("/api/cars", response_model=PaginatedCars)
async def list_cars(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    brand: str | None = Query(None),
    min_price: int | None = Query(None),
    max_price: int | None = Query(None),
    min_year: int | None = Query(None),
    max_year: int | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Car)

    if brand:
        stmt = stmt.where(Car.brand.ilike(f"%{brand}%"))
    if min_price is not None:
        stmt = stmt.where(Car.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Car.price <= max_price)
    if min_year is not None:
        stmt = stmt.where(Car.year >= min_year)
    if max_year is not None:
        stmt = stmt.where(Car.year <= max_year)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = await db.scalar(count_stmt) or 0

    stmt = stmt.order_by(Car.updated_at.desc())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    cars = result.scalars().all()

    return PaginatedCars(total=total, page=page, page_size=page_size, items=list(cars))


@app.get("/api/cars/{car_id}", response_model=CarOut)
async def get_car(car_id: int, db: AsyncSession = Depends(get_db)):
    car = await db.get(Car, car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car


@app.post("/api/scrape", status_code=202)
async def trigger_scrape():
    import asyncio
    asyncio.create_task(run_scrape_job())
    return {"message": "Scrape started"}


@app.get("/api/health")
async def health():
    return {"status": "ok"}
