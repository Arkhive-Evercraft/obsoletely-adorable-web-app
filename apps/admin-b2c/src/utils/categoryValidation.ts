import { z } from 'zod';
import { useState, useCallback } from 'react';

// Category validation schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .min(3, 'Category name must be at least 3 characters')
    .max(50, 'Category name must not exceed 50 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must not exceed 100 characters')
    .trim(),
  imageUrl: z
    .string()
    .min(1, 'Category image is required')
    .refine((url) => {
      // Allow various URL formats: http/https URLs, data URLs, blob URLs, or relative paths
      return (
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('data:image/') ||
        url.startsWith('blob:') ||
        url.startsWith('/') ||
        url.includes('.')
      );
    }, 'Please provide a valid image URL or file'),
});

// Type for the category form data
export type CategoryFormData = z.infer<typeof categorySchema>;

// Validation error type
export interface CategoryValidationError {
  field: string;
  message: string;
}

// Function to validate category data and return formatted errors
export function validateCategory(data: any): {
  success: boolean;
  errors: CategoryValidationError[];
  data?: CategoryFormData;
} {
  console.log('🔍 validateCategory called with data:', JSON.stringify(data, null, 2));
  
  try {
    const validData = categorySchema.parse(data);
    console.log('✅ validateCategory: Validation successful');
    return {
      success: true,
      errors: [],
      data: validData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('❌ validateCategory: Zod validation errors:', error.issues);
      const errors = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      console.log('❌ validateCategory: Formatted errors:', errors);
      return {
        success: false,
        errors,
      };
    }
    console.log('❌ validateCategory: Non-Zod error:', error);
    return {
      success: false,
      errors: [{ field: 'general', message: 'Validation failed' }],
    };
  }
}

// Validate a single category field
export function validateCategoryField(fieldName: string, value: any): string | null {
  console.log(`🔍 validateCategoryField: ${fieldName} =`, value, `(type: ${typeof value})`);
  
  try {
    // Handle empty values for required fields
    if (value === '' || value === null || value === undefined) {
      if (['name', 'description', 'imageUrl'].includes(fieldName)) {
        const errorMsg = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        console.log(`❌ validateCategoryField: ${fieldName} is empty and required:`, errorMsg);
        return errorMsg;
      }
    }

    // Get the field schema
    const fieldSchema = categorySchema.shape[fieldName as keyof typeof categorySchema.shape];
    
    if (!fieldSchema) {
      console.log(`⚠️ validateCategoryField: Field ${fieldName} not found in category schema`);
      return null; // Field doesn't exist in this schema, so it's valid
    }
    
    fieldSchema.parse(value);
    console.log(`✅ validateCategoryField: ${fieldName} validation passed`);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMsg = error.issues[0]?.message || 'Invalid value';
      console.log(`❌ validateCategoryField: ${fieldName} validation failed:`, errorMsg, 'Issues:', error.issues);
      return errorMsg;
    }
    console.log(`❌ validateCategoryField: ${fieldName} non-Zod error:`, error);
    return 'Invalid value';
  }
}

// Validate all category fields at once and return error map
export function validateAllCategoryFields(data: any): Record<string, string> {
  console.log('🔍 validateAllCategoryFields called with data:', JSON.stringify(data, null, 2));
  
  // Clean the data to only include category fields
  const cleanedData = {
    name: data.name,
    description: data.description,
    imageUrl: data.imageUrl
  };
  
  const result = validateCategory(cleanedData);
  const errorMap: Record<string, string> = {};
  
  if (!result.success) {
    result.errors.forEach(error => {
      errorMap[error.field] = error.message;
    });
    console.log('❌ validateAllCategoryFields: Error map:', errorMap);
  } else {
    console.log('✅ validateAllCategoryFields: All validation passed');
  }
  
  return errorMap;
}

// Hook for managing category validation state
export function useCategoryValidation() {
  const [validationErrors, setValidationErrors] = useState<Record<string, Record<string, string>>>({});

  const validateField = useCallback((categoryName: string, fieldName: string, value: any): boolean => {
    console.log(`🔍 useCategoryValidation.validateField: categoryName=${categoryName}, field=${fieldName}, value=`, value);
    
    const error = validateCategoryField(fieldName, value);
    
    if (error) {
      console.log(`❌ useCategoryValidation.validateField: Setting error for ${categoryName}.${fieldName}:`, error);
      setValidationErrors(prev => ({
        ...prev,
        [categoryName]: {
          ...prev[categoryName],
          [fieldName]: error
        }
      }));
      return false;
    } else {
      console.log(`✅ useCategoryValidation.validateField: Clearing error for ${categoryName}.${fieldName}`);
      setValidationErrors(prev => {
        if (!prev[categoryName]) {
          return prev;
        }
        
        const categoryErrors = { ...prev[categoryName] };
        delete categoryErrors[fieldName];
        
        if (Object.keys(categoryErrors).length === 0) {
          const { [categoryName]: removed, ...rest } = prev;
          return rest;
        }
        
        return {
          ...prev,
          [categoryName]: categoryErrors
        };
      });
      return true;
    }
  }, []);

  const validateCategory = useCallback((categoryName: string, data: any): boolean => {
    console.log(`🔍 useCategoryValidation.validateCategory: categoryName=${categoryName}`);
    
    const errors = validateAllCategoryFields(data);
    
    if (Object.keys(errors).length > 0) {
      console.log(`❌ useCategoryValidation.validateCategory: Validation failed for ${categoryName}:`, errors);
      setValidationErrors(prev => ({
        ...prev,
        [categoryName]: errors
      }));
      return false;
    } else {
      console.log(`✅ useCategoryValidation.validateCategory: Validation passed for ${categoryName}`);
      setValidationErrors(prev => {
        const { [categoryName]: removed, ...rest } = prev;
        return rest;
      });
      return true;
    }
  }, []);

  const validateCategories = useCallback((categories: { name: string; data: any }[]): boolean => {
    const allErrors: Record<string, Record<string, string>> = {};
    let hasAnyValidationErrors = false;
    
    categories.forEach(({ name, data }) => {
      const errors = validateAllCategoryFields(data);
      if (Object.keys(errors).length > 0) {
        allErrors[name] = errors;
        hasAnyValidationErrors = true;
      }
    });
    
    if (hasAnyValidationErrors) {
      setValidationErrors(prev => ({
        ...prev,
        ...allErrors
      }));
      return false;
    } else {
      // Clear errors for all validated categories
      setValidationErrors(prev => {
        const updated = { ...prev };
        categories.forEach(({ name }) => {
          delete updated[name];
        });
        return updated;
      });
      return true;
    }
  }, []);

  const clearFieldError = useCallback((categoryName: string, fieldName: string) => {
    setValidationErrors(prev => {
      if (!prev[categoryName]) {
        return prev;
      }
      
      const categoryErrors = { ...prev[categoryName] };
      delete categoryErrors[fieldName];
      
      if (Object.keys(categoryErrors).length === 0) {
        const { [categoryName]: removed, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [categoryName]: categoryErrors
      };
    });
  }, []);

  const clearCategoryErrors = useCallback((categoryName: string) => {
    setValidationErrors(prev => {
      const { [categoryName]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const getFieldError = useCallback((categoryName: string, fieldName: string): string | null => {
    return validationErrors[categoryName]?.[fieldName] || null;
  }, [validationErrors]);

  const hasCategoryErrors = useCallback((categoryName: string): boolean => {
    return !!(validationErrors[categoryName] && Object.keys(validationErrors[categoryName]).length > 0);
  }, [validationErrors]);

  const hasAnyErrors = useCallback((): boolean => {
    return Object.keys(validationErrors).some(categoryName => hasCategoryErrors(categoryName));
  }, [validationErrors, hasCategoryErrors]);

  return {
    validationErrors,
    validateField,
    validateCategory,
    validateCategories,
    clearFieldError,
    clearCategoryErrors,
    clearAllErrors,
    getFieldError,
    hasCategoryErrors,
    hasAnyErrors
  };
}