import "@repo/ui/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider, AuthProvider } from "@repo/ui/components"
import { AppDataProvider } from "@/components/AppDataProvider";
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
  title: "Obsoletely Adorable Admin",
  description: "Admin Dashboard for Obsoletely Adorable",
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
            <AppDataProvider>
              <SessionProvider>
                {children}
              </SessionProvider>
            </AppDataProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )}