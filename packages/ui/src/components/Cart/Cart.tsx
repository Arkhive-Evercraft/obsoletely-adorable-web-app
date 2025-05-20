import React from 'react';
import styles from './Cart.module.css';
import { Product } from '../Card';

export interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
  className?: string;
}

export function Cart({ items, onRemove, onUpdateQuantity, onCheckout, className = '' }: CartProps) {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className={`${styles.emptyCart} ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className={styles.emptyCartIcon} viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <p className={styles.emptyCartText}>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className={`${styles.cart} ${className}`}>
      <h2 className={styles.cartTitle}>Shopping Cart</h2>

      <div className={styles.cartItems}>
        {items.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.cartItemImage}>
              <img src={item.imageUrl} alt={item.name} />
            </div>
            
            <div className={styles.cartItemDetails}>
              <h3 className={styles.cartItemTitle}>{item.name}</h3>
              <p className={styles.cartItemPrice}>${item.price.toFixed(2)}</p>
            </div>

            <div className={styles.cartItemActions}>
              <div className={styles.quantityControl}>
                <button
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className={styles.quantityButton}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.quantityValue}>{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className={styles.quantityButton}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onRemove(item.id)}
                className={styles.removeButton}
                aria-label="Remove item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={styles.removeIcon} viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cartSummary}>
        <div className={styles.cartTotal}>
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={onCheckout}
          className={styles.checkoutButton}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
