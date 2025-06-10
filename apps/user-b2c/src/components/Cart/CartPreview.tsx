"use client";

import React, { useState } from 'react';
import styles from './CartPreview.module.css';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';

export function CartPreview() {
  const { cartItems, cartItemCount, removeFromCart } = useCart();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const toggleCart = () => {
    setIsOpen(!isOpen);
  };
  
  const closeCart = () => {
    setIsOpen(false);
  };
  
  return (
    <div className={styles.cartPreviewContainer}>
      <Link href="/cart" className={styles.cartLink} aria-label="View Cart">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        {cartItemCount > 0 && (
          <span className={styles.cartBadge} data-testid="cart-badge">
            {cartItemCount}
          </span>
        )}
      </Link>
      
      {isOpen && (
        <>
          <div className={styles.cartPreview}>
            <div className={styles.cartHeader}>
              <h3 className={styles.cartTitle}>Your Cart ({cartItemCount})</h3>
              <button 
                className={styles.closeButton} 
                onClick={closeCart}
                aria-label="Close cart preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </div>
            
            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                <p>Your cart is empty</p>
                <Link href="/products" className={styles.shopButton} onClick={closeCart}>
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.cartItems}>
                  {cartItems.map(item => (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.itemImage}>
                        <img src={item.imageUrl} alt={item.name} />
                      </div>
                      <div className={styles.itemDetails}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <div className={styles.itemMeta}>
                          <span className={styles.itemQuantity}>{item.quantity} × </span>
                          <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <button 
                        className={styles.removeButton}
                        onClick={() => {
                          removeFromCart(item.id);
                          showToast(`Removed ${item.name} from cart`, 'info');
                        }}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.cartFooter}>
                  <div className={styles.subtotal}>
                    <span>Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className={styles.cartActions}>
                    <Link 
                      href="/cart" 
                      className={styles.viewCartButton}
                      onClick={closeCart}
                    >
                      View Cart
                    </Link>
                    <Link 
                      href="/checkout" 
                      className={styles.checkoutButton}
                      onClick={closeCart}
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={styles.backdrop} onClick={closeCart}></div>
        </>
      )}
    </div>
  );
}
