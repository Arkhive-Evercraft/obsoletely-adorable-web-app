export interface PriceRange {
  min: number | null;
  max: number | null;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface SearchFilterProps {
  searchTerm: string;
  selectedCategory: string;
  sortOption: string;
  categories: string[];
  sortOptions: SortOption[];
  activeFiltersCount: number;
  isAdvancedFiltersOpen: boolean;
  onSearch: (term: string) => void;
  onFilter: (category: string) => void;
  onSort: (sortBy: string) => void;
  onToggleAdvancedFilters: () => void;
  onResetAllFilters: () => void;
}

export interface AdvancedFiltersProps {
  stockFilter: 'all' | 'inStock' | 'outOfStock';
  priceRange: PriceRange;
  onStockFilterChange: (filter: 'all' | 'inStock' | 'outOfStock') => void;
  onPriceRangeChange: (type: 'min' | 'max', value: string) => void;
}

export interface ActiveFilterTagsProps {
  searchTerm: string;
  selectedCategory: string;
  stockFilter: 'all' | 'inStock' | 'outOfStock';
  priceRange: PriceRange;
  onClearSearchTerm: () => void;
  onClearCategory: () => void;
  onClearStockFilter: () => void;
  onClearPriceMin: () => void;
  onClearPriceMax: () => void;
}