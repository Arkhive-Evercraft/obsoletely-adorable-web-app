import { useState, useEffect, useCallback } from 'react';
import { useAppData } from '@/components/AppDataProvider';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProducts, setEditedProducts] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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
      original.imageUrl !== edited.imageUrl
    );
  }, []);

  const handleSaveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      for (const editedProduct of editedProducts) {
        const originalProduct = products.find(p => p.id === editedProduct.id);
        
        if (originalProduct && hasProductChanged(originalProduct, editedProduct)) {
          const response = await fetch(`/api/item/${editedProduct.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: editedProduct.name,
              price: Math.round(editedProduct.price * 100),
              description: editedProduct.description,
              categoryName: editedProduct.categoryName,
              inStock: editedProduct.featured,
              imageUrl: editedProduct.imageUrl
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to update product ${editedProduct.name}`);
          }
        }
      }

      setProducts(editedProducts);
      setFilteredProducts(editedProducts);
      setIsEditing(false);
      
      // Refresh products in the AppDataProvider to keep data in sync
      await refreshProducts();
      
      console.log('Products updated successfully');
      
    } catch (error) {
      console.error('Error saving products:', error);
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [editedProducts, products, hasProductChanged, refreshProducts]);

  const handleQuickEdit = useCallback(() => {
    if (isEditing) {
      handleSaveChanges();
    } else {
      setIsEditing(true);
      setEditedProducts([...products]);
    }
  }, [isEditing, handleSaveChanges, products]);

  const handleProductUpdate = useCallback((updatedProducts: Product[]) => {
    setEditedProducts(updatedProducts);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedProducts([]);
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