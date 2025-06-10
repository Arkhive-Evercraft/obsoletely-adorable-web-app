"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { validateAllFields, useFieldValidation } from '@/utils/validation';

interface ProductValidationContextType {
  // Field-level validation errors for products
  validationErrors: Record<string, Record<string, string>>;
  
  // Validate a single field for a specific product
  validateField: (productId: string, fieldName: string, value: any) => boolean;
  
  // Clear error for a specific field
  clearFieldError: (productId: string, fieldName: string) => void;
  
  // Clear all errors for a specific product
  clearProductErrors: (productId: string) => void;
  
  // Clear all validation errors
  clearAllErrors: () => void;
  
  // Get error for a specific field
  getFieldError: (productId: string, fieldName: string) => string | null;
  
  // Check if product has any errors
  hasProductErrors: (productId: string) => boolean;
  
  // Check if there are any validation errors at all
  hasAnyErrors: () => boolean;
  
  // Validate all fields for a product and return whether valid
  validateProduct: (productId: string, data: any) => boolean;
  
  // Validate multiple products (for bulk operations)
  validateProducts: (products: { id: string; data: any }[]) => boolean;
  
  // Set validation errors from external source (like API response)
  setValidationErrors: (errors: Record<string, Record<string, string>>) => void;
}

const ProductValidationContext = createContext<ProductValidationContextType | undefined>(undefined);

interface ProductValidationProviderProps {
  children: ReactNode;
}

export function ProductValidationProvider({ children }: ProductValidationProviderProps) {
  const [validationErrors, setValidationErrorsState] = useState<Record<string, Record<string, string>>>({});
  const { validateSingleField } = useFieldValidation();
  
  const validateField = useCallback((productId: string, fieldName: string, value: any): boolean => {
    console.log(`🔍 ProductValidationContext.validateField: productId=${productId}, field=${fieldName}, value=`, value);
    
    // Don't validate empty values on blur unless it's a required field
    if ((value === '' || value === null || value === undefined)) {
      const requiredFields = ['name', 'description', 'categoryName', 'imageUrl', 'price', 'inventory'];
      
      if (!requiredFields.includes(fieldName)) {
        console.log(`⏭️ ProductValidationContext.validateField: Skipping validation for optional empty field ${fieldName}`);
        return true;
      }
    }
    
    const error = validateSingleField(fieldName, value);
    
    if (error) {
      console.log(`❌ ProductValidationContext.validateField: Setting error for ${productId}.${fieldName}:`, error);
      // Set error
      setValidationErrorsState(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          [fieldName]: typeof error === 'string' ? error : ''
        }
      }));
      return false;
    } else {
      console.log(`✅ ProductValidationContext.validateField: Clearing error for ${productId}.${fieldName}`);
      // Clear error
      setValidationErrorsState(prev => {
        // If product doesn't exist, nothing to clear
        if (!prev[productId]) {
          return prev;
        }
        
        const productErrors = { ...prev[productId] };
        delete productErrors[fieldName];
        
        if (Object.keys(productErrors).length === 0) {
          const { [productId]: removed, ...rest } = prev;
          return rest;
        }
        
        return {
          ...prev,
          [productId]: productErrors
        };
      });
      return true;
    }
  }, [validateSingleField]);
  
  const clearFieldError = useCallback((productId: string, fieldName: string) => {
    setValidationErrorsState(prev => {
      // If product doesn't exist, nothing to clear
      if (!prev[productId]) {
        return prev;
      }
      
      const productErrors = { ...prev[productId] };
      delete productErrors[fieldName];
      
      if (Object.keys(productErrors).length === 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [productId]: productErrors
      };
    });
  }, []);
  
  const clearProductErrors = useCallback((productId: string) => {
    setValidationErrorsState(prev => {
      const { [productId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);
  
  const clearAllErrors = useCallback(() => {
    setValidationErrorsState({});
  }, []);
  
  const getFieldError = useCallback((productId: string, fieldName: string): string | null => {
    return validationErrors[productId]?.[fieldName] || null;
  }, [validationErrors]);
  
  const hasProductErrors = useCallback((productId: string): boolean => {
    return !!(validationErrors[productId] && Object.keys(validationErrors[productId]).length > 0);
  }, [validationErrors]);
  
  const hasAnyErrors = useCallback((): boolean => {
    return Object.keys(validationErrors).some(productId => hasProductErrors(productId));
  }, [validationErrors, hasProductErrors]);
  
  const validateProduct = useCallback((productId: string, data: any): boolean => {
    console.log(`🔍 ProductValidationContext.validateProduct: productId=${productId}`);
    console.log('📋 ProductValidationContext.validateProduct: Raw data received:', JSON.stringify(data, null, 2));
    
    // Create a copy of data and ensure required fields have reasonable defaults
    const dataToValidate = { ...data };
    
    // Product-specific transformations
    dataToValidate.price = typeof data.price === 'string' ? parseFloat(data.price) || 0 : data.price;
    dataToValidate.inventory = typeof data.inventory === 'string' ? parseInt(data.inventory) || 0 : data.inventory;
    dataToValidate.featured = Boolean(data.featured);
    
    console.log('🔄 ProductValidationContext.validateProduct: Data after transformation:', JSON.stringify(dataToValidate, null, 2));
    
    const errors = validateAllFields(dataToValidate);
    
    if (Object.keys(errors).length > 0) {
      console.log(`❌ ProductValidationContext.validateProduct: Validation failed for ${productId}:`, errors);
      setValidationErrorsState(prev => ({
        ...prev,
        [productId]: errors
      }));
      return false;
    } else {
      console.log(`✅ ProductValidationContext.validateProduct: Validation passed for ${productId}`);
      // Clear errors for this product
      clearProductErrors(productId);
      return true;
    }
  }, [clearProductErrors]);
  
  const validateProducts = useCallback((products: { id: string; data: any }[]): boolean => {
    const allErrors: Record<string, Record<string, string>> = {};
    let hasAnyValidationErrors = false;
    
    products.forEach(({ id, data }) => {
      // Clean the data for products
      let cleanedData = { ...data };
      
      // Apply product transformations
      cleanedData.price = typeof data.price === 'string' ? parseFloat(data.price) || 0 : data.price;
      cleanedData.inventory = typeof data.inventory === 'string' ? parseInt(data.inventory) || 0 : data.inventory;
      cleanedData.featured = Boolean(data.featured);
      
      const errors = validateAllFields(cleanedData);
      if (Object.keys(errors).length > 0) {
        allErrors[id] = errors;
        hasAnyValidationErrors = true;
      }
    });
    
    if (hasAnyValidationErrors) {
      setValidationErrorsState(prev => ({
        ...prev,
        ...allErrors
      }));
      return false;
    } else {
      // Clear errors for all validated products
      setValidationErrorsState(prev => {
        const updated = { ...prev };
        products.forEach(({ id }) => {
          delete updated[id];
        });
        return updated;
      });
      return true;
    }
  }, []);
  
  const setValidationErrors = useCallback((errors: Record<string, Record<string, string>>) => {
    setValidationErrorsState(errors);
  }, []);
  
  const value: ProductValidationContextType = {
    validationErrors,
    validateField,
    clearFieldError,
    clearProductErrors,
    clearAllErrors,
    getFieldError,
    hasProductErrors,
    hasAnyErrors,
    validateProduct,
    validateProducts,
    setValidationErrors
  };
  
  return (
    <ProductValidationContext.Provider value={value}>
      {children}
    </ProductValidationContext.Provider>
  );
}

export function useProductValidation(): ProductValidationContextType {
  const context = useContext(ProductValidationContext);
  if (context === undefined) {
    throw new Error('useProductValidation must be used within a ProductValidationProvider');
  }
  return context;
}