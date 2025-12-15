import { motion } from "motion/react";

/**
 * The Animated Hamburger / Close Button
 */
export const MenuToggle = ({ isOpen, toggle }) => (
    <button
        onClick={toggle}
        className="relative z-50 p-2 group focus:outline-none mix-blend-difference  "
        aria-label="Toggle Menu"
    >
        <div className="flex flex-col gap-1.5 items-start justify-center w-8">
            <motion.span
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`h-0.5 w-8 bg-current origin-center transition-colors duration-300 ${isOpen ? 'bg-white' : 'bg-white'}`}
            />
            <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`h-0.5 w-5 bg-current group-hover:w-8 transition-all duration-300 ${isOpen ? 'bg-white' : 'bg-white'}`}
            />
            <motion.span
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`h-0.5 w-8 bg-current origin-center transition-colors duration-300 ${isOpen ? 'bg-white' : 'bg-white'}`}
            />
        </div>
    </button>
);