"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useCategoryValidation } from '@/utils/categoryValidation';

interface CategoryValidationContextType {
  validationErrors: Record<string, Record<string, string>>;
  validateField: (categoryName: string, fieldName: string, value: any) => boolean;
  validateCategory: (categoryName: string, data: any) => boolean;
  validateCategories: (categories: { name: string; data: any }[]) => boolean;
  clearFieldError: (categoryName: string, fieldName: string) => void;
  clearCategoryErrors: (categoryName: string) => void;
  clearAllErrors: () => void;
  getFieldError: (categoryName: string, fieldName: string) => string | null;
  hasCategoryErrors: (categoryName: string) => boolean;
  hasAnyErrors: () => boolean;
}

const CategoryValidationContext = createContext<CategoryValidationContextType | undefined>(undefined);

interface CategoryValidationProviderProps {
  children: ReactNode;
}

export function CategoryValidationProvider({ children }: CategoryValidationProviderProps) {
  const validation = useCategoryValidation();

  return (
    <CategoryValidationContext.Provider value={validation}>
      {children}
    </CategoryValidationContext.Provider>
  );
}

export function useCategoryValidationContext(): CategoryValidationContextType {
  const context = useContext(CategoryValidationContext);
  if (context === undefined) {
    throw new Error('useCategoryValidationContext must be used within a CategoryValidationProvider');
  }
  return context;
}