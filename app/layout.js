import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { ReactLenis } from "@/lib/lenis";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import Cursor from "@/components/ui/Cursor";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "URBAN Veins",
  description: "Discover the latest trends in urban fashion with Urban Veins. Shop now for exclusive styles and unbeatable prices.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="antialiased font-[Satoshi-Regular] selection:bg-violet-500 selection:text-white cursor-none">
        <ReactLenis root>
          <SessionProvider>
            <CartProvider>
            <Cursor />
            <Navbar />
            {children}
            <Toaster />
            <Footer />
          </CartProvider>
          </SessionProvider>
        </ReactLenis>
      </body>
    </html>
  );
}
