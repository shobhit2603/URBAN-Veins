"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Ticket,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  // --- 1. SECURITY CHECK ---
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/"); 
    }
  }, [status, session, router]);

  if (status === "loading" || !session || session.user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Coupons", href: "/admin/coupons", icon: Ticket }, 
  ];

  return (
    // --- FIX 1: Add pt-24 to push the whole layout below the fixed Navbar ---
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 pt-15">
      
      {/* --- FIX 2: Move Mobile Toggle Button down so it's not hidden --- */}
      <button 
        className="lg:hidden fixed top-28 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-zinc-200"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* --- SIDEBAR --- */}
      {/* FIX 3: Add 'pt-24 lg:pt-0'. 
          - On Mobile (fixed), this internal padding pushes the logo down so it's visible.
          - On Desktop (static), we remove it because the outer div handles the spacing.
      */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-zinc-200 transform transition-transform duration-200 ease-in-out
        pt-24 lg:pt-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-zinc-100">
            <h1 className="text-2xl font-bold font-[Stardom-Regular] tracking-tight">Urban Admin</h1>
          </div>
          
          <nav className="flex-1 flex flex-col p-4 gap-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                    isActive 
                      ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10" 
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-zinc-100">
              <div className="flex items-center gap-3 px-2 py-3 mb-2">
                  <div className="relative w-8 h-8 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
                      {session.user.image ? (
                          <Image 
                            src={session.user.image} 
                            alt="Admin" 
                            fill 
                            className="object-cover"
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400">
                              {session.user.name?.charAt(0).toUpperCase()}
                          </div>
                      )}
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-zinc-900">{session.user.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{session.user.email}</p>
                  </div>
              </div>
              
              <button
                onClick={() => signOut({ callbackUrl: '/login' })} 
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}