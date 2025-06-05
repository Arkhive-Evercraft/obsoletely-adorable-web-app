"use client"

import React, { useState, useMemo } from 'react';
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
  // Search and filter props
  searchTerm = '',
  selectedCategory = '',
  selectedStatus = '',
  selectedDateRange = '',
  sortOption = '',
  categories = [],
  statusOptions = [],
  dateRangeOptions = [],
  sortOptions = [],
  onSearch = () => {},
  onFilter = () => {},
  onStatusFilter = () => {},
  onDateFilter = () => {},
  onSort = () => {},
}: TableProps<T>) {
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);
  const [internalSelectedCategory, setInternalSelectedCategory] = useState(selectedCategory);
  const [internalSelectedStatus, setInternalSelectedStatus] = useState(selectedStatus);
  const [internalSelectedDateRange, setInternalSelectedDateRange] = useState(selectedDateRange);
  const [sortBy, setSortBy] = useState(sortOption);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    const searchText = searchTerm || internalSearchTerm;
    if (searchText) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Apply category filter
    const categoryFilter = selectedCategory || internalSelectedCategory;
    if (categoryFilter && categoryFilter !== '') {
      filtered = filtered.filter(item =>
        item.category === categoryFilter || item.type === categoryFilter
      );
    }

    // Apply status filter
    const statusFilter = selectedStatus || internalSelectedStatus;
    if (statusFilter && statusFilter !== '') {
      filtered = filtered.filter(item => {
        if (statusFilter === 'In Stock') {
          return item.inStock === true;
        } else if (statusFilter === 'Out of Stock') {
          return item.inStock === false;
        }
        return true;
      });
    }

    // Apply date range filter
    const dateRangeFilter = selectedDateRange || internalSelectedDateRange;
    if (dateRangeFilter && dateRangeFilter !== '') {
      const now = new Date();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.dateAdded);
        
        switch (dateRangeFilter) {
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
  }, [data, searchTerm, internalSearchTerm, selectedCategory, internalSelectedCategory, selectedStatus, internalSelectedStatus, selectedDateRange, internalSelectedDateRange, sortOption, sortBy, sortDirection, sortable]);

  const handleSearch = (term: string) => {
    setInternalSearchTerm(term);
    onSearch(term);
  };

  const handleFilter = (category: string) => {
    setInternalSelectedCategory(category);
    onFilter(category);
  };

  const handleStatusFilter = (status: string) => {
    setInternalSelectedStatus(status);
    onStatusFilter(status);
  };

  const handleDateFilter = (dateRange: string) => {
    setInternalSelectedDateRange(dateRange);
    onDateFilter(dateRange);
  };

  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    if (sortBy === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortDirection('asc');
    }
    onSort(columnKey);
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
              searchTerm={searchTerm || internalSearchTerm}
              onSearch={handleSearch}
              placeholder="Search..."
              className={styles.searchControl}
            />
          )}
          {filterable && categories.length > 0 && (
            <TableFilter
              selectedCategory={selectedCategory || internalSelectedCategory}
              categories={categories}
              onFilter={handleFilter}
              className={styles.filterControl}
            />
          )}
          {filterable && statusOptions.length > 0 && (
            <TableSelectFilter
              selectedValue={selectedStatus || internalSelectedStatus}
              options={statusOptions}
              onFilter={handleStatusFilter}
              className={styles.filterControl}
              placeholder="All Status"
            />
          )}
          {filterable && dateRangeOptions.length > 0 && (
            <TableSelectFilter
              selectedValue={selectedDateRange || internalSelectedDateRange}
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