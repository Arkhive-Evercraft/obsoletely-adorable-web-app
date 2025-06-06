"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  EditSaveButton, 
  CancelButton, 
  AddButton, 
  ManageCategoriesButton,
  DeleteButton 
} from '@/components/Buttons';

interface ProductActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddNewProduct: () => void;
  onManageCategories?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

export function ProductActions({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
  onAddNewProduct,
  onManageCategories,
  onDelete,
  showDelete = false
}: ProductActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Direct navigation function with debugging
  const navigateToCategories = () => {
    console.log('Navigating to categories page...');
    router.push('/categories');
  };

  const handleDelete = () => {
    if (onDelete) {
      setIsDeleting(true);
      onDelete();
    }
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

          {showDelete && (
            <DeleteButton
              onClick={handleDelete}
              disabled={isDeleting}
              fullWidth
            >
              Delete Product
            </DeleteButton>
          )}
        </>
      )}
    </div>
  );
}