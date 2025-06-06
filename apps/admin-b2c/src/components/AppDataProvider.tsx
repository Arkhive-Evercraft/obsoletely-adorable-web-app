"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for our data
interface Category {
  name: string;
  description: string;
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryName: string;
  featured: boolean;
  inventory: number;
  createdAt: string;
  updatedAt: string;
}

interface AppDataContextType {
  categories: Category[];
  products: Product[];
  categoriesLoading: boolean;
  productsLoading: boolean;
  refreshCategories: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

// Create context for app-wide data
const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Hook to use the app data
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};

interface AppDataProviderProps {
  children: React.ReactNode;
}

export function AppDataProvider({ children }: AppDataProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const fetchedCategories = await response.json();
        setCategories(fetchedCategories);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const fetchedProducts = await response.json();
        setProducts(fetchedProducts);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch data once on mount - this will only happen once when the app loads
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const contextValue: AppDataContextType = {
    categories,
    products,
    categoriesLoading,
    productsLoading,
    refreshCategories: fetchCategories,
    refreshProducts: fetchProducts,
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
}