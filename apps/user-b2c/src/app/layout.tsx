import "@repo/ui/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider, AuthProvider } from "@repo/ui/components"
import { AppDataProvider } from "@/components/AppDataProvider";
import { CartProvider } from "@/contexts/CartContext";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "StyleStore Admin",
  description: "Admin Dashboard for StyleStore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <ThemeProvider>
              <CartProvider>
              {children}
              </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )}