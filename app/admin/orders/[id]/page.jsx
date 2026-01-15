"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  Calendar,
  Box,
  ChevronDown,
  Loader2,
  Mail
} from "lucide-react";

export default function AdminOrderDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          alert("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        // Since the API returns the updated order, we can update state directly
        // Note: Make sure API returns populated user if needed, or merge carefully.
        // For status update, merging is safer to keep existing populated user data.
        setOrder(prev => ({ ...prev, ...updatedOrder }));
        alert("Order status updated successfully");
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Update error", error);
      alert("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

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

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
    </div>
  );

  if (!order) return <div className="p-8 text-center">Order not found.</div>;

  // --- FIX: Access amount correctly from paymentInfo ---
  const orderTotal = order.paymentInfo?.amount || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-24 pb-20">
      
      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 hover:bg-zinc-100 rounded-full transition-colors border border-zinc-200">
            <ArrowLeft size={20} className="text-zinc-600" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-[Stardom-Regular] text-zinc-900">
                Order #{order.orderId || order._id.slice(-6).toUpperCase()}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
              <Calendar size={14} />
              <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative">
                <select
                    className={`appearance-none bg-white pl-4 pr-10 py-2.5 rounded-lg border border-zinc-300 text-sm font-medium focus:ring-2 focus:ring-zinc-900 outline-none cursor-pointer hover:border-zinc-400 transition-colors ${updating ? 'opacity-50' : ''}`}
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updating}
                >
                    <option value="placed">Placed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-zinc-500">
                    {updating ? <Loader2 className="animate-spin" size={16}/> : <ChevronDown size={16} />}
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN: ITEMS (2/3 width) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-2">
              <Box size={20} className="text-zinc-400" />
              <h2 className="text-lg font-bold text-zinc-900">Order Items</h2>
              <span className="bg-zinc-100 text-zinc-600 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                {order.items.length} Items
              </span>
            </div>
            
            <div className="divide-y divide-zinc-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-6 flex gap-4 md:gap-6 items-start hover:bg-zinc-50/50 transition-colors">
                  <div className="relative w-20 h-24 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200">
                    {item.image && (
                       <Image src={item.image} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-900 mb-1 truncate">{item.name}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-500 font-medium uppercase tracking-wide mb-2">
                        <span className="bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                           Size: {item.size}
                        </span>
                        <span className="bg-zinc-100 px-2 py-1 rounded border border-zinc-200 flex items-center gap-1">
                           <span className="w-2 h-2 rounded-full bg-zinc-400" style={{backgroundColor: item.color.toLowerCase()}}></span>
                           {item.color}
                        </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">ID: {item.product}</p>
                  </div>
                  <div className="text-right">
                    {/* --- FIX: Use item.price safe access --- */}
                    <p className="font-bold text-zinc-900">₹{(item.price || 0).toLocaleString()}</p>
                    <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-zinc-900 mt-1">Total: ₹{((item.price || 0) * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-zinc-50 border-t border-zinc-200">
                <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-medium">Subtotal</span>
                    {/* --- FIX: Use corrected orderTotal --- */}
                    <span className="font-bold text-zinc-900">₹{orderTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-200">
                    <span className="text-lg font-bold text-zinc-900">Grand Total</span>
                    {/* --- FIX: Use corrected orderTotal --- */}
                    <span className="text-xl font-black text-violet-600">₹{orderTotal.toLocaleString()}</span>
                </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: DETAILS (1/3 width) --- */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
              <User size={16} /> Customer
            </h2>
            <div className="flex items-center gap-4 mb-6">
               <div className="relative w-12 h-12 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
                  {order.user?.image ? (
                    <Image src={order.user.image} alt="User" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-zinc-400">
                        {order.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
               </div>
               <div>
                 <p className="font-bold text-zinc-900">{order.user?.name || "Guest User"}</p>
                 <p className="text-xs text-zinc-500">Customer</p>
               </div>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
                        <Mail size={14} />
                    </div>
                    <span className="text-zinc-600 truncate">{order.user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400">
                        <Phone size={14} />
                    </div>
                    <span className="text-zinc-600">{order.user?.mobile || "No Mobile"}</span>
                </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
              <MapPin size={16} /> Delivery To
            </h2>
            <div className="text-sm text-zinc-600 space-y-1 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
              <p className="font-bold text-zinc-900 mb-2">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
              <p className="font-medium mt-2 text-zinc-900">{order.shippingAddress?.country}</p>
              <p className="mt-2 text-xs text-zinc-500 flex items-center gap-1">
                 <Phone size={10} /> {order.shippingAddress?.mobile}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
             <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
              <CreditCard size={16} /> Payment
            </h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Method</span>
                    <span className="font-bold text-zinc-900 uppercase">{order.paymentInfo?.provider}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Status</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        order.paymentInfo?.paymentStatus === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                        {order.paymentInfo?.paymentStatus}
                    </span>
                </div>
                {order.paymentInfo?.transactionId && (
                    <div className="pt-3 border-t border-zinc-100">
                        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Transaction ID</p>
                        <p className="text-xs font-mono bg-zinc-50 p-2 rounded border border-zinc-100 break-all">
                            {order.paymentInfo.transactionId}
                        </p>
                    </div>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
} 