"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronDown,
  Loader2,
  Eye
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // --- 1. FETCH ORDERS ---
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        // Ensure we handle the response structure { orders: [...] }
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- 2. UPDATE STATUS ---
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state immediately
        setOrders((prev) => 
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update error", error);
      alert("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- 3. HELPER: Status Colors ---
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "placed": return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "failed": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Filter orders by ID or Customer Name
  const filteredOrders = orders.filter((o) =>
    (o.orderId && o.orderId.toLowerCase().includes(search.toLowerCase())) || 
    o._id.toLowerCase().includes(search.toLowerCase()) ||
    (o.user?.name && o.user.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
    </div>
  );

  return (
    <div className="space-y-6 pt-24">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-zinc-900 font-[Stardom-Regular]">Orders</h1>
            <p className="text-zinc-500 text-sm">Manage customer orders and shipments.</p>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by Order ID or Customer Name..." 
          className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- ORDERS TABLE --- */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-zinc-50/50 border-b border-zinc-100">
              <tr>
                <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider">Order ID</th>
                <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider">Total</th>
                <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider">Payment</th>
                <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="p-4 font-medium text-xs text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-sm font-medium text-zinc-900">
                         {order.orderId || order._id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-zinc-900">{order.user?.name || "Guest"}</div>
                      <div className="text-xs text-zinc-500">{order.user?.email}</div>
                    </td>
                    <td className="p-4 text-sm text-zinc-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium text-zinc-900">₹{order.paymentInfo?.amount?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        order.paymentInfo?.paymentStatus === 'completed' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                        {order.paymentInfo?.paymentStatus?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4">
                      {/* --- STATUS DROPDOWN --- */}
                      <div className="relative inline-block w-36">
                        <select
                          className={`w-full appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer ${getStatusColor(order.orderStatus)}`}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                        >
                          <option value="placed">Placed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-current opacity-50">
                          {updatingId === order._id ? <Loader2 className="animate-spin" size={14}/> : <ChevronDown size={14} />}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                       <Link 
                          href={`/admin/orders/${order._id}`} 
                          className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                          title="View Details"
                       >
                          <Eye size={18} />
                       </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-zinc-300" />
                        <p>No orders found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}