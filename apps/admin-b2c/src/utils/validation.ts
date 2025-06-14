import { z } from 'zod';
import { useState, useCallback } from 'react';

// Product validation schema
export const productSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    })
    .optional(),
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .trim(),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
      }
      return val;
    })
    .pipe(z.number().min(1, 'Price must be at least $0.01').max(99999999, 'Price must not exceed $999,999.99')),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .trim(),
  imageUrl: z
    .string()
    .min(1, 'Product image is required')
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
  categoryName: z
    .string()
    .min(1, 'Category is required')
    .trim(),
  inventory: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? 0 : parsed;
      }
      return val;
    })
    .pipe(z.number().int('Inventory must be a whole number').min(0, 'Inventory cannot be negative').max(999999, 'Inventory must not exceed 999,999')),
  featured: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        return val === 'true' || val === '1' || val === 'on';
      }
      return Boolean(val);
    }),
});

// Type for the product form data
export type ProductFormData = z.infer<typeof productSchema>;

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
}

// Function to validate product data and return formatted errors
export function validateProduct(data: any): {
  success: boolean;
  errors: ValidationError[];
  data?: ProductFormData;
} {
  console.log('🔍 validateProduct called with data:', JSON.stringify(data, null, 2));
  
  try {
    const validData = productSchema.parse(data);
    console.log('✅ validateProduct: Validation successful');
    return {
      success: true,
      errors: [],
      data: validData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('❌ validateProduct: Zod validation errors:', error.issues);
      const errors = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      console.log('❌ validateProduct: Formatted errors:', errors);
      return {
        success: false,
        errors,
      };
    }
    console.log('❌ validateProduct: Non-Zod error:', error);
    return {
      success: false,
      errors: [{ field: 'general', message: 'Validation failed' }],
    };
  }
}

// Hook for managing field-level validation state - products only
export function useFieldValidation() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateSingleField = useCallback((fieldName: string, value: any): string | null => {
    console.log(`🔍 validateSingleField: ${fieldName} =`, value, `(type: ${typeof value})`);
    
    try {
      // Handle empty values for required fields
      if (value === '' || value === null || value === undefined) {
        // Product required fields
        if (['name', 'description', 'imageUrl', 'categoryName'].includes(fieldName)) {
          const errorMsg = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
          console.log(`❌ validateSingleField: ${fieldName} is empty and required for product:`, errorMsg);
          return errorMsg;
        }
        if (['price', 'inventory'].includes(fieldName)) {
          const errorMsg = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
          console.log(`❌ validateSingleField: ${fieldName} is empty and required for product:`, errorMsg);
          return errorMsg;
        }
      }

      // Use the product schema
      const fieldSchema = productSchema.shape[fieldName as keyof typeof productSchema.shape];
      
      if (!fieldSchema) {
        console.log(`⚠️ validateSingleField: Field ${fieldName} not found in product schema`);
        return null; // Field doesn't exist in this schema, so it's valid
      }
      
      fieldSchema.parse(value);
      console.log(`✅ validateSingleField: ${fieldName} validation passed for product`);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMsg = error.issues[0]?.message || 'Invalid value';
        console.log(`❌ validateSingleField: ${fieldName} validation failed for product:`, errorMsg, 'Issues:', error.issues);
        return errorMsg;
      }
      console.log(`❌ validateSingleField: ${fieldName} non-Zod error for product:`, error);
      return 'Invalid value';
    }
  }, []);

  const setFieldError = useCallback((fieldName: string, error: string | null) => {
    setFieldErrors(prev => {
      if (error === null) {
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [fieldName]: error };
    });
  }, []);

  const validateField = useCallback((fieldName: string, value: any) => {
    const error = validateSingleField(fieldName, value);
    setFieldError(fieldName, error);
    return error === null;
  }, [validateSingleField, setFieldError]);

  const clearFieldError = useCallback((fieldName: string) => {
    setFieldError(fieldName, null);
  }, [setFieldError]);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const hasErrors = Object.keys(fieldErrors).length > 0;
  const getFieldError = useCallback((fieldName: string) => fieldErrors[fieldName] || null, [fieldErrors]);

  return {
    fieldErrors,
    validateField,
    clearFieldError,
    clearAllErrors,
    hasErrors,
    getFieldError,
    setFieldError,
    validateSingleField
  };
}

// Utility function to validate all product fields at once
export function validateAllFields(data: any): Record<string, string> {
  console.log('🔍 validateAllFields called with data:', JSON.stringify(data, null, 2));
  
  const result = validateProduct(data);
  const errorMap: Record<string, string> = {};
  
  if (!result.success) {
    result.errors.forEach(error => {
      errorMap[error.field] = error.message;
    });
    console.log('❌ validateAllFields: Error map:', errorMap);
  } else {
    console.log('✅ validateAllFields: All validation passed');
  }
  
  return errorMap;
}