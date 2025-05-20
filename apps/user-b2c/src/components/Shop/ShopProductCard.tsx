"use client";

import React from 'react';
import { ProductCard, Product } from '@repo/ui/components';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';

interface ShopProductCardProps {
  product: Product;
  className?: string;
}

export function ShopProductCard({ product, className = '' }: ShopProductCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const handleAddToCart = () => {
    addToCart(product);
    showToast(`Added ${product.name} to cart`, 'success');
  };
  
  return (
    <ProductCard 
      product={product}
      onAddToCart={handleAddToCart}
      className={className}
      renderProductName={(product) => (
        <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="text-lg font-semibold line-clamp-2">{product.name}</h3>
        </Link>
      )}
      renderQuickActions={(product) => (
        <>
          <Link 
            href={`/products/${product.id}`} 
            className="inline-flex items-center justify-center gap-1.5 bg-white text-primary border border-primary-lighter rounded-md py-1.5 px-3 text-sm font-medium hover:bg-primary-lightest transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
            </svg>
            <span>Details</span>
          </Link>
          
          {product.inStock && (
            <button 
              onClick={handleAddToCart}
              className="inline-flex items-center justify-center gap-1.5 bg-primary text-white border border-primary rounded-md py-1.5 px-3 text-sm font-medium hover:bg-primary-dark transition-colors"
              aria-label={`Add ${product.name} to cart`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              <span>Add to Cart</span>
            </button>
          )}
        </>
      )}
    />
  );
}
