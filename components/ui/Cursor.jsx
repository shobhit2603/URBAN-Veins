'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function Cursor() {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    // 1. Setup Motion Values (Performant: Doesn't trigger React re-renders)
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // 2. Add Physics (Spring) for the "Lag" effect
    // Stiffness = tension, Damping = friction. 
    // Lower stiffness + higher damping = liquid feel.
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // 3. Global Mouse Listeners
        const moveMouse = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        // 4. Smart Hover Detection
        // This looks for any interactive element. You don't need to add classes manually.
        const handleMouseOver = (e) => {
            const target = e.target;
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'LABEL' ||
                target.closest('button') || // Handle icons inside buttons
                target.closest('a')
            ) {
                setIsHovered(true);
            }
        };

        const handleMouseOut = () => {
            setIsHovered(false);
        };

        window.addEventListener('mousemove', moveMouse);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveMouse);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="pointer-events-none fixed inset-0 z-9999 overflow-hidden hidden md:block">

            {/* 5. The "Trailer" (Lime Ring) - Lags behind */}
            <motion.div
                className="absolute left-0 top-0 rounded-full border-2 border-lime-400 mix-blend-exclusion"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    width: isHovered ? 45 : 32, // Expands on hover
                    height: isHovered ? 45 : 32,
                    opacity: isHovered ? 0.8 : 0.4,
                    backgroundColor: isHovered ? 'rgba(163, 230, 53, 0.1)' : 'transparent', // Lime tint on hover
                    scale: isClicking ? 0.8 : 1, // Shrink on click
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
            />

            {/* 6. The "Dot" (Violet) - Instant movement */}
            <motion.div
                className="absolute left-0 top-0 rounded-full bg-violet-600"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    width: isHovered ? 8 : 8,
                    height: isHovered ? 8 : 8,
                    scale: isHovered ? 0 : 1, // Disappears into the ring on hover for cleaner look
                }}
            />
        </div>
    );
}