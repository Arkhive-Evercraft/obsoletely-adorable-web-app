"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { TableProps, TableColumn, TableAction } from './types';
import { TableSearch, TableFilter, TableSelectFilter } from '@/components/Table';
import styles from './Table.module.css';

export function Table<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  loading = false,
  searchable = true,
  filterable = true,
  sortable = true,
  compact = false,
  maxHeight = '400px',
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  
  // Auto-extract options
  autoExtractCategories = true,
  autoExtractStatuses = true,
  categoryKey = 'category',
  statusKey = 'status',
  dateKey = 'dateAdded',
  
  // Controlled mode props
  searchTerm,
  selectedCategory,
  selectedStatus,
  selectedDateRange,
  sortOption,
  categories,
  statusOptions,
  dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last90days', label: 'Last 90 days' },
    { value: 'thisyear', label: 'This year' },
  ],
  sortOptions = [],
  onSearch = () => {},
  onFilter = () => {},
  onStatusFilter = () => {},
  onDateFilter = () => {},
  onSort = () => {},
  onFilteredDataChange,
}: TableProps<T>) {
  // Determine if component is in controlled mode
  const isControlled = searchTerm !== undefined || selectedCategory !== undefined || 
                      selectedStatus !== undefined || selectedDateRange !== undefined;

  // Internal state for uncontrolled mode
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [internalSelectedCategory, setInternalSelectedCategory] = useState('');
  const [internalSelectedStatus, setInternalSelectedStatus] = useState('');
  const [internalSelectedDateRange, setInternalSelectedDateRange] = useState('');
  const [sortBy, setSortBy] = useState(sortOption || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Auto-extract categories from data
  const autoCategories = useMemo(() => {
    if (!autoExtractCategories || !filterable) return [];
    const categorySet = new Set<string>();
    data.forEach(item => {
      const categoryValue = item[categoryKey];
      if (categoryValue && typeof categoryValue === 'string') {
        categorySet.add(categoryValue);
      }
    });
    return Array.from(categorySet).sort();
  }, [data, autoExtractCategories, filterable, categoryKey]);

  // Auto-extract status options from data
  const autoStatusOptions = useMemo(() => {
    if (!autoExtractStatuses || !filterable) return [];
    
    // Check if using boolean inStock field
    if (statusKey === 'inStock' || (statusKey === 'status' && data.some(item => typeof item.inStock === 'boolean'))) {
      return ['In Stock', 'Out of Stock'];
    }
    
    // Extract unique status values
    const statusSet = new Set<string>();
    data.forEach(item => {
      const statusValue = item[statusKey];
      if (statusValue && typeof statusValue === 'string') {
        statusSet.add(statusValue);
      }
    });
    return Array.from(statusSet).sort();
  }, [data, autoExtractStatuses, filterable, statusKey]);

  // Use provided options or auto-extracted ones
  const finalCategories = categories || autoCategories;
  const finalStatusOptions = statusOptions || autoStatusOptions;

  // Get current filter values (controlled or uncontrolled)
  const currentSearchTerm = isControlled ? (searchTerm || '') : internalSearchTerm;
  const currentSelectedCategory = isControlled ? (selectedCategory || '') : internalSelectedCategory;
  const currentSelectedStatus = isControlled ? (selectedStatus || '') : internalSelectedStatus;
  const currentSelectedDateRange = isControlled ? (selectedDateRange || '') : internalSelectedDateRange;

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (currentSearchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(currentSearchTerm.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (currentSelectedCategory && currentSelectedCategory !== '') {
      filtered = filtered.filter(item =>
        item[categoryKey] === currentSelectedCategory
      );
    }

    // Apply status filter
    if (currentSelectedStatus && currentSelectedStatus !== '') {
      if (statusKey === 'inStock' || (statusKey === 'status' && typeof filtered[0]?.inStock === 'boolean')) {
        if (currentSelectedStatus === 'In Stock') {
          filtered = filtered.filter(item => item.inStock === true);
        } else if (currentSelectedStatus === 'Out of Stock') {
          filtered = filtered.filter(item => item.inStock === false);
        }
      } else {
        filtered = filtered.filter(item => item[statusKey] === currentSelectedStatus);
      }
    }

    // Apply date range filter
    if (currentSelectedDateRange && currentSelectedDateRange !== '') {
      const now = new Date();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item[dateKey] || item.orderDate || item.dateAdded);
        
        switch (currentSelectedDateRange) {
          case 'last7days':
            const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return itemDate >= last7Days;
          case 'last30days':
            const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return itemDate >= last30Days;
          case 'last90days':
            const last90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return itemDate >= last90Days;
          case 'thisyear':
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            return itemDate >= startOfYear;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    const currentSortOption = sortOption || sortBy;
    if (currentSortOption && sortable) {
      filtered.sort((a, b) => {
        const aValue = a[currentSortOption];
        const bValue = b[currentSortOption];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        return sortDirection === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return filtered;
  }, [data, currentSearchTerm, currentSelectedCategory, currentSelectedStatus, currentSelectedDateRange, sortOption, sortBy, sortDirection, sortable, categoryKey, statusKey, dateKey]);

  // Notify parent of filtered data changes
  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredData, data);
    }
  }, [filteredData, data, onFilteredDataChange]);

  const handleSearch = (term: string) => {
    if (isControlled) {
      onSearch(term);
    } else {
      setInternalSearchTerm(term);
    }
  };

  const handleFilter = (category: string) => {
    if (isControlled) {
      onFilter(category);
    } else {
      setInternalSelectedCategory(category);
    }
  };

  const handleStatusFilter = (status: string) => {
    if (isControlled) {
      onStatusFilter(status);
    } else {
      setInternalSelectedStatus(status);
    }
  };

  const handleDateFilter = (dateRange: string) => {
    if (isControlled) {
      onDateFilter(dateRange);
    } else {
      setInternalSelectedDateRange(dateRange);
    }
  };

  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    if (sortBy === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortDirection('asc');
    }
    
    if (isControlled) {
      onSort(columnKey);
    }
  };

  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    const value = record[column.key];
    if (column.render) {
      return column.render(value, record, index);
    }
    return value;
  };

  const renderActions = (record: T) => {
    if (!actions.length) return null;
    
    return (
      <div className={styles.actions}>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(record);
            }}
            disabled={action.disabled ? action.disabled(record) : false}
            className={`${styles.actionButton} ${styles[action.variant || 'secondary']}`}
            title={action.label}
          >
            {action.icon && <span className={styles.actionIcon}>{action.icon}</span>}
            <span className={styles.actionLabel}>{action.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`${styles.tableContainer} ${compact ? styles.compact : ''} ${className}`}>
      {/* Search and Filter Controls */}
      {(searchable || filterable) && (
        <div className={styles.controls}>
          {searchable && (
            <TableSearch
              searchTerm={currentSearchTerm}
              onSearch={handleSearch}
              placeholder="Search..."
              className={styles.searchControl}
            />
          )}
          {filterable && finalCategories.length > 0 && (
            <TableFilter
              selectedCategory={currentSelectedCategory}
              categories={finalCategories}
              onFilter={handleFilter}
              className={styles.filterControl}
            />
          )}
          {filterable && finalStatusOptions.length > 0 && (
            <TableSelectFilter
              selectedValue={currentSelectedStatus}
              options={finalStatusOptions}
              onFilter={handleStatusFilter}
              className={styles.filterControl}
              placeholder="All Status"
            />
          )}
          {filterable && dateRangeOptions.length > 0 && (
            <TableSelectFilter
              selectedValue={currentSelectedDateRange}
              options={dateRangeOptions}
              onFilter={handleDateFilter}
              className={styles.filterControl}
              placeholder="All Dates"
            />
          )}
        </div>
      )}

      {/* Table */}
      <div 
        className={styles.tableWrapper}
        style={{ maxHeight }}
      >
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Loading...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className={styles.empty}>
            <span>{emptyMessage}</span>
          </div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.header}>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`${styles.headerCell} ${column.align ? styles[column.align] : ''}`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className={`${styles.headerContent} ${column.align ? styles[column.align] : ''}`}>
                      <span>{column.title}</span>
                      {sortable && column.sortable !== false && (
                        <span className={styles.sortIndicator}>
                          {sortBy === column.key ? (
                            sortDirection === 'asc' ? '↑' : '↓'
                          ) : '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className={`${styles.headerCell} ${styles.actionsHeader} ${styles.center}`}>
                    <div className={`${styles.headerContent} ${styles.center}`}>
                      <span>Actions</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record, index) => (
                <tr
                  key={index}
                  className={`${styles.row} ${onRowClick ? styles.clickable : ''}`}
                  onClick={() => onRowClick?.(record)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${styles.cell} ${column.align ? styles[column.align] : ''}`}
                    >
                      {renderCell(column, record, index)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className={`${styles.cell} ${styles.actionsCell}`}>
                      {renderActions(record)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}