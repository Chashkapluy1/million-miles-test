"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { CarFilters } from "@/lib/api";
import { useState } from "react";

interface FiltersProps {
  filters: CarFilters;
  onChange: (f: CarFilters) => void;
  total: number;
}

const BRANDS = [
  "All Brands",
  "Hyundai",
  "Kia",
  "Genesis",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "Porsche",
];

const YEARS = Array.from({ length: 15 }, (_, i) => 2025 - i);

export default function Filters({ filters, onChange, total }: FiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const handleBrand = (brand: string) => {
    onChange({ ...filters, brand: brand === "All Brands" ? undefined : brand, page: 1 });
  };

  const hasFilters = filters.brand || filters.min_year || filters.max_year;

  const clearFilters = () => {
    onChange({ page: 1, page_size: filters.page_size });
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-2xl text-white">
            Available <span className="gold-text">Vehicles</span>
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">{total} cars found</p>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold border border-dark-border hover:border-gold/40 px-3 py-2 rounded transition-all"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-2 border px-4 py-2 rounded text-sm font-medium transition-all ${
              expanded
                ? "border-gold/60 text-gold bg-gold/5"
                : "border-dark-border text-gray-400 hover:border-gold/40 hover:text-gold"
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          {/* Brand */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
              Brand
            </label>
            <select
              className="w-full bg-dark border border-dark-border text-white text-sm rounded px-3 py-2.5 focus:outline-none focus:border-gold/50"
              value={filters.brand || "All Brands"}
              onChange={(e) => handleBrand(e.target.value)}
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Year from */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
              Year From
            </label>
            <select
              className="w-full bg-dark border border-dark-border text-white text-sm rounded px-3 py-2.5 focus:outline-none focus:border-gold/50"
              value={filters.min_year || ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  min_year: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
            >
              <option value="">Any</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Year to */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
              Year To
            </label>
            <select
              className="w-full bg-dark border border-dark-border text-white text-sm rounded px-3 py-2.5 focus:outline-none focus:border-gold/50"
              value={filters.max_year || ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  max_year: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
            >
              <option value="">Any</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Quick brand pills */}
      <div className="flex flex-wrap gap-2">
        {["Hyundai", "Kia", "Genesis", "BMW", "Mercedes-Benz"].map((brand) => (
          <button
            key={brand}
            onClick={() => handleBrand(brand === filters.brand ? "All Brands" : brand)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filters.brand === brand
                ? "border-gold/60 text-gold bg-gold/10"
                : "border-dark-border text-gray-400 hover:border-gold/30 hover:text-white"
            }`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}
