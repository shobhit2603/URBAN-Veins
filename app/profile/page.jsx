"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Loader2, Save, Edit2, LogOut, Camera, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Personal Details Form
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    alternateMobile: "",
  });

  // Address Management State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null); // null = new, number = editing
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false
  });

  // 1. Auth Check
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // 2. Fetch User Data
  useEffect(() => {
    if (status === "authenticated") fetchProfile();
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          mobile: data.user.mobile || "",
          alternateMobile: data.user.alternateMobile || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
        // 1. Get Signature
        const signRes = await fetch('/api/cloudinary-sign', { method: 'POST' });
        const { signature, timestamp } = await signRes.json();

        // 2. Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
        formData.append('folder', 'urban-veins-users');

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await uploadRes.json();

        // 3. Save URL to Database
        if (data.secure_url) {
            await updateUser({ image: data.secure_url });
            // Update session to reflect new image immediately in Navbar
            await update({ user: { image: data.secure_url } }); 
        }
    } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload image");
    } finally {
        setUploadingImage(false);
    }
  };

  // --- GENERIC UPDATE USER HELPER ---
  const updateUser = async (updates) => {
    try {
        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });

        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setIsEditingPersonal(false);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Update failed", error);
        return false;
    }
  };

  // --- PERSONAL DETAILS HANDLER ---
  const handlePersonalUpdate = async (e) => {
    e.preventDefault();
    const success = await updateUser(formData);
    if (success) alert("Profile details updated!");
  };

  // --- ADDRESS HANDLERS ---
  const openAddressModal = (address = null, index = null) => {
      if (address) {
          setAddressForm(address);
          setEditingAddressIndex(index);
      } else {
          setAddressForm({
            label: "Home",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "India",
            isDefault: false
          });
          setEditingAddressIndex(null);
      }
      setShowAddressModal(true);
  };

  const handleAddressSubmit = async (e) => {
      e.preventDefault();
      
      let updatedAddresses = [...(user.addresses || [])];
      
      if (editingAddressIndex !== null) {
          // Update existing
          updatedAddresses[editingAddressIndex] = addressForm;
      } else {
          // Add new
          if (addressForm.isDefault) {
              // If new one is default, uncheck others
              updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
          }
          updatedAddresses.push(addressForm);
      }

      // If updated one is default, uncheck others
      if (addressForm.isDefault) {
          updatedAddresses = updatedAddresses.map((a, i) => 
            i === editingAddressIndex ? a : { ...a, isDefault: false }
          );
      }

      const success = await updateUser({ addresses: updatedAddresses });
      if (success) {
          setShowAddressModal(false);
      }
  };

  const deleteAddress = async (index) => {
      if (!confirm("Are you sure you want to delete this address?")) return;
      const updatedAddresses = user.addresses.filter((_, i) => i !== index);
      await updateUser({ addresses: updatedAddresses });
  };


  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="animate-spin h-8 w-8 text-violet-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-20 px-4 md:px-8 text-zinc-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-[Stardom-Regular]">My Profile</h1>
            <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 uppercase tracking-wider bg-red-50 px-4 py-2 rounded-full transition-colors"
            >
                <LogOut size={16} /> Sign Out
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Basic Info */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-zinc-100 ring-4 ring-white shadow-lg group">
                {user.image ? (
                  <Image src={user.image} alt={user.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <User size={40} />
                  </div>
                )}
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {uploadingImage ? (
                        <Loader2 className="text-white animate-spin" />
                    ) : (
                        <Camera className="text-white" />
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              </div>
              
              <h2 className="text-xl font-bold text-zinc-900">{user.name}</h2>
              <p className="text-sm text-zinc-500">{user.email}</p>
              <div className="mt-4 px-3 py-1 bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider rounded-full">
                {user.role}
              </div>
            </div>
          </div>

          {/* Right Column: Details & Edit Form */}
          <div className="md:col-span-2 space-y-6">
            
            {/* 1. Personal Details Card */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <User size={20} className="text-violet-500" /> Personal Details
                </h3>
                <button 
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                  className="text-xs font-bold uppercase tracking-widest text-violet-600 hover:underline flex items-center gap-1"
                >
                  {isEditingPersonal ? "Cancel" : <><Edit2 size={14} /> Edit Details</>}
                </button>
              </div>

              {isEditingPersonal ? (
                <form onSubmit={handlePersonalUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Mobile</label>
                      <input 
                        type="tel" 
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Alternate Mobile</label>
                      <input 
                        type="tel" 
                        value={formData.alternateMobile}
                        onChange={(e) => setFormData({...formData, alternateMobile: e.target.value})}
                        className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-zinc-900 text-white px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-violet-600 transition-colors flex items-center gap-2 mt-2"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Mobile</p>
                        <p className="text-zinc-900 font-medium flex items-center gap-2">
                           <Phone size={14} className="text-zinc-400"/> {user.mobile || "Not set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Alt Mobile</p>
                        <p className="text-zinc-900 font-medium">
                           {user.alternateMobile || "Not set"}
                        </p>
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* 2. Addresses Card */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <MapPin size={20} className="text-lime-500" /> Saved Addresses
                </h3>
                <button 
                    onClick={() => openAddressModal()}
                    className="text-xs font-bold uppercase tracking-widest text-lime-600 hover:underline flex items-center gap-1"
                >
                    <Plus size={14} /> Add New
                </button>
              </div>
              
              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-3">
                  {user.addresses.map((addr, idx) => (
                    <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex justify-between items-start group">
                      <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-zinc-200 px-2 py-1 rounded text-zinc-600">
                                {addr.label}
                            </span>
                            {addr.isDefault && <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded">Default</span>}
                        </div>
                        <p className="mt-2 text-sm text-zinc-800 font-medium">
                          {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-sm text-zinc-500">{addr.country}</p>
                      </div>
                      
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openAddressModal(addr, idx)} className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-500 hover:text-violet-600 hover:border-violet-600">
                              <Edit2 size={14} />
                          </button>
                          <button onClick={() => deleteAddress(idx)} className="p-2 bg-white rounded-lg border border-zinc-200 text-zinc-500 hover:text-red-600 hover:border-red-600">
                              <Trash2 size={14} />
                          </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-zinc-200 rounded-xl">
                    <p className="text-sm text-zinc-400 italic">No addresses saved yet.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- ADDRESS MODAL --- */}
      {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold font-[Stardom-Regular]">{editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}</h3>
                      <button onClick={() => setShowAddressModal(false)} className="text-zinc-400 hover:text-zinc-900"><X size={24} /></button>
                  </div>
                  
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 mb-1">Label</label>
                            <input required type="text" placeholder="Home, Work..." className="w-full p-2 border rounded-lg" value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-4 h-4 accent-violet-600" />
                                <span className="text-sm font-medium">Set as Default</span>
                            </label>
                        </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Address Line 1</label>
                          <input required type="text" className="w-full p-2 border rounded-lg" value={addressForm.addressLine1} onChange={e => setAddressForm({...addressForm, addressLine1: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-zinc-500 mb-1">Address Line 2 (Optional)</label>
                          <input type="text" className="w-full p-2 border rounded-lg" value={addressForm.addressLine2} onChange={e => setAddressForm({...addressForm, addressLine2: e.target.value})} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-zinc-500 mb-1">City</label>
                              <input required type="text" className="w-full p-2 border rounded-lg" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-zinc-500 mb-1">State</label>
                              <input required type="text" className="w-full p-2 border rounded-lg" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-zinc-500 mb-1">Postal Code</label>
                              <input required type="text" className="w-full p-2 border rounded-lg" value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-zinc-500 mb-1">Country</label>
                              <input required type="text" className="w-full p-2 border rounded-lg" value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} />
                          </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                          <button type="button" onClick={() => setShowAddressModal(false)} className="px-6 py-2 text-zinc-500 font-medium hover:bg-zinc-100 rounded-lg">Cancel</button>
                          <button type="submit" className="bg-zinc-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-violet-600 transition-colors">Save Address</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}