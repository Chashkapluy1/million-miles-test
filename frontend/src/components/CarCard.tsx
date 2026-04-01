"use client";

import Image from "next/image";
import { Fuel, Gauge, Calendar, ExternalLink } from "lucide-react";
import { Car, formatMileage, formatPrice } from "@/lib/api";
import { useState } from "react";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const [imgError, setImgError] = useState(false);

  const fallbackImg =
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=70";

  return (
    <div className="group relative bg-dark-card border border-dark-border rounded-xl overflow-hidden card-hover flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-dark-muted">
        <Image
          src={imgError ? fallbackImg : car.photo || fallbackImg}
          alt={car.model || "Car"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          unoptimized
        />
        {/* Year badge */}
        <div className="absolute top-3 left-3 bg-dark/80 glass border border-dark-border rounded px-2 py-1">
          <span className="text-xs font-semibold text-gold">{car.year}</span>
        </div>
        {/* Fuel badge */}
        {car.fuel && (
          <div className="absolute top-3 right-3 bg-dark/80 glass border border-dark-border rounded px-2 py-1">
            <span className="text-xs text-gray-300">{car.fuel}</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Brand + Model */}
        <div>
          <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-0.5">
            {car.brand || "Unknown Brand"}
          </p>
          <h3 className="font-bold text-base text-white leading-snug line-clamp-2">
            {car.model || "Unknown Model"}
          </h3>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-4 text-gray-400 text-xs">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="text-gold" />
            {car.year}
          </span>
          <span className="flex items-center gap-1.5">
            <Gauge size={12} className="text-gold" />
            {formatMileage(car.mileage)}
          </span>
          {car.fuel && (
            <span className="flex items-center gap-1.5">
              <Fuel size={12} className="text-gold" />
              {car.fuel}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-dark-border" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Price</p>
            <p className="font-extrabold text-lg gold-text">
              {formatPrice(car.price)}
            </p>
          </div>
          <a
            href={car.detail_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 gold-gradient text-dark font-bold px-4 py-2.5 rounded text-xs hover:opacity-90 transition-opacity"
          >
            View Details
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
