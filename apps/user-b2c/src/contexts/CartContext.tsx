"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inventory?: number;
  availableInventory?: number;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<boolean>;
  removeFromCart: (id: string) => Promise<boolean>;
  updateQuantity: (id: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  cartItemCount: number;
  lastError: string | null;
  clearError: () => void;
  isLoading: boolean;
  loadCart: () => Promise<void>;
}

// Create cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();

  // Load cart from database
  const loadCart = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart/load');
      const result = await response.json();
      
      if (result.success) {
        setCartItems(result.cartItems);
        setLastError(null);
      } else {
        setLastError(result.message || 'Failed to load cart');
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setLastError('Network error while loading cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart when component mounts or authentication changes
  useEffect(() => {
    if (status !== 'loading') {
      loadCart();
    }
  }, [status, session?.user?.email]);
  
  const addToCart = async (product: Product): Promise<boolean> => {
    // First, try to reserve the inventory
    try {
      // Check if item is already in cart
      const existingItem = cartItems.find(item => item.id === product.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
      
      // Call the reservation API
      const response = await fetch('/api/cart/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: newQuantity,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        setLastError(result.message || 'Failed to add item to cart');
        return false;
      }
      
      // If reservation was successful, update the cart state
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevItems.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        } else {
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
      
      setLastError(null);
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setLastError('Network error while adding item to cart');
      return false;
    }
  };
  
  const removeFromCart = async (id: string): Promise<boolean> => {
    try {
      // Release the reservation
      const response = await fetch(`/api/cart/reserve?productId=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const result = await response.json();
        setLastError(result.message || 'Failed to remove item from cart');
        // Still remove from UI even if the reservation release fails
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        return false;
      }
      
      // Update the cart state
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      setLastError(null);
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setLastError('Network error while removing item from cart');
      // Still remove from UI even if the reservation release fails
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      return false;
    }
  };
  
  const updateQuantity = async (id: string, quantity: number): Promise<boolean> => {
    try {
      // Get the current item
      const currentItem = cartItems.find(item => item.id === id);
      if (!currentItem) {
        setLastError('Item not found in cart');
        return false;
      }
      
      // If new quantity is 0, remove the item
      if (quantity <= 0) {
        return await removeFromCart(id);
      }
      
      // Call the reservation API to update quantity
      const response = await fetch('/api/cart/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          quantity: quantity,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        setLastError(result.message || 'Failed to update item quantity');
        return false;
      }
      
      // If reservation update was successful, update the cart state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
      
      setLastError(null);
      return true;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      setLastError('Network error while updating item quantity');
      return false;
    }
  };
  
  const clearCart = async (): Promise<boolean> => {
    try {
      // For each item in the cart, release the reservation
      for (const item of cartItems) {
        await fetch(`/api/cart/reserve?productId=${item.id}`, {
          method: 'DELETE',
        });
      }
      // Clear the cart state
      setCartItems([]);
      setLastError(null);
      return true;
    } catch (error) {
      console.error('Error releasing reservations:', error);
      setLastError('Failed to clear cart reservations');
      // Still clear the cart state even if reservation release fails
      setCartItems([]);
      return false;
    }
  };

  const clearError = () => {
    setLastError(null);
  };
  
  // Calculate cart item count
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartItemCount,
      lastError,
      clearError,
      isLoading,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
