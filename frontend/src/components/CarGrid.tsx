"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { fetchCars, CarFilters } from "@/lib/api";
import CarCard from "./CarCard";
import Filters from "./Filters";

export default function CarGrid() {
  const [filters, setFilters] = useState<CarFilters>({
    page: 1,
    page_size: 12,
  });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["cars", filters],
    queryFn: () => fetchCars(filters),
  });

  const totalPages = data ? Math.ceil(data.total / (filters.page_size ?? 12)) : 0;

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="catalog" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Filters
        filters={filters}
        onChange={setFilters}
        total={data?.total ?? 0}
      />

      <div className="mt-8">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-dark-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-dark-muted rounded w-1/3" />
                  <div className="h-4 bg-dark-muted rounded w-2/3" />
                  <div className="h-3 bg-dark-muted rounded w-1/2" />
                  <div className="border-t border-dark-border pt-3 flex justify-between items-center">
                    <div className="h-5 bg-dark-muted rounded w-24" />
                    <div className="h-9 bg-dark-muted rounded w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-gray-500 text-center">
              Could not load cars. Make sure the backend is running.
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 gold-gradient text-dark font-semibold px-5 py-2.5 rounded text-sm hover:opacity-90 transition-opacity"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && data?.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-gray-500 text-lg">No cars found</p>
            <p className="text-gray-600 text-sm">Try adjusting your filters</p>
          </div>
        )}

        {/* Cars grid */}
        {!isLoading && data && data.items.length > 0 && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-opacity duration-300 ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            {data.items.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => handlePageChange((filters.page ?? 1) - 1)}
            disabled={(filters.page ?? 1) <= 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded border border-dark-border text-sm text-gray-400 hover:text-gold hover:border-gold/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
            Prev
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const page = i + 1;
              const current = filters.page ?? 1;
              if (
                totalPages <= 7 ||
                page === 1 ||
                page === totalPages ||
                Math.abs(page - current) <= 1
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded text-sm font-medium transition-all ${
                      page === current
                        ? "gold-gradient text-dark font-bold"
                        : "border border-dark-border text-gray-400 hover:text-gold hover:border-gold/40"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              if (Math.abs(page - current) === 2) {
                return (
                  <span key={page} className="text-gray-600 px-1">
                    …
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange((filters.page ?? 1) + 1)}
            disabled={(filters.page ?? 1) >= totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded border border-dark-border text-sm text-gray-400 hover:text-gold hover:border-gold/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </section>
  );
}
