import "@repo/ui/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider, AuthProvider } from "@repo/ui/components"
import { AppDataProvider } from "@/components/AppDataProvider";
import { CartProvider } from "@/contexts/CartContext";
import { SessionProvider } from '../providers/SessionProvider';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "HTML Tag Adoption Shelter",
  description: "Find loving homes for orphaned HTML tags - A safe haven for semantic elements",
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
          <CartProvider>
          <ThemeProvider>
            <AppDataProvider>
              <SessionProvider>
                {children}
              </SessionProvider>
            </AppDataProvider>
          </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )}