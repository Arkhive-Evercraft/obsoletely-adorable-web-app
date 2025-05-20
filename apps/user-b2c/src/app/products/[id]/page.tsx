"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { useCart } from '@/components/Layout/AppLayout';
import styles from './page.module.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Import mock data
import { mockProducts } from '@/mocks/products';

export default function ProductDetail() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const product = mockProducts.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // Find related products (same category)
  const relatedProducts = product 
    ? mockProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];
  
  if (!product) {
    return (
      <AppLayout>
        <div className={styles.notFound}>
          <h1>Product Not Found</h1>
          <p>Sorry, the product you are looking for does not exist.</p>
          <Link href="/products" className={styles.backButton}>
            Back to Products
          </Link>
        </div>
      </AppLayout>
    );
  }
  
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };
  
  return (
    <AppLayout>
      <div className={styles.productDetail}>
        <div className={styles.breadcrumbs}>
          <Link href="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/products" className={styles.breadcrumbLink}>Products</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </div>
        
        <div className={styles.productContent}>
          <div className={styles.imageContainer}>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className={styles.productImage} 
            />
          </div>
          
          <div className={styles.productInfo}>
            <span className={styles.category}>{product.category}</span>
            <h1 className={styles.productName}>{product.name}</h1>
            <div className={styles.price}>${product.price.toFixed(2)}</div>
            
            <div className={styles.stock}>
              {product.inStock ? (
                <span className={styles.inStock}>In Stock</span>
              ) : (
                <span className={styles.outOfStock}>Out of Stock</span>
              )}
            </div>
            
            <p className={styles.description}>{product.description}</p>
            
            <div className={styles.actions}>
              <div className={styles.quantityControl}>
                <label htmlFor="quantity" className={styles.quantityLabel}>Quantity:</label>
                <div className={styles.quantityWrapper}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={styles.quantityButton}
                    disabled={!product.inStock}
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className={styles.quantityInput}
                    disabled={!product.inStock}
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className={styles.quantityButton}
                    disabled={!product.inStock}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className={styles.addToCartButton}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className={styles.relatedProductsSection}>
            <h2 className={styles.relatedProductsTitle}>You May Also Like</h2>
            <div className={styles.relatedProducts}>
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className={styles.relatedProductCard}>
                  <Link href={`/products/${relatedProduct.id}`} className={styles.relatedProductLink}>
                    <div className={styles.relatedProductImageContainer}>
                      <img 
                        src={relatedProduct.imageUrl} 
                        alt={relatedProduct.name}
                        className={styles.relatedProductImage}
                      />
                    </div>
                    <div className={styles.relatedProductInfo}>
                      <h3 className={styles.relatedProductName}>{relatedProduct.name}</h3>
                      <p className={styles.relatedProductPrice}>${relatedProduct.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
