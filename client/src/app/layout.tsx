import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";

// Professional Font Pairing: Sans for UI, Serif for Brand/Headings
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "MALIK BRAND ZONE | Premium Ladies Clothing",
  description: "Discover the latest trends in women's fashion at MALIK BRAND ZONE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Navbar />

        <main className="flex-grow">
          {children}
        </main>
        <CartDrawer />
        <Footer />

        {/* Footer component will go here later */}
      </body>
    </html>
  );
}