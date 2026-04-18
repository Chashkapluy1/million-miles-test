from datetime import datetime
from sqlalchemy import Integer, String, BigInteger, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class Car(Base):
    __tablename__ = "cars"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    encar_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    brand: Mapped[str] = mapped_column(String(100), default="")
    model: Mapped[str] = mapped_column(String(100), default="")
    badge: Mapped[str] = mapped_column(String(100), default="")
    year: Mapped[int] = mapped_column(Integer, default=0)
    mileage: Mapped[int] = mapped_column(BigInteger, default=0)
    price: Mapped[int] = mapped_column(BigInteger, default=0)
    photo: Mapped[str] = mapped_column(String(500), default="")
    fuel: Mapped[str] = mapped_column(String(50), default="")
    color: Mapped[str] = mapped_column(String(50), default="")
    detail_url: Mapped[str] = mapped_column(String(500), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )
