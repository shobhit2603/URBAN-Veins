'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import Image from "next/image";

const Link = ({ href, children, className, ...props }) => (
    <a href={href} className={className} {...props}>
        {children}
    </a>
);

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // Mock Login Function
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        // Add redirect logic here
    };

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] text-[#0a0a0a] relative overflow-hidden flex flex-col justify-between selection:bg-violet-500 selection:text-white">

            {/* 1. Background Grain (Subtle Light Version) */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>

            {/* 2. Abstract Background Blobs (Apple-esque soft gradients) */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-violet-200/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-lime-200/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" style={{ animationDuration: '10s' }} />

            {/* Main Content Wrapper */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 pt-24 md:pt-32">

                <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* LEFT COLUMN: Brand & Messaging */}
                    <div className="hidden lg:flex flex-col gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <h1 className="text-4xl md:text-6xl font-[Stardom-Regular] font-bold tracking-tight mb-2 text-zinc-900">
                                Welcome <br className="hidden lg:block" /><span className="text-zinc-400">Back.</span>
                            </h1>
                            <p className="text-zinc-500 text-sm md:text-base max-w-sm">
                                Enter your credentials to access your order history and exclusive drops.
                            </p>
                        </motion.div>

                        {/* Interactive Status Pill */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="inline-flex items-center gap-3 bg-white border border-zinc-200 px-4 py-2 rounded-full w-fit shadow-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                            </span>
                            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                                Secure Server Connection
                            </span>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: The Login Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full max-w-md mx-auto"
                    >
                        <form onSubmit={handleLogin} className="flex flex-col gap-6">

                            {/* Header for Mobile */}
                            <div className="lg:hidden mb-8 text-center">
                                <h2 className="text-4xl font-[Stardom-Regular] font-bold tracking-tighter">WELCOME <span className="text-zinc-400">BACK.</span></h2>
                                <p className="text-zinc-500 text-sm mt-2">Enter your credentials to access the cult.</p>
                            </div>

                            {/* Email Field */}
                            <div className="group relative">
                                <label
                                    htmlFor="email"
                                    className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium
                                        ${focusedField === 'email' || email ? '-top-6 text-xs text-violet-600' : 'top-3 text-zinc-500 text-base'}
                                    `}
                                >
                                    EMAIL ADDRESS
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent border-b border-zinc-400 py-3 text-lg outline-none text-zinc-900 transition-all duration-300 focus:border-violet-600 placeholder-transparent"
                                        placeholder="user@urbanveins.com"
                                    />
                                    <Mail className={`absolute right-0 top-3 h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-violet-600' : 'text-zinc-400'}`} />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="group relative mt-4">
                                <label
                                    htmlFor="password"
                                    className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium
                                        ${focusedField === 'password' || password ? '-top-6 text-xs text-violet-600' : 'top-3 text-zinc-500 text-base'}
                                    `}
                                >
                                    PASSWORD
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent border-b border-zinc-400 py-3 text-lg outline-none text-zinc-900 transition-all duration-300 focus:border-violet-600 placeholder-transparent"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-3 hover:text-violet-600 transition-colors text-zinc-400 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Utility Links */}
                            <div className="flex justify-between items-center text-xs font-medium tracking-wide">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="w-4 h-4 border border-zinc-300 rounded-sm flex items-center justify-center transition-colors group-hover:border-zinc-900">
                                        <input type="checkbox" className="peer hidden" />
                                        <div className="w-2 h-2 bg-violet-500 opacity-0 rounded-full peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-zinc-500 group-hover:text-zinc-900 transition-colors">REMEMBER ME</span>
                                </label>
                                <Link href="/forgot-password" className="text-zinc-500 hover:text-violet-600 transition-colors uppercase">
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Modern Magnetic/Fill Button */}
                            <button
                                disabled={isLoading}
                                className="relative w-full h-14 mt-6 overflow-hidden rounded-full bg-[#0a0a0a] group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <div className="absolute inset-0 w-full h-full bg-violet-500 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />

                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className="relative z-10 w-full h-full flex items-center justify-center gap-2 text-white transition-colors duration-500 group-hover:text-white font-bold tracking-widest text-sm uppercase">
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        >
                                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                                        </motion.div>
                                    ) : (
                                        <>
                                            Sign In <ArrowRight size={18} />
                                        </>
                                    )}
                                </motion.span>
                            </button>

                            {/* Social Login Buttons */}
                            <div className="mt-2">
                                <div className="relative flex py-2 items-center">
                                    <div className="grow border-t border-zinc-300"></div>
                                    <span className="shrink-0 mx-4 text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Or continue with</span>
                                    <div className="grow border-t border-zinc-300"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button type="button" className="flex items-center justify-center border border-zinc-400 rounded-lg py-2 cursor-pointer hover:bg-neutral-100/50 transition-colors">
                                        <Image src="/Google-Icon.svg" alt="Google logo" width={20} height={20} className="mr-2" />
                                        Google
                                    </button>
                                    <button type="button" className="flex items-center justify-center border border-zinc-400 rounded-lg py-2 cursor-pointer hover:bg-neutral-100/50 transition-colors">
                                        <Image src="/Facebook-Icon.svg" alt="Google logo" width={20} height={20} className="mr-2" />
                                        Facebook
                                    </button>
                                </div>
                            </div >

                            {/* Sign Up Prompt */}
                            <div className="text-center mt-6">
                                <p className="text-zinc-500 text-sm">
                                    New to the cult?{" "}
                                    <Link href="/signup" className="text-[#0a0a0a] font-bold hover:underline decoration-violet-500 decoration-2 underline-offset-4 transition-all">
                                        Create Account
                                    </Link>
                                </p>
                            </div>

                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Marquee (Light Version) */}
            <div className="w-full border-t border-zinc-400 py-3 overflow-hidden bg-white/50 backdrop-blur-md">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                >
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-xs font-mono font-bold uppercase text-zinc-400 px-8 flex items-center gap-2">
                            <span>Urban Veins Secure Login</span>
                            <div className="w-1 h-1 bg-violet-400 rounded-full" />
                            <span>Encrypted Connection</span>
                            <div className="w-1 h-1 bg-violet-400 rounded-full" />
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}