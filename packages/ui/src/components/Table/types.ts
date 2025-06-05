export interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: (record: T) => boolean;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  compact?: boolean;
  maxHeight?: string;
  fillHeight?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (record: T) => void;
  // Search and filter props
  searchTerm?: string;
  selectedCategory?: string;
  selectedStatus?: string;
  selectedDateRange?: string;
  sortOption?: string;
  categories?: string[];
  statusOptions?: string[];
  dateRangeOptions?: { value: string; label: string }[];
  sortOptions?: { value: string; label: string }[];
  onSearch?: (term: string) => void;
  onFilter?: (category: string) => void;
  onStatusFilter?: (status: string) => void;
  onDateFilter?: (dateRange: string) => void;
  onSort?: (sortBy: string) => void;
}

export interface TableSearchProps {
  searchTerm: string;
  placeholder?: string;
  onSearch: (term: string) => void;
  className?: string;
}

export interface TableFilterProps {
  selectedCategory: string;
  categories: string[];
  onFilter: (category: string) => void;
  className?: string;
  placeholder?: string;
}

export interface TableSelectFilterProps {
  selectedValue: string;
  options: string[] | { value: string; label: string }[];
  onFilter: (value: string) => void;
  className?: string;
  placeholder?: string;
}