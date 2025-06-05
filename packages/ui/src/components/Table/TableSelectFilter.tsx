import React from 'react';
import { TableSelectFilterProps } from './types';
import styles from './Table.module.css';

export function TableSelectFilter({
  selectedValue,
  options,
  onFilter,
  className = '',
  placeholder = 'All',
  disabled = false
}: TableSelectFilterProps) {
  return (
    <div className={`${styles.filterContainer} ${className}`}>
      <select
        value={selectedValue}
        onChange={(e) => disabled ? undefined : onFilter(e.target.value)}
        className={styles.filterSelect}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          if (typeof option === 'string') {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          } else {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          }
        })}
      </select>
    </div>
  );
}