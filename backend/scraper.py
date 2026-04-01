import httpx
import asyncio
import logging
from typing import Any

logger = logging.getLogger(__name__)

ENCAR_API_URL = "https://api.encar.com/search/car/list/general"
ENCAR_PHOTO_BASE = "https://ci.encar.com"
ENCAR_DETAIL_URL = "https://www.encar.com/dc/dc_cardetailview.do?carid={car_id}"

# encar.com returns brand names in Korean — map to English
BRAND_MAP: dict[str, str] = {
    "현대": "Hyundai",
    "기아": "Kia",
    "제네시스": "Genesis",
    "쉐보레(GM대우)": "Chevrolet",
    "르노코리아(삼성)": "Renault Korea",
    "KG모빌리티(쌍용)": "KG Mobility",
    "쌍용": "SsangYong",
    "BMW": "BMW",
    "벤츠": "Mercedes-Benz",
    "아우디": "Audi",
    "폭스바겐": "Volkswagen",
    "볼보": "Volvo",
    "포르쉐": "Porsche",
    "렉서스": "Lexus",
    "토요타": "Toyota",
    "혼다": "Honda",
    "테슬라": "Tesla",
    "지프": "Jeep",
    "랜드로버": "Land Rover",
    "미니": "MINI",
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Referer": "https://www.encar.com/",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
}


def _build_photo_url(item: dict[str, Any]) -> str:
    photos = item.get("Photos", [])
    if photos:
        loc = photos[0].get("location", "")
        if loc:
            return f"{ENCAR_PHOTO_BASE}{loc}"

    photo_prefix = item.get("Photo", "")
    if photo_prefix:
        return f"{ENCAR_PHOTO_BASE}{photo_prefix}027.jpg"

    return ""


def _parse_car(item: dict[str, Any]) -> dict[str, Any] | None:
    car_id = str(item.get("Id", "")).strip()
    if not car_id:
        return None

    manufacturer_raw = item.get("Manufacturer", "") or ""
    manufacturer = BRAND_MAP.get(manufacturer_raw, manufacturer_raw)
    model = item.get("Model", "") or ""
    badge = item.get("Badge", "") or ""
    badge_detail = item.get("BadgeDetail", "") or ""

    full_badge = " ".join(filter(None, [badge, badge_detail])).strip()
    full_model = " ".join(filter(None, [manufacturer, model, full_badge])).strip()

    # Price is in 만원 (10,000 KRW) — convert to full KRW
    raw_price = int(item.get("Price", 0) or 0)

    return {
        "encar_id": car_id,
        "brand": manufacturer,
        "model": full_model,
        "badge": full_badge,
        "year": int(str(item.get("Year", 0) or 0)[:4]),  # API returns YYYYMM
        "mileage": int(item.get("Mileage", 0) or 0),
        "price": raw_price * 10000,
        "photo": _build_photo_url(item),
        "fuel": item.get("FuelType", "") or "",
        "color": item.get("Color", "") or "",
        "detail_url": ENCAR_DETAIL_URL.format(car_id=car_id),
    }


async def _fetch_with_retry(
    url: str, params: dict, headers: dict, retries: int = 3
) -> dict | None:
    for attempt in range(retries):
        try:
            async with httpx.AsyncClient(
                timeout=30.0, follow_redirects=True, verify=False
            ) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error("HTTP %s on attempt %d: %s", e.response.status_code, attempt + 1, e)
            return None
        except Exception as e:
            wait = 2 ** attempt
            logger.warning("Attempt %d failed (%s), retrying in %ds…", attempt + 1, e, wait)
            if attempt < retries - 1:
                await asyncio.sleep(wait)

    logger.error("All %d attempts failed for %s", retries, url)
    return None


async def fetch_encar_cars(limit: int = 100) -> list[dict[str, Any]]:
    params = {
        "count": "true",
        "q": "(And.Hidden.N._.SellType.\uc77c\ubc18._.CarType.Y.)",  # regular sales, passenger cars
        "sr": f"|ModifiedDate|0|{limit}",
        "inav": "|Manufacturer|ModelGroup|BadgeGroup|Year|Mileage|Price|FuelType|",
    }

    data = await _fetch_with_retry(ENCAR_API_URL, params, HEADERS)
    if not data:
        return []

    results = data.get("SearchResults", [])
    cars = [c for item in results if (c := _parse_car(item))]

    logger.info("Fetched %d cars from encar.com (total available: %s)", len(cars), data.get("Count"))
    return cars
