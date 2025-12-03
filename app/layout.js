import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { ReactLenis } from "@/lib/lenis";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "@/components/ui/sonner";

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
        className="antialiased font-[Satoshi-Regular] selection:bg-lime-500 selection:text-white">
        <ReactLenis root>
          <CartProvider>
            <Navbar />
            {children}
            <Toaster />
            <Footer />
          </CartProvider>
        </ReactLenis>
      </body>
    </html>
  );
}
