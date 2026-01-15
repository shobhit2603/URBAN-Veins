"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react"; 
import { 
  IndianRupee, 
  ShoppingCart, 
  Package, 
  Users,
  AlertTriangle,
  ArrowUpRight,
  LogOut
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
    </div>
  );

  return (
    <div className="space-y-8"> {/* Added pt-20 to push content below navbar */}
      {/* --- HEADER WITH LOGOUT --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-zinc-900 font-[Stardom-Regular]">Dashboard</h1>
            <p className="text-zinc-500 text-sm">Overview of your store&apos;s performance.</p>
        </div>
        
        {/* Logout Button */}
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <IndianRupee className="text-green-600 h-6 w-6" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12.5% <ArrowUpRight size={12} className="ml-1" />
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold text-zinc-900">₹{stats?.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <ShoppingCart className="text-blue-600 h-6 w-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold text-zinc-900">{stats?.totalOrders}</h3>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-violet-50 rounded-xl">
              <Package className="text-violet-600 h-6 w-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Active Products</p>
            <h3 className="text-2xl font-bold text-zinc-900">{stats?.totalProducts}</h3>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Users className="text-orange-600 h-6 w-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-1">Total Customers</p>
            <h3 className="text-2xl font-bold text-zinc-900">{stats?.totalUsers}</h3>
          </div>
        </div>
      </div>

      {/* --- ALERTS SECTION --- */}
      {stats?.lowStockCount > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-bottom-2">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <p className="text-sm font-medium">
            <span className="font-bold">Attention Needed:</span> {stats.lowStockCount} products are running low on stock.
          </p>
        </div>
      )}
    </div>
  );
}