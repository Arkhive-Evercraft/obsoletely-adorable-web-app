import React from 'react';
import { Card, CardBody, CardFooter } from './Card';
import styles from './ProductCard.module.css';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  className?: string;
}

export function ProductCard({ product, onAddToCart, className = '' }: ProductCardProps) {
  return (
    <Card className={`${styles.productCard} ${className}`}>
      <div className={styles.imageContainer}>
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className={styles.image} 
        />
      </div>
      
      <CardBody>
        <h3 className={styles.title}>{product.name}</h3>
        <div className={styles.category}>{product.category}</div>
        <div className={styles.price}>${product.price.toFixed(2)}</div>
        <p className={styles.description}>{product.description}</p>
      </CardBody>
      
      <CardFooter>
        <div className={styles.stockStatus}>
          {product.inStock ? (
            <span className={styles.inStock}>In Stock</span>
          ) : (
            <span className={styles.outOfStock}>Out of Stock</span>
          )}
        </div>
        
        {onAddToCart && (
          <button 
            onClick={onAddToCart} 
            disabled={!product.inStock}
            className={`${styles.addToCartButton} ${!product.inStock ? styles.disabled : ''}`}
          >
            Add to Cart
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
