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
  const [showPopup, setShowPopup] = useState(false);
  const [submittedQuantity, setSubmittedQuantity] = useState(0);


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
    if (product && quantity > 0) {
      // Store the quantity being submitted
      setSubmittedQuantity(quantity);
      
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }

      // Reset quantity to 1 after adding to cart
      setQuantity(1);

      // Show popup notification
      setShowPopup(true);

      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  if (!product) return null;

  return (
    <AppLayout>
      <Main
        pageHeading={pageHeading}
        breadcrumbs={[
          { label: 'Products', href: '/products' },
          { label: product.name }
        ]}
      >
        <div className={styles.productDetail}>
          {/* Move title to top of card */}
          <div className={styles.productHeader}>
            <h1 className={styles.tagName}>{product.name}</h1>
            <div className={styles.tagBadge}>{product.category}</div>

            {/* Move availability tag to top right corner */}
            <div className={styles.availability}>
              {product.inStock ? (
                <span className={styles.available}>✨ Available</span>
              ) : (
                <span className={styles.adopted}>💙 Out of Stock</span>
              )}
            </div>
          </div>

          {/* Top Row: Two Columns - Image | What's Included + Payment */}
          <div className={styles.topRow}>
            <div className={styles.imageContainer}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className={styles.productImage}
              />
            </div>
            
            <div className={styles.rightColumn}>
              <div className={styles.whatsIncludedSection}>
                <h2 className={styles.whatsIncludedTitle}>What's Included</h2>
                <div className={styles.includedItems}>
                  <ul>
                    <li>One digital {product.name} tag of your own</li>
                    <li>Lifetime digital warranty</li>
                    <li>24/7 customer support</li>
                  </ul>
                </div>
              </div>

              <div className={styles.purchaseContainer}>
                <div className={styles.inlineControls}>
                  <div className={styles.quantitySection}>
                    <label htmlFor="quantity" className={styles.adoptionLabel}>Quantity:</label>
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

                  <div className={styles.priceDisplay}>
                    <div className={styles.adoptionFee}>
                      ${(product.price * quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className={styles.adoptButton}
                  disabled={!product.inStock}
                >
                  {product.inStock ? '🛒 Add to Cart' : '💙 Out of Stock'}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: About Section */}
          <div className={styles.bottomRow}>
            <div className={styles.aboutSection}>
              <h2 className={styles.aboutTitle}>About {product.name}</h2>

              <div className={styles.personality}>
                <h3>🌟 Personality</h3>
                <p>This wonderful tag has a {product.description || 'charming and friendly personality. They love to play and are great with other tags!'}</p>
              </div>

              <div className={styles.story}>
                <h3>📖 My Story</h3>
                <p>Hello! I'm {product.name}, and I'm looking for my forever digital home. I was created with love and designed to help organize and bring joy to any collection. I promise to be a loyal companion and help keep your digital life beautifully arranged!</p>
              </div>
            </div>
          </div>

          {/* Add to Cart Popup */}
          {showPopup && (
            <div className={styles.addToCartPopup}>
              {submittedQuantity} item{submittedQuantity > 1 ? 's' : ''} added to cart!
            </div>
          )}
        </div>
      </Main>
    </AppLayout>
  );
}
