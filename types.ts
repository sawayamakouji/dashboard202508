
export interface FilterState {
  startDate: string;
  endDate: string;
  area: string;
  store: string;
  department: string;
  category: string;
  product: string;
}

export interface PosData {
  id: number;
  date: string;
  area: string;
  store: string;
  department: string;
  category: string;
  product: string;
  salesAmount: number;
  salesQuantity: number;
  inventoryCount: number;
  inventoryAmount: number;
  discountAmount: number;
  customerCount: number;
  salesAmountPrevYear: number;
}

export interface FilterOptions {
  areas: string[];
  stores: string[];
  departments: string[];
  categories: string[];
  products: string[];
}

export interface Kpi {
    id: string;
    title: string;
    value: number;
    description?: string;
    format?: (value: number) => string;
}

export type ChartDimension = 'date' | 'store' | 'department' | 'category';
