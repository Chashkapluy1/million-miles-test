import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = axios.create({ baseURL: API_BASE });

export interface Car {
  id: number;
  encar_id: string;
  brand: string;
  model: string;
  badge: string;
  year: number;
  mileage: number;
  price: number;
  photo: string;
  fuel: string;
  color: string;
  detail_url: string;
}

export interface PaginatedCars {
  total: number;
  page: number;
  page_size: number;
  items: Car[];
}

export interface CarFilters {
  page?: number;
  page_size?: number;
  brand?: string;
  min_price?: number;
  max_price?: number;
  min_year?: number;
  max_year?: number;
}

export async function fetchCars(filters: CarFilters = {}): Promise<PaginatedCars> {
  const params: Record<string, string | number> = {};
  if (filters.page) params.page = filters.page;
  if (filters.page_size) params.page_size = filters.page_size;
  if (filters.brand) params.brand = filters.brand;
  if (filters.min_price !== undefined) params.min_price = filters.min_price;
  if (filters.max_price !== undefined) params.max_price = filters.max_price;
  if (filters.min_year !== undefined) params.min_year = filters.min_year;
  if (filters.max_year !== undefined) params.max_year = filters.max_year;

  const { data } = await api.get<PaginatedCars>("/api/cars", { params });
  return data;
}

export function formatPrice(priceKRW: number): string {
  if (priceKRW === 0) return "Price on request";
  const wan = priceKRW / 10000;
  if (wan >= 10000) {
    return `₩${(wan / 10000).toFixed(1)}억`;
  }
  return `₩${wan.toFixed(0)}만`;
}

export function formatMileage(km: number): string {
  if (km === 0) return "—";
  return km.toLocaleString("en-US") + " km";
}
