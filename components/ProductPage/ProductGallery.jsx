import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, name }) {
    // Note: Since your data only has 1 image usually, I'm duplicating it to simulate the 4-image requirement.
    // In a real scenario, you'd map distinct images.
    const galleryImages = images.length > 1 ? images : Array(4).fill(images[0]);
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
            {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 custom-scrollbar shrink-0">
                {galleryImages.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl cursor-pointer overflow-hidden border-4 transition-all ${activeImage === idx
                            ? "border-violet-500 opacity-100 scale-95"
                            : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`${name} thumbnail ${idx}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative w-full md:w-auto md:h-[600px] aspect-3/2 max-sm:aspect-square bg-zinc-100 rounded-2xl overflow-hidden group mx-auto md:mx-0 shadow-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={galleryImages[activeImage]}
                            alt={name}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Badge Overlay */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <span className="bg-white/80 backdrop-blur text-zinc-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        Original
                    </span>
                </div>
            </div>
        </div>
    );
}