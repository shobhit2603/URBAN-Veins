'use client';

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Send, Instagram, Twitter, Linkedin } from "lucide-react";
import { FOOTER_LINKS } from "@/constants";

export default function Footer() {
    return (
        <footer className="relative bg-[#050505] text-white pt-20 overflow-hidden">
            {/* 1. Background Texture (Consistent with FullScreenMenu) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20">

                    {/* 2. Newsletter / Call to Action Section */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-3xl md:text-5xl font-[Stardom-Regular] font-bold tracking-tight uppercase leading-none">
                            Join the <span className="text-violet-500">Cult.</span>
                        </h3>
                        <p className="text-zinc-400 max-w-md">
                            Get exclusive drops, early access to sales, and behind-the-scenes content from the Urban Veins design lab.
                        </p>

                        <div className="relative max-w-md mt-4 group">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="w-full bg-transparent border-b border-zinc-700 py-4 text-lg outline-none placeholder:text-zinc-600 focus:border-violet-500 transition-colors uppercase tracking-wider"
                            />
                            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:text-violet-500 transition-colors">
                                <Send size={20} />
                            </button>
                        </div>

                        {/* System Status Indicator (Matches FullScreenMenu) */}
                        <div className="flex gap-3 items-center mt-8">
                            <span className="flex relative h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                            </span>
                            <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                                Systems Operational // v.2.0.25
                            </span>
                        </div>
                    </div>

                    {/* 3. Navigation Links */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4">
                        {FOOTER_LINKS.map((column, idx) => (
                            <div key={idx} className="flex flex-col gap-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                                    {column.title}
                                </h4>
                                <ul className="flex flex-col gap-3">
                                    {column.links.map((link, i) => (
                                        <li key={i}>
                                            <Link href={link.href} className="group flex items-center gap-1 text-sm text-zinc-300 hover:text-white transition-colors">
                                                <span className="relative overflow-hidden">
                                                    <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                                                        {link.name}
                                                    </span>
                                                    <span className="absolute top-0 left-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-violet-500">
                                                        {link.name}
                                                    </span>
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Socials & Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-t border-zinc-800 pt-8 pb-12 gap-6">
                    <div className="flex gap-4">
                        {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                            <motion.a
                                key={i}
                                href="#"
                                whileHover={{ y: -4 }}
                                className="bg-zinc-900 border border-zinc-800 p-3 rounded-full text-zinc-400 hover:text-violet-500 hover:border-violet-500/50 transition-colors"
                            >
                                <Icon size={18} />
                            </motion.a>
                        ))}
                    </div>

                    <div className="flex flex-col md:items-end gap-1">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">
                            © 2025 Urban Veins Inc.
                        </p>
                        <p className="text-[10px] text-zinc-700 uppercase tracking-widest">
                            Designed in India
                        </p>
                    </div>
                </div>
            </div>

            {/* 5. Massive Marquee Background */}
            <div className="w-full border-t border-zinc-800 bg-[#0a0a0a] py-2 overflow-hidden relative z-0">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20
                    }}
                >
                    {/* Repeated text for seamless loop */}
                    <span className="text-[12vw] leading-none font-[Satoshi-Bold] font-black uppercase text-zinc-900/40 px-4">
                        Urban Veins Streetwear
                    </span>
                    <span className="text-[12vw] leading-none font-[Satoshi-Bold] font-black uppercase text-zinc-900/40 px-4">
                        Urban Veins Streetwear
                    </span>
                </motion.div>
            </div>
        </footer>
    );
}