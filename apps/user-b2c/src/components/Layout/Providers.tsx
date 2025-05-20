"use client";

import React from 'react';
import { ThemeProvider } from "@repo/ui";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import styles from "./AppLayout.module.css";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <CartProvider>
        <ToastProvider>
          <div className={styles.container}>
            <Header />
            <main className={styles.main}>
              {children}
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
