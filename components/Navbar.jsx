'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { MenuToggle } from "./ui/MenuToggle";
import { FullScreenMenu } from "./FullScreenMenu";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
    const { cartCount } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed top-0 left-0 right-0 z-60 flex items-center justify-between py-5 px-4 md:px-8 mix-blend-difference text-white backdrop-blur-md">

                {/* Left: Toggle */}
                <div className="flex items-center gap-4">
                    <MenuToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
                </div>

                {/* Center: Logo */}
                <Link href="/">
                    <motion.h2
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-3xl md:text-4xl font-[Stardom-Regular] font-bold cursor-pointer tracking-tighter mix-blend-difference"
                    >
                        URBAN <span className="text-lime-500">Veins.</span>
                    </motion.h2>
                </Link>

                {/* Right: Icons */}
                <div className="flex items-center gap-6 mix-blend-difference">
                    <div className="group cursor-pointer">
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 1 }}>
                            <Link href="/login" className="hover:text-lime-500 transition-colors duration-200" >
                                <UserRound size={22} strokeWidth={2} />
                            </Link>
                        </motion.div>
                        {/* <div className="group-hover:block hidden absolute dropdown-menu right-5 pt-4">
                            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-neutral-950 rounded-2xl">
                                <Link href="/account" className="hover:text-lime-500 transition-colors duration-200">My Account</Link>
                                <Link href="/orders" className="hover:text-lime-500 transition-colors duration-200">Orders</Link>
                                <Link href="/login" className="text-sky-500 hover:text-red-500 transition-colors duration-200">Logout</Link>
                            </div>
                        </div> */}
                    </div>
                    <Link href='/cart' className="relative hover:text-lime-500 transition-colors duration-200">
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 1 }}>
                            <ShoppingBag size={22} strokeWidth={2} />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-lime-500 text-[10px] font-bold text-zinc-900"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </Link>
                </div>
            </motion.nav>

            {/* The Full Screen Menu Overlay */}
            <FullScreenMenu
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}