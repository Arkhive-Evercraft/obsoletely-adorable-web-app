"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAppData } from '@/components/AppDataProvider';
import styles from './page.module.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Main } from '@/components/Main';

export default function ProductDetail() {
  const pageHeading = "Products";
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { products, productsLoading } = useAppData();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    if (products.length > 0) {
      // Find the product that matches the ID
      const foundProduct = products.find(p => String(p.id) === id);

      if (foundProduct) {
        // Create a UI-friendly product object
        const uiProduct = {
          id: String(foundProduct.id),
          name: foundProduct.name,
          price: foundProduct.price,
          description: foundProduct.description || '',
          imageUrl: foundProduct.imageUrl,
          category: foundProduct.categoryName,
          inStock: foundProduct.inventory > 0
        };

        setProduct(uiProduct);

        // Find related products (same category)
        const related = products
          .filter(p => p.categoryName === foundProduct.categoryName && String(p.id) !== id)
          .slice(0, 4)
          .map(p => ({
            id: String(p.id),
            name: p.name,
            price: p.price,
            description: p.description || '',
            imageUrl: p.imageUrl,
            category: p.categoryName,
            inStock: p.inventory > 0
          }));

        setRelatedProducts(related);
      }
    }
  }, [products, id]);

  if (productsLoading) {
    return (
      <AppLayout>
        <Main pageHeading={pageHeading}>
          <div className={styles.loading}>Loading product details...</div>
        </Main>
      </AppLayout>
    );
  }

  if (!product && !productsLoading) {
    return (
      <AppLayout>
        <Main pageHeading={pageHeading}>
          <div className={styles.notFound}>
            <h1>Product Not Found</h1>
            <p>Sorry, the product you are looking for does not exist.</p>
            <Link href="/products" className={styles.backButton}>
              Back to Products
            </Link>
          </div>
        </Main>
      </AppLayout>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  if (!product) return null;

  return (
    <AppLayout>
      <Main pageHeading={pageHeading}>
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
        </div>
      </Main>
    </AppLayout>
  );
}
