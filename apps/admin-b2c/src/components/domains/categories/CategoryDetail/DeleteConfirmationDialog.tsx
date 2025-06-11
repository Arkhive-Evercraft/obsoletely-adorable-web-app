"use client";

import React from 'react';

interface DeleteConfirmationDialogProps {
  categoryName: string;
  productCount?: number;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  categoryName,
  productCount,
  isDeleting,
  onConfirm,
  onCancel
}: DeleteConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">
          Are you sure you want to delete the <strong>{categoryName}</strong> category? This action cannot be undone.
        </p>
        {productCount && productCount > 0 ? (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
            <strong>Warning:</strong> This category has {productCount} associated products.
            You cannot delete a category with products. Please reassign or delete the products first.
          </div>
        ) : null}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={isDeleting || (!!productCount && productCount > 0)}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
