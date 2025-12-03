import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { MainLink } from "./ui/MainLink";
import { NAV_LINKS, SECONDARY_LINKS } from "@/constants";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

/**
 * Full Screen Menu Overlay
 */
export const FullScreenMenu = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const prevPathRef = useRef(pathname);

    const handleClose = useCallback(() => {
        if (onClose) onClose();
    }, [onClose]);

    useEffect(() => {
        if (prevPathRef.current !== pathname && isOpen) {
            handleClose();
        }
        prevPathRef.current = pathname;
    }, [pathname, isOpen, handleClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                    animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                    exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-40 bg-[#0a0a0a] text-white flex flex-col justify-between pt-24 pb-10 px-4 md:px-12 h-screen w-screen"
                >
                    {/* Background Texture (Optional noise for urban feel) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    <div className="container mx-auto h-full flex flex-col lg:flex-row lg:items-end justify-between">

                        {/* Main Links Area */}
                        <div className="flex flex-col gap-2 md:gap-4 mt-8 lg:pb-5 lg:mt-0 z-10">
                            {NAV_LINKS.map((link, i) => (
                                <MainLink key={i} {...link} index={i} />
                            ))}
                        </div>

                        {/* Secondary Links & Info Area */}
                        <div className="flex flex-col gap-8 lg:gap-12 lg:mb-4 z-10 mt-12 lg:mt-0 max-sm:pb-5">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm md:text-base text-gray-400"
                            >
                                {SECONDARY_LINKS.map((link, i) => (
                                    <Link key={i} href={link.href} className="hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                                        {link.title}
                                    </Link>
                                ))}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-lg max-w-sm border border-zinc-800 hidden md:block"
                            >
                                <h4 className="text-lime-500 font-bold mb-2 text-sm uppercase tracking-widest">Urban Veins Inc.</h4>
                                <p className="text-zinc-400 text-sm mb-4">Redefining streetwear with bold cuts and premium fabrics. Join the movement.</p>
                                <div className="flex gap-4 items-center">
                                    <span className="flex relative h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs text-zinc-500 font-mono uppercase">System Online</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer / Copyright */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="w-full flex justify-between items-end border-t border-zinc-800 pt-6 z-10 max-sm:mb-10 max-sm:border-b max-sm:pb-6"
                    >
                        <div className="text-xs text-zinc-500 uppercase tracking-widest">
                            © 2025 Urban Veins
                        </div>
                        <div className="flex gap-4 text-xs font-bold uppercase">
                            <Link href="#" className="hover:text-lime-500 transition-colors">Instagram</Link>
                            <Link href="#" className="hover:text-lime-500 transition-colors">Twitter</Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};