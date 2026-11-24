import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Professional Font Pairing: Sans for UI, Serif for Brand/Headings
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "MALIK BRAND ZONE | Premium Ladies Clothing",
  description: "Discover the latest trends in women's fashion at MALIK BRAND ZONE.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        {children}
        <Toaster position="top-center" closeButton />
      </body>
    </html>
  );
}
