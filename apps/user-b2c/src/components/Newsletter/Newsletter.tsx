"use client";

import React, { useState } from 'react';
import styles from './Newsletter.module.css';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Simulate API call to subscribe
    setTimeout(() => {
      setIsSubmitted(true);
      setError('');
    }, 500);
  };
  
  return (
    <section className={styles.newsletter}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Subscribe to Our Newsletter</h2>
          <p className={styles.description}>
            Be the first to know about new products, exclusive offers, and style tips.
          </p>
          
          {isSubmitted ? (
            <div className={styles.success}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className={styles.successIcon} viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
              <p>Thank you for subscribing!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  aria-label="Email address"
                />
                <button type="submit" className={styles.button}>
                  Subscribe
                </button>
              </div>
              {error && <p className={styles.errorText}>{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
