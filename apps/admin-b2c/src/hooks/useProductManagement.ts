import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryName: string;
  inStock: boolean;
  inventory: number;
  dateAdded: string;
  lastUpdated: string;
}

export function useProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProducts, setEditedProducts] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Transform API response to match the admin interface
      const transformedProducts = data.map((product: any) => ({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        description: product.description || '',
        imageUrl: product.imageUrl,
        categoryName: product.categoryName,
        inStock: product.inStock,
        inventory: Math.floor(Math.random() * 50) + 1,
        dateAdded: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
      
      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const hasProductChanged = (original: Product, edited: Product): boolean => {
    return (
      original.name !== edited.name ||
      original.price !== edited.price ||
      original.description !== edited.description ||
      original.categoryName !== edited.categoryName ||
      original.inStock !== edited.inStock ||
      original.imageUrl !== edited.imageUrl
    );
  };

  const handleQuickEdit = () => {
    if (isEditing) {
      handleSaveChanges();
    } else {
      setIsEditing(true);
      setEditedProducts([...products]);
    }
  };

  const handleProductUpdate = (updatedProducts: Product[]) => {
    setEditedProducts(updatedProducts);
  };

  const handleSaveChanges = async () => {
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
              inStock: editedProduct.inStock,
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
      
      console.log('Products updated successfully');
      
    } catch (error) {
      console.error('Error saving products:', error);
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProducts([]);
  };

  const handleFilteredDataChange = (filtered: Product[], original: Product[]) => {
    setFilteredProducts(filtered);
  };

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