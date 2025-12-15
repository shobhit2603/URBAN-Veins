'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Eye, EyeOff, ArrowRight, User, Phone } from "lucide-react";
import Image from "next/image";
// --- NEW IMPORTS ---
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Link = ({ href, children, className, ...props }) => (
    <a href={href} className={className} {...props}>
        {children}
    </a>
);

export default function Signup() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    
    // --- NEW: Router for redirection ---
    const router = useRouter();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // --- NEW: Handle Signup & Auto-Login ---
    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Register User
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Success:", data.message);
                
                // 2. Auto-Login if registration success
                const loginResult = await signIn("credentials", {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                });

                if (loginResult?.error) {
                    console.error("Auto-login failed:", loginResult.error);
                    router.push('/login'); // Fallback
                } else {
                    router.refresh();
                    router.push('/'); // Redirect to Home
                }
            } else {
                console.error("Error:", data.message);
                alert(data.message || "Registration failed."); // Simple feedback
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] text-[#0a0a0a] relative flex flex-col justify-between selection:bg-violet-500 selection:text-white overflow-hidden">

            {/* 1. Background Grain */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply z-0"></div>

            {/* 2. Abstract Background Blobs */}
            <div className="absolute top-[-10%] right-[10%] w-[50vw] h-[50vw] bg-violet-200/80 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-lime-200/60 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" style={{ animationDuration: '10s' }} />

            {/* Main Content Wrapper */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 pt-20">

                <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* LEFT COLUMN: Brand & Messaging */}
                    <div className="hidden lg:flex flex-col gap-8 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <h1 className="text-4xl md:text-6xl font-[Stardom-Regular] font-bold tracking-tight mb-2 text-zinc-900">
                                Join The <br className="hidden lg:block" /><span className="text-zinc-400">Cult.</span>
                            </h1>
                            <p className="text-zinc-500 text-sm md:text-base max-w-sm">
                                Create your Urban Veins profile. Get early access to drops, track your orders, and become part of the movement.
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
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                            </span>
                            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                                Registration Open
                            </span>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: The Signup Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full max-w-md mx-auto order-1 lg:order-2 mt-10"
                    >
                        <form onSubmit={handleSignup} className="flex flex-col gap-5">

                            {/* Header for Mobile */}
                            <div className="lg:hidden mb-6 text-center">
                                <h2 className="text-4xl font-[Stardom-Regular] font-bold tracking-tighter">JOIN THE <span className="text-zinc-400">CULT.</span></h2>
                                <p className="text-zinc-500 text-sm">Be a part of the Urban Veins movement.</p>
                            </div>

                            {/* Social Signup */}
                            <div className="mt-2">
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    {/* --- ADDED onClick HANDLERS --- */}
                                    <button 
                                        type="button" 
                                        onClick={() => signIn('google', { callbackUrl: '/' })}
                                        className="flex items-center justify-center border border-zinc-400 rounded-lg py-2 hover:bg-neutral-100/50 transition-colors"
                                    >
                                        <Image src="/Google-Icon.svg" alt="Google" width={20} height={20} className="mr-2" />
                                        Google
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => signIn('facebook', { callbackUrl: '/' })}
                                        className="flex items-center justify-center border border-zinc-400 rounded-lg py-2 hover:bg-neutral-100/50 transition-colors"
                                    >
                                        <Image src="/Facebook-Icon.svg" alt="Facebook" width={20} height={20} className="mr-2" />
                                        Facebook
                                    </button>
                                </div>

                                <div className="relative flex py-2 items-center mt-4">
                                    <div className="grow border-t border-zinc-300"></div>
                                    <span className="shrink-0 mx-4 text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Or signup with</span>
                                    <div className="grow border-t border-zinc-300"></div>
                                </div>
                            </div >

                            {/* 1. Full Name Field */}
                            <div className="group relative">
                                <label
                                    htmlFor="fullName"
                                    className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium
                                    ${focusedField === 'fullName' || formData.fullName ? '-top-5 text-xs text-violet-600' : 'top-3 text-zinc-500 text-base'}
                                    `}
                                >
                                    FULL NAME
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('fullName')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent border-b border-zinc-400 py-3 text-lg outline-none text-zinc-900 transition-all duration-300 focus:border-violet-600 placeholder-transparent"
                                        placeholder="John Doe"
                                    />
                                    <User className={`absolute right-0 top-3 h-5 w-5 transition-colors duration-300 ${focusedField === 'fullName' ? 'text-violet-600' : 'text-zinc-400'}`} />
                                </div>
                            </div>

                            {/* 2. Email Field */}
                            <div className="group relative mt-2">
                                <label
                                    htmlFor="email"
                                    className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium
                                    ${focusedField === 'email' || formData.email ? '-top-5 text-xs text-violet-600' : 'top-3 text-zinc-500 text-base'}
                                    `}
                                >
                                    EMAIL ADDRESS
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent border-b border-zinc-400 py-3 text-lg outline-none text-zinc-900 transition-all duration-300 focus:border-violet-600 placeholder-transparent"
                                        placeholder="user@urbanveins.com"
                                    />
                                    <Mail className={`absolute right-0 top-3 h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-violet-600' : 'text-zinc-400'}`} />
                                </div>
                            </div>

                            {/* 3. Phone Number Field */}
                            <div className="group relative mt-2">
                                <label
                                    htmlFor="phone"
                                    className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium
                                    ${focusedField === 'phone' || formData.phone ? '-top-5 text-xs text-violet-600' : 'top-3 text-zinc-500 text-base'}
                                    `}
                                >
                                    PHONE NUMBER
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('phone')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent border-b border-zinc-400 py-3 text-lg outline-none text-zinc-900 transition-all duration-300 focus:border-violet-600 placeholder-transparent"
                                        placeholder="+91 00000 00000"
                                    />
                                    <Phone className={`absolute right-0 top-3 h-5 w-5 transition-colors duration-300 ${focusedField === 'phone' ? 'text-violet-600' : 'text-zinc-400'}`} />
                                </div>
                            </div>

                            {/* 4. Password Field */}
                            <div className="group relative mt-2">
                                <label
                                    htmlFor="password"
                                    className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium
                                    ${focusedField === 'password' || formData.password ? '-top-5 text-xs text-violet-600' : 'top-3 text-zinc-500 text-base'}
                                    `}
                                >
                                    CREATE PASSWORD
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent border-b border-zinc-400 py-3 text-lg outline-none text-zinc-900 transition-all duration-300 focus:border-violet-600 placeholder-transparent"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-0 top-3 hover:text-violet-600 transition-colors text-zinc-400"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="mt-2">
                                <label className="flex items-start gap-2   group">
                                    <div className="w-4 h-4 border border-zinc-400 rounded-sm flex items-center justify-center transition-colors group-hover:border-zinc-900 shrink-0">
                                        <input type="checkbox" required className="peer hidden" />
                                        <div className="w-2 h-2 bg-violet-500 opacity-0 rounded-full peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-xs text-zinc-500 group-hover:text-zinc-900 transition-colors leading-tight">
                                        I agree to the Terms, Privacy Policy and being cool.
                                    </span>
                                </label>
                            </div>

                            {/* Create Account Button */}
                            <button
                                disabled={isLoading}
                                className="relative w-full h-14 mt-4 overflow-hidden rounded-full bg-[#0a0a0a] group disabled:opacity-70 disabled:cursor-not-allowed  "
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
                                            Create Account <ArrowRight size={18} />
                                        </>
                                    )}
                                </motion.span>
                            </button>

                            {/* Login Link */}
                            <div className="text-center mt-4 mb-4 lg:mb-0">
                                <p className="text-zinc-500 text-sm">
                                    Already part of the cult?{" "}
                                    <Link href="/login" className="text-[#0a0a0a] font-bold hover:underline decoration-violet-500 decoration-2 underline-offset-4 transition-all">
                                        Sign In
                                    </Link>
                                </p>
                            </div>

                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Marquee */}
            <div className="w-full border-t border-zinc-400 py-3 overflow-hidden bg-white/50 backdrop-blur-md">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                >
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-xs font-mono font-bold uppercase text-zinc-400 px-8 flex items-center gap-2">
                            <span>Urban Veins Registration</span>
                            <div className="w-1 h-1 bg-violet-400 rounded-full" />
                            <span>Join The Movement</span>
                            <div className="w-1 h-1 bg-violet-400 rounded-full" />
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}