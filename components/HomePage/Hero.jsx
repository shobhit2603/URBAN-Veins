'use client';

import { useRef } from "react";
import {
    motion,
    useTransform,
    useSpring,
    useMotionValue,
} from "motion/react";
import { ArrowDownRight, Globe, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    const containerRef = useRef(null);

    // --- MOUSE PARALLAX SETUP ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smoother spring config for luxury feel
    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e) => {
        // This keeps the JS thread light.
        const { clientX, clientY, currentTarget } = e;
        const { width, height } = currentTarget.getBoundingClientRect();

        // Calculate normalized -0.5 to 0.5
        mouseX.set((clientX / width) - 0.5);
        mouseY.set((clientY / height) - 0.5);
    };

    // --- TRANSFORMS ---
    const textMoveX = useTransform(springX, [-0.5, 0.5], [15, -15]);
    const textMoveY = useTransform(springY, [-0.5, 0.5], [15, -15]);

    // Images move with mouse (Depth Layer 2)
    const imageMoveX = useTransform(springX, [-0.5, 0.5], [-30, 30]);
    const imageMoveY = useTransform(springY, [-0.5, 0.5], [-30, 30]);

    // Subtle rotation for 3D feel
    const imageRotateX = useTransform(springY, [-0.5, 0.5], [2.5, -2.5]);
    const imageRotateY = useTransform(springX, [-0.5, 0.5], [-2.5, 2.5]);

    return (
        <motion.section
            ref={containerRef}
            className="relative min-h-screen w-full bg-[#FAFAFA] overflow-hidden flex flex-col items-center justify-center pt-20 perspective-[1000px]"
            onMouseMove={handleMouseMove}
        >
            {/* --- BACKGROUND ELEMENTS --- */}

            {/* 1. Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.3] pointer-events-none z-10 mix-blend-multiply">
                <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            {/* 2. Animated Gradient Blobs - Added will-change-transform */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-violet-300/30 rounded-full blur-[100px] mix-blend-multiply pointer-events-none will-change-transform translate-z-0"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, -30, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-lime-300/30 rounded-full blur-[80px] mix-blend-multiply pointer-events-none will-change-transform translate-z-0"
            />

            {/* 3. Grid Lines */}
            <div className="absolute inset-0 w-full h-full z-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '80px 80px' }}>
            </div>


            {/* --- MAIN CONTENT LAYER --- */}

            <div className="relative z-20 container mx-auto px-4 md:px-8 h-full flex flex-col items-center justify-center">

                {/* 1. Massive Typography Background */}
                <motion.div
                    style={{ x: textMoveX, y: textMoveY }}
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 will-change-transform"
                >
                    <h1 className="text-[18vw] leading-[0.8] font-[Stardom-Regular] font-black text-zinc-900/5 mix-blend-multiply tracking-tighter text-center whitespace-nowrap">
                        URBAN<br />VEINS
                    </h1>
                </motion.div>

                {/* 2. Central Visual Composition */}
                <div className="relative w-full max-w-5xl h-[60vh] md:h-[70vh] flex items-center justify-center perspective-[2000px] max-sm:-mt-50">

                    {/* Floating Decorative Elements */}
                    <FloatingBadge
                        text="EST. 2025"
                        className="absolute top-[10%] left-[5%] md:left-[15%] -rotate-12 z-30"
                        delay={0.2}
                    />
                    <FloatingBadge
                        text="NEW SEASON"
                        color="bg-lime-400"
                        className="absolute bottom-[20%] right-[5%] md:right-[15%] rotate-12 z-30"
                        delay={0.4}
                    />

                    {/* Main Image Stack */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                        style={{
                            x: imageMoveX,
                            y: imageMoveY,
                            rotateX: imageRotateX,
                            rotateY: imageRotateY,
                            transformStyle: "preserve-3d"
                        }}
                        className="relative w-[280px] md:w-[400px] aspect-3/4 group will-change-transform"
                    >
                        {/* Image Backing */}
                        <div className="absolute inset-0 bg-violet-600 rounded-lg transform translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500 ease-out" />

                        {/* Main Image */}
                        <div className="relative h-full w-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 shadow-2xl">
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent z-10" />

                            <Image
                                src="/images/hero1.jpg"
                                alt="Urban Veins Hero Model"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 400px"
                                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-in-out will-change-transform"
                            />

                            <div className="absolute bottom-6 left-6 z-20 text-white">
                                <p className="text-xs font-mono uppercase tracking-widest text-lime-400 mb-1">Collection 01</p>
                                <h3 className="text-3xl font-[Stardom-Regular] leading-none">CONCRETE<br />JUNGLE</h3>
                            </div>
                        </div>

                        {/* Interactive "Shop" Button Overlay */}
                        <Link href="/shop" className="absolute -right-12 top-1/2 -translate-y-1/2 z-30">
                            <MagneticButton>
                                <div className="h-24 w-24 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center border border-zinc-200 shadow-lg cursor-pointer group-hover:scale-110 transition-transform duration-300">
                                    <ArrowDownRight size={32} className="text-zinc-900 group-hover:-rotate-45 transition-transform duration-300" />
                                </div>
                            </MagneticButton>
                        </Link>
                    </motion.div>

                    {/* Side Image (Parallax Offset) */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                        style={{
                            x: useTransform(springX, [-0.5, 0.5], [50, -50]),
                            y: useTransform(springY, [-0.5, 0.5], [25, -25])
                        }}
                        className="absolute left-0 bottom-0 md:bottom-20 md:left-20 w-48 aspect-3/4 hidden md:block z-10 will-change-transform"
                    >
                        <div className="relative h-full w-full rounded-lg overflow-hidden border border-white shadow-xl grayscale hover:grayscale-0 transition-all duration-500">
                            <Image
                                src="/images/hero2.jpg"
                                alt="Detail Shot"
                                fill
                                sizes="200px"
                                className="object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* 3. Bottom Info Bar */}
                <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-between items-end mix-blend-difference text-zinc-900 md:text-white z-40 pointer-events-none">
                    {/* Added pointer-events-auto to children to ensure clicks work but container passes through */}
                    <div className="hidden md:flex flex-col gap-2 pointer-events-auto">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-800">
                            <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse" />
                            Online Store
                        </div>
                        <p className="text-xs opacity-60 max-w-[200px] text-zinc-800">
                            Defining the intersection of luxury and street culture.
                        </p>
                    </div>

                    <div className="hidden md:flex text-zinc-800 items-center gap-6 pointer-events-auto">
                        <SocialLink icon={Globe} label="Worldwide" />
                        <SocialLink icon={Play} label="Showreel" />
                    </div>
                </div>

            </div>
        </motion.section>
    );
}

// --- SUBCOMPONENTS ---

const FloatingBadge = ({ text, color = "bg-violet-500", className, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay, type: "spring", stiffness: 200 }}
        className={`px-4 py-2 rounded-full text-white font-bold text-xs uppercase tracking-widest shadow-lg ${color} ${className}`}
    >
        {text}
    </motion.div>
);

const SocialLink = ({ icon: Icon, label }) => (
    <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-lime-400 transition-colors group">
        <Icon size={14} />
        <span className="group-hover:translate-x-1 transition-transform">{label}</span>
    </button>
);

/**
 * OPTIMIZED MAGNETIC BUTTON
 * Removed React State. Uses MotionValues for 60fps performance without re-renders.
 */
const MagneticButton = ({ children }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        if (ref.current) {
            const { left, top, width, height } = ref.current.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            // Calculate distance
            const distanceX = clientX - centerX;
            const distanceY = clientY - centerY;

            // Set MotionValue directly (No React Render!)
            x.set(distanceX * 0.3);
            y.set(distanceY * 0.3);
        }
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: springX, y: springY }}
        >
            {children}
        </motion.div>
    );
};