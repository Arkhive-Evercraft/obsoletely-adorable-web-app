import { useState, useEffect, useCallback } from 'react';
import { useAppData } from '@/components/AppDataProvider';
import { useValidation } from '@/contexts/ValidationContext';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryName: string;
  featured: boolean;
  inventory: number;
  dateAdded: string;
  lastUpdated: string;
}

export function useProductManagement() {
  const { products: appProducts, productsLoading, refreshProducts } = useAppData();
  const { validateEntities, hasAnyErrors, clearAllErrors } = useValidation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProducts, setEditedProducts] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);

  // Transform products from AppDataProvider to match the admin interface format
  useEffect(() => {
    if (!productsLoading && appProducts) {
      try {
        // Transform API response to match the admin interface
        const transformedProducts = appProducts.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          description: product.description || '',
          imageUrl: product.imageUrl || '',
          categoryName: product.categoryName || '',
          featured: Boolean(product.featured),
          inventory: product.inventory || 0,
          dateAdded: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : '',
          lastUpdated: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : ''
        })) as Product[];
        
        setProducts(transformedProducts);
        setOriginalProducts([...transformedProducts]); // Store original state
        setFilteredProducts(transformedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error processing products data:', error);
        setError('Failed to process products data');
        setLoading(false);
      }
    }
  }, [appProducts, productsLoading]);

  const hasProductChanged = useCallback((original: Product, edited: Product): boolean => {
    return (
      original.name !== edited.name ||
      original.price !== edited.price ||
      original.description !== edited.description ||
      original.categoryName !== edited.categoryName ||
      original.featured !== edited.featured ||
      original.imageUrl !== edited.imageUrl ||
      original.inventory !== edited.inventory
    );
  }, []);

  const handleSaveChanges = useCallback(async () => {
    console.log('Save button clicked - starting save process');
    setIsSaving(true);
    
    // Validate all edited products using the context
    const entities = editedProducts.map(product => ({ id: product.id, data: product }));
    const isValid = validateEntities(entities);
    
    if (!isValid) {
      console.log('Validation failed, not saving');
      setIsSaving(false);
      return; // Don't save if there are validation errors
    }
    
    try {
      // For now, simulate a save operation since the API endpoint doesn't exist
      console.log('Simulating save operation...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the products state with the edited values
      setProducts([...editedProducts]);
      setOriginalProducts([...editedProducts]); // Update original state too
      setFilteredProducts([...editedProducts]);
      setIsEditing(false);
      setEditedProducts([]);
      clearAllErrors(); // Clear all validation errors
      
      console.log('Products updated successfully (simulated)');
      
      // TODO: Replace this simulation with actual API calls when endpoints are available
      // Example of what the real API call would look like:
      /*
      for (const editedProduct of editedProducts) {
        const originalProduct = originalProducts.find(p => p.id === editedProduct.id);
        
        if (originalProduct && hasProductChanged(originalProduct, editedProduct)) {
          const response = await fetch(`/api/products/${editedProduct.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: editedProduct.name,
              price: editedProduct.price,
              description: editedProduct.description,
              categoryName: editedProduct.categoryName,
              featured: editedProduct.featured,
              inventory: editedProduct.inventory,
              imageUrl: editedProduct.imageUrl
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to update product ${editedProduct.name}`);
          }
        }
      }
      */
      
    } catch (error) {
      console.error('Error saving products:', error);
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [editedProducts, originalProducts, hasProductChanged, validateEntities, clearAllErrors]);

  const handleCancelEdit = useCallback(() => {
    console.log('Cancel button clicked - resetting to original values');
    setIsEditing(false);
    setEditedProducts([]);
    
    // Reset products back to original values
    setProducts([...originalProducts]);
    setFilteredProducts([...originalProducts]);
    
    clearAllErrors(); // Clear validation errors when canceling
  }, [originalProducts, clearAllErrors]);

  const handleQuickEdit = useCallback(() => {
    if (isEditing) {
      handleSaveChanges();
    } else {
      console.log('Starting edit mode');
      setIsEditing(true);
      setEditedProducts([...products]);
    }
  }, [isEditing, handleSaveChanges, products]);

  const handleProductUpdate = useCallback((updatedProducts: Product[]) => {
    setEditedProducts(updatedProducts);
  }, []);

  const handleFilteredDataChange = useCallback((filtered: Product[], original: Product[]) => {
    setFilteredProducts(prevFiltered => {
      // Only update if the filtered data has actually changed
      if (prevFiltered.length !== filtered.length || 
          !prevFiltered.every((item, index) => item.id === filtered[index]?.id)) {
        return filtered;
      }
      return prevFiltered;
    });
  }, []);

  return {
    products,
    loading,
    error,
    filteredProducts,
    isEditing,
    isSaving,
    handleQuickEdit,
    handleProductUpdate,
    handleSaveChanges,
    handleCancelEdit,
    handleFilteredDataChange,
    setError
  };
}