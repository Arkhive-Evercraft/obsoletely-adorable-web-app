"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { validateAllFields, useFieldValidation } from '@/utils/validation';

interface ValidationContextType {
  // Field-level validation errors for all entities
  validationErrors: Record<string, Record<string, string>>;
  
  // Validate a single field for a specific entity (product)
  validateField: (entityId: string, fieldName: string, value: any) => boolean;
  
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
  validateEntity: (entityId: string, data: any) => boolean;
  
  // Validate multiple entities (for bulk operations)
  validateEntities: (entities: { id: string; data: any }[]) => boolean;
  
  // Set validation errors from external source (like API response)
  setValidationErrors: (errors: Record<string, Record<string, string>>) => void;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

interface ValidationProviderProps {
  children: ReactNode;
}

export function ValidationProvider({ children }: ValidationProviderProps) {
  const [validationErrors, setValidationErrorsState] = useState<Record<string, Record<string, string>>>({});
  const { validateField: validateSingleField } = useFieldValidation();
  
  const validateField = useCallback((entityId: string, fieldName: string, value: any): boolean => {
    console.log(`🔍 ValidationContext.validateField: entityId=${entityId}, field=${fieldName}, value=`, value);
    
    // Don't validate empty values on blur unless it's a required field
    if ((value === '' || value === null || value === undefined) && 
        !['name', 'description', 'categoryName'].includes(fieldName)) {
      console.log(`⏭️ ValidationContext.validateField: Skipping validation for optional empty field ${fieldName}`);
      return true;
    }
    
    const error = validateSingleField(fieldName as any, value);
    
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
  
  const validateEntity = useCallback((entityId: string, data: any): boolean => {
    console.log(`🔍 ValidationContext.validateEntity: entityId=${entityId}`);
    console.log('📋 ValidationContext.validateEntity: Raw data received:', JSON.stringify(data, null, 2));
    
    // Create a copy of data and ensure required fields have reasonable defaults
    const dataToValidate = {
      ...data,
      // Ensure price is a number (convert from string if needed)
      price: typeof data.price === 'string' ? parseFloat(data.price) || 0 : data.price,
      // Ensure inventory is a number
      inventory: typeof data.inventory === 'string' ? parseInt(data.inventory) || 0 : data.inventory,
      // Ensure featured is boolean
      featured: Boolean(data.featured),
    };
    
    console.log('🔄 ValidationContext.validateEntity: Data after transformation:', JSON.stringify(dataToValidate, null, 2));
    
    const errors = validateAllFields(dataToValidate);
    
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
  
  const validateEntities = useCallback((entities: { id: string; data: any }[]): boolean => {
    const allErrors: Record<string, Record<string, string>> = {};
    let hasAnyValidationErrors = false;
    
    entities.forEach(({ id, data }) => {
      const errors = validateAllFields(data);
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