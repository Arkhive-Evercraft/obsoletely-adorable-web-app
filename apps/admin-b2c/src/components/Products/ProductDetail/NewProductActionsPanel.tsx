"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BackButton,
  SaveButton, 
  CancelButton 
} from '@/components/Buttons';
import styles from './ProductDetail.module.css';

interface NewProductActionsPanelProps {
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function NewProductActionsPanel({ 
  isSaving, 
  onSave, 
  onCancel 
}: NewProductActionsPanelProps) {
  const router = useRouter();

  const handleBackToProducts = () => {
    router.push('/products');
  };

  return (
    <div className={styles.actionsPanel}>
      <BackButton 
        onClick={handleBackToProducts}
      >
        Back to Products
      </BackButton>

      <div className={styles.editActions}>
        <SaveButton
          onClick={onSave}
          loading={isSaving}
          disabled={isSaving}
        >
          Create Product
        </SaveButton>
        
        <CancelButton
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </CancelButton>
      </div>
    </div>
  );
}