import React, { useState } from 'react';
import styles from './Cart.module.css';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, lastError, clearError, isLoading } = useCart();
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Show loading state while cart is being loaded from database
  if (isLoading) {
    return (
      <div className={styles.cart}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading your cart...</p>
        </div>
      </div>
    );
  }

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    setLoadingItems(prev => new Set(prev).add(itemId));
    await updateQuantity(itemId, newQuantity);
    setLoadingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const handleRemoveItem = async (itemId: string) => {
    setLoadingItems(prev => new Set(prev).add(itemId));
    await removeFromCart(itemId);
    setLoadingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };
  
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className={styles.emptyCartIcon} viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <h2 className={styles.emptyCartTitle}>Your cart is empty</h2>
        <p className={styles.emptyCartText}>Looks like you haven't added any products to your cart yet.</p>
        <Link href="/products" className={styles.shopButton}>
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className={styles.cart}>
      <h1 className={styles.title}>Shopping Cart</h1>
      
      {/* Error display */}
      {lastError && (
        <div className={styles.errorMessage}>
          <div className={styles.errorContent}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <span>{lastError}</span>
            <button onClick={clearError} className={styles.errorClose}>×</button>
          </div>
        </div>
      )}
      
      <div className={styles.cartContent}>
        <div className={styles.cartItemsContainer}>
          <div className={styles.cartHeader}>
            <div className={styles.productHeader}>Product</div>
            <div className={styles.priceHeader}>Price</div>
            <div className={styles.quantityHeader}>Quantity</div>
            <div className={styles.totalHeader}>Total</div>
            <div className={styles.actionsHeader}></div>
          </div>
          
          {cartItems.map((item) => {
            const isLoading = loadingItems.has(item.id);
            const isOutOfStock = !item.inStock;
            
            return (
            <div key={item.id} className={`${styles.cartItem} ${isLoading ? styles.loading : ''} ${isOutOfStock ? styles.outOfStock : ''}`}>
              <div className={styles.product}>
                <div className={styles.productImage}>
                  <img src={item.imageUrl} alt={item.name} />
                  {isOutOfStock && (
                    <div className={styles.outOfStockOverlay}>
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{item.name}</h3>
                  <p className={styles.productCategory}>{item.category}</p>
                  {isOutOfStock && (
                    <p className={styles.stockWarning}>
                      This item is no longer available. Please remove it to continue.
                    </p>
                  )}
                </div>
              </div>
              
              <div className={styles.price}>${item.price.toFixed(2)}</div>
              
              <div className={styles.quantity}>
                <button
                  onClick={() => handleQuantityUpdate(item.id, Math.max(1, item.quantity - 1))}
                  className={styles.quantityButton}
                  disabled={isLoading || isOutOfStock}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.quantityValue}>
                  {isLoading ? '...' : item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                  className={styles.quantityButton}
                  disabled={isLoading || isOutOfStock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              
              <div className={styles.total}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              
              <div className={styles.actions}>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className={styles.removeButton}
                  disabled={isLoading}
                  aria-label="Remove item"
                >
                  {isLoading ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            );
          })}
        </div>
        
        <div className={styles.cartSummary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          
          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>${(totalPrice * 0.1).toFixed(2)}</span>
            </div>
          </div>
          
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>${(totalPrice * 1.1).toFixed(2)}</span>
          </div>
          
          <div className={styles.cartButtons}>
            <Link href="/checkout" className={styles.checkoutButton}>
              Proceed to Checkout
            </Link>
            <button 
              className={styles.clearButton}
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
          
          <Link href="/products" className={styles.continueShopping}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
