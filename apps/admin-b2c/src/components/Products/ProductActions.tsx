"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  EditSaveButton, 
  CancelButton, 
  AddButton, 
  ManageCategoriesButton 
} from '@/components/Buttons';

interface ProductActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddNewProduct: () => void;
  onManageCategories?: () => void;
}

export function ProductActions({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
  onAddNewProduct,
  onManageCategories
}: ProductActionsProps) {
  const router = useRouter();
  
  // Direct navigation function with debugging
  const navigateToCategories = () => {
    console.log('Navigating to categories page...');
    router.push('/categories');
  };
  
  return (
    <div className="flex flex-col gap-3 p-4">
      <EditSaveButton
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={onEdit}
        onSave={onSave}
        fullWidth
      />
      
      {isEditing && (
        <CancelButton
          onClick={onCancel}
          disabled={isSaving}
          fullWidth
        />
      )}
      
      {!isEditing && (
        <>
          {/* Use direct navigation function */}
          <ManageCategoriesButton
            onClick={navigateToCategories}
            fullWidth
          />
          
          <AddButton
            onClick={onAddNewProduct}
            fullWidth
          />
        </>
      )}
    </div>
  );
}