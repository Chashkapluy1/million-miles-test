import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from database import AsyncSessionLocal
from models import Car
from scraper import fetch_encar_cars
from sqlalchemy import select

logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler()


async def run_scrape_job():
    logger.info("Scrape job started")
    cars = await fetch_encar_cars(limit=100)

    if not cars:
        logger.warning("No cars returned from scraper")
        return

    async with AsyncSessionLocal() as session:
        async with session.begin():
            for car_data in cars:
                existing = await session.scalar(
                    select(Car).where(Car.encar_id == car_data["encar_id"])
                )
                if existing:
                    for key, value in car_data.items():
                        setattr(existing, key, value)
                else:
                    session.add(Car(**car_data))

    logger.info("Scrape job finished — upserted %d cars", len(cars))


def start_scheduler():
    # run every day at 03:00
    scheduler.add_job(
        run_scrape_job,
        trigger=CronTrigger(hour=3, minute=0),
        id="daily_scrape",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler started (daily at 03:00)")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler stopped")
