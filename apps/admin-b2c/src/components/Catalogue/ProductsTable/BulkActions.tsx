import React from 'react';
import styles from '../ProductsTable.module.css';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onMarkInStock: () => void;
  onMarkOutOfStock: () => void;
}

export function BulkActions({
  selectedCount,
  onDelete,
  onMarkInStock,
  onMarkOutOfStock
}: BulkActionsProps) {
  return (
    <div className={styles.bulkActions}>
      <span className={styles.selectedCount}>{selectedCount} items selected</span>
      <div className={styles.bulkButtons}>
        <button
          className={`${styles.bulkButton} ${styles.bulkButtonDelete}`}
          onClick={onDelete}
        >
          Delete
        </button>
        <button
          className={styles.bulkButton}
          onClick={onMarkInStock}
        >
          Mark In Stock
        </button>
        <button
          className={styles.bulkButton}
          onClick={onMarkOutOfStock}
        >
          Mark Out of Stock
        </button>
      </div>
    </div>
  );
}