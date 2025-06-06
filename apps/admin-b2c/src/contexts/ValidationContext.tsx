"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { validateAllFields, validateAllCategoryFields, useFieldValidation } from '@/utils/validation';

interface ValidationContextType {
  // Field-level validation errors for all entities
  validationErrors: Record<string, Record<string, string>>;
  
  // Validate a single field for a specific entity (product or category)
  validateField: (entityId: string, fieldName: string, value: any, entityType?: 'product' | 'category') => boolean;
  
  // Clear error for a specific field
  clearFieldError: (entityId: string, fieldName: string) => void;
  
  // Clear all errors for a specific entity
  clearEntityErrors: (entityId: string) => void;
  
  // Clear all validation errors
  clearAllErrors: () => void;
  
  // Get error for a specific field
  getFieldError: (entityId: string, fieldName: string) => string | null;
  
  // Check if entity has any errors
  hasEntityErrors: (entityId: string) => boolean;
  
  // Check if there are any validation errors at all
  hasAnyErrors: () => boolean;
  
  // Validate all fields for an entity and return whether valid
  validateEntity: (entityId: string, data: any, entityType?: 'product' | 'category') => boolean;
  
  // Validate multiple entities (for bulk operations)
  validateEntities: (entities: { id: string; data: any; type?: 'product' | 'category' }[]) => boolean;
  
  // Set validation errors from external source (like API response)
  setValidationErrors: (errors: Record<string, Record<string, string>>) => void;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

interface ValidationProviderProps {
  children: ReactNode;
}

export function ValidationProvider({ children }: ValidationProviderProps) {
  const [validationErrors, setValidationErrorsState] = useState<Record<string, Record<string, string>>>({});
  const { validateSingleField } = useFieldValidation();
  
  const validateField = useCallback((entityId: string, fieldName: string, value: any, entityType: 'product' | 'category' = 'product'): boolean => {
    console.log(`🔍 ValidationContext.validateField: entityId=${entityId}, field=${fieldName}, value=`, value, `entityType=${entityType}`);
    
    // Don't validate empty values on blur unless it's a required field based on entity type
    if ((value === '' || value === null || value === undefined)) {
      const requiredFields = entityType === 'category' 
        ? ['name', 'description', 'imageUrl']
        : ['name', 'description', 'categoryName', 'imageUrl', 'price', 'inventory'];
      
      if (!requiredFields.includes(fieldName)) {
        console.log(`⏭️ ValidationContext.validateField: Skipping validation for optional empty field ${fieldName} in ${entityType}`);
        return true;
      }
    }
    
    // Ensure we pass the correct entityType to validateSingleField
    const error = validateSingleField(fieldName, value, entityType);
    
    if (error) {
      console.log(`❌ ValidationContext.validateField: Setting error for ${entityId}.${fieldName}:`, error);
      // Set error
      setValidationErrorsState(prev => ({
        ...prev,
        [entityId]: {
          ...prev[entityId],
          [fieldName]: typeof error === 'string' ? error : ''
        }
      }));
      return false;
    } else {
      console.log(`✅ ValidationContext.validateField: Clearing error for ${entityId}.${fieldName}`);
      // Clear error - fix: check if entityId exists in prev
      setValidationErrorsState(prev => {
        // If entity doesn't exist, nothing to clear
        if (!prev[entityId]) {
          return prev;
        }
        
        const entityErrors = { ...prev[entityId] };
        delete entityErrors[fieldName];
        
        if (Object.keys(entityErrors).length === 0) {
          const { [entityId]: removed, ...rest } = prev;
          return rest;
        }
        
        return {
          ...prev,
          [entityId]: entityErrors
        };
      });
      return true;
    }
  }, [validateSingleField]);
  
  const clearFieldError = useCallback((entityId: string, fieldName: string) => {
    setValidationErrorsState(prev => {
      // If entity doesn't exist, nothing to clear
      if (!prev[entityId]) {
        return prev;
      }
      
      const entityErrors = { ...prev[entityId] };
      delete entityErrors[fieldName];
      
      if (Object.keys(entityErrors).length === 0) {
        const { [entityId]: removed, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [entityId]: entityErrors
      };
    });
  }, []);
  
  const clearEntityErrors = useCallback((entityId: string) => {
    setValidationErrorsState(prev => {
      const { [entityId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);
  
  const clearAllErrors = useCallback(() => {
    setValidationErrorsState({});
  }, []);
  
  const getFieldError = useCallback((entityId: string, fieldName: string): string | null => {
    return validationErrors[entityId]?.[fieldName] || null;
  }, [validationErrors]);
  
  const hasEntityErrors = useCallback((entityId: string): boolean => {
    return !!(validationErrors[entityId] && Object.keys(validationErrors[entityId]).length > 0);
  }, [validationErrors]);
  
  const hasAnyErrors = useCallback((): boolean => {
    return Object.keys(validationErrors).some(entityId => hasEntityErrors(entityId));
  }, [validationErrors, hasEntityErrors]);
  
  const validateEntity = useCallback((entityId: string, data: any, entityType: 'product' | 'category' = 'product'): boolean => {
    console.log(`🔍 ValidationContext.validateEntity: entityId=${entityId}, entityType=${entityType}`);
    console.log('📋 ValidationContext.validateEntity: Raw data received:', JSON.stringify(data, null, 2));
    
    // Create a copy of data and ensure required fields have reasonable defaults
    const dataToValidate = { ...data };
    
    if (entityType === 'product') {
      // Product-specific transformations
      dataToValidate.price = typeof data.price === 'string' ? parseFloat(data.price) || 0 : data.price;
      dataToValidate.inventory = typeof data.inventory === 'string' ? parseInt(data.inventory) || 0 : data.inventory;
      dataToValidate.featured = Boolean(data.featured);
    } else if (entityType === 'category') {
      // Category-specific transformations - only keep category fields
      const categoryData = {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl
      };
      Object.assign(dataToValidate, categoryData);
      
      // Remove any non-category fields that might have been included
      delete dataToValidate.items;
      delete dataToValidate.productCount;
      delete dataToValidate.featured;
      delete dataToValidate.price;
      delete dataToValidate.inventory;
      delete dataToValidate.categoryName;
    }
    
    console.log('🔄 ValidationContext.validateEntity: Data after transformation:', JSON.stringify(dataToValidate, null, 2));
    
    const errors = entityType === 'category' ? validateAllCategoryFields(dataToValidate) : validateAllFields(dataToValidate);
    
    if (Object.keys(errors).length > 0) {
      console.log(`❌ ValidationContext.validateEntity: Validation failed for ${entityId}:`, errors);
      setValidationErrorsState(prev => ({
        ...prev,
        [entityId]: errors
      }));
      return false;
    } else {
      console.log(`✅ ValidationContext.validateEntity: Validation passed for ${entityId}`);
      // Clear errors for this entity
      clearEntityErrors(entityId);
      return true;
    }
  }, [clearEntityErrors]);
  
  const validateEntities = useCallback((entities: { id: string; data: any; type?: 'product' | 'category' }[]): boolean => {
    const allErrors: Record<string, Record<string, string>> = {};
    let hasAnyValidationErrors = false;
    
    entities.forEach(({ id, data, type = 'product' }) => {
      // Clean the data based on entity type before validation
      let cleanedData = { ...data };
      
      if (type === 'category') {
        // For categories, only keep category-specific fields
        cleanedData = {
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl
        };
      } else if (type === 'product') {
        // For products, apply any necessary transformations
        cleanedData.price = typeof data.price === 'string' ? parseFloat(data.price) || 0 : data.price;
        cleanedData.inventory = typeof data.inventory === 'string' ? parseInt(data.inventory) || 0 : data.inventory;
        cleanedData.featured = Boolean(data.featured);
      }
      
      const errors = type === 'category' ? validateAllCategoryFields(cleanedData) : validateAllFields(cleanedData);
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
      // Clear errors for all validated entities
      setValidationErrorsState(prev => {
        const updated = { ...prev };
        entities.forEach(({ id }) => {
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
  
  const value: ValidationContextType = {
    validationErrors,
    validateField,
    clearFieldError,
    clearEntityErrors,
    clearAllErrors,
    getFieldError,
    hasEntityErrors,
    hasAnyErrors,
    validateEntity,
    validateEntities,
    setValidationErrors
  };
  
  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
}

export function useValidation(): ValidationContextType {
  const context = useContext(ValidationContext);
  if (context === undefined) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
}