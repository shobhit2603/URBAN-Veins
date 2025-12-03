import { motion } from "motion/react";
import Link from "next/link";

/**
 * Individual Main Menu Item with 3D Slide Hover Effect
 */
export const MainLink = ({ title, href, index, onClick }) => {
    return (
        <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden"
        >
            <Link href={href} onClick={onClick} className="group pr-2 relative block overflow-hidden text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white">
                <div className="relative transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                    {title}
                </div>
                <div className="absolute top-0 left-0 translate-y-full text-lime-500 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                    {title}
                </div>
            </Link>
        </motion.div>
    );
};