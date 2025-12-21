import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import { auth } from '@/auth';
import User from '@/models/User';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import Order from '@/models/Order';
import crypto from 'crypto';

// --- SET THIS TO 'true' TO TEST WITHOUT KEYS ---
const MOCK_MODE = true; 

// Helper to generate a short unique Order ID
function generateOrderId() {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of time
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `ORD-${timestamp}-${random}`;
}

// --- HELPER: Securely Calculate Total ---
async function calculateOrderAmount(userId, couponCode) {
  const user = await User.findById(userId).populate({
    path: 'cart.product',
    model: 'Product',
    select: 'name price images variants',
  });

  if (!user) throw new Error('User not found');
  if (!user.cart || user.cart.length === 0) throw new Error("Cart is empty");

  let subtotal = 0;
  let cartItemsForOrder = [];

  for (const item of user.cart) {
    const product = item.product;
    if (!product) continue; 

    // 1. Verify Stock
    const variant = product.variants.find(
      (v) => v.color === item.color && v.size === item.size
    );

    if (!variant) throw new Error(`Variant not found for ${product.name}`);
    if (variant.stock < item.quantity) {
      throw new Error(`Out of stock: ${product.name} (${item.color}/${item.size})`);
    }

    // 2. Add to Subtotal
    subtotal += product.price * item.quantity;

    // 3. Prepare Item for Order Record
    cartItemsForOrder.push({
      product: product._id,
      name: product.name,
      slug: product.slug || 'unknown-slug',
      image: product.images[0],
      price: product.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    });
  }

  // 4. Apply Coupon
  let total = subtotal;
  if (couponCode) {
    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase(), 
      isActive: true 
    });
    
    if (coupon) {
      if (new Date() > new Date(coupon.expiresAt)) throw new Error('Coupon expired');
      if (subtotal < coupon.minPurchase) throw new Error(`Min purchase ₹${coupon.minPurchase} required`);

      if (coupon.discountType === 'percentage') {
        total -= (subtotal * coupon.discountValue) / 100;
      } else {
        total -= coupon.discountValue;
      }
    }
  }

  // Ensure total never drops below 0
  total = Math.max(0, total);

  // PhonePe expects amount in PAISE (₹1 = 100 paise)
  const amountInPaise = Math.round(total * 100);

  return { amountInPaise, cartItemsForOrder, totalAmount: total };
}

// --- MAIN API HANDLER ---
export async function POST(request) {
  try {
    await dbConnect();
    
    // 1. Auth Check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get Input
    const { shippingAddress, couponCode } = await request.json();
    if (!shippingAddress) {
      return NextResponse.json({ message: 'Shipping address required' }, { status: 400 });
    }

    // 3. Calculate Amount & Prepare Order Data
    const { amountInPaise, cartItemsForOrder, totalAmount } = await calculateOrderAmount(
      session.user.id, 
      couponCode
    );

    // --- FIX: Generate unique Order ID ---
    const customOrderId = generateOrderId();

    // 4. Create PENDING Order in DB
    // We create the order *before* calling PhonePe so we have an Order ID to track
    const newOrder = await Order.create({
      user: session.user.id,
      orderId: customOrderId, // Save the custom ID
      items: cartItemsForOrder,
      shippingAddress,
      paymentInfo: {
        provider: 'phonepe',
        paymentStatus: 'pending',
        amount: totalAmount,
      },
      orderStatus: 'placed', // Initial status
    });

    // 5. Prepare PhonePe Request
    const merchantTransactionId = newOrder._id.toString(); // Use Order ID as Transaction ID
    const userId = session.user.id;
    
    
    // --- MOCK MODE LOGIC START ---
    if (MOCK_MODE) {
        console.log("⚠️ MOCK PAYMENT MODE ACTIVE: Skipping PhonePe Call");
        console.log(`Created Order ID: ${merchantTransactionId}`);
        
        // Return a dummy URL. In a real app, this URL would go to PhonePe.
        // Here we just send them to your Order Status page directly.
        // NOTE: Make sure 'BASE_URL' is set in .env.local (e.g., http://localhost:3000)
        const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
        
        return NextResponse.json({ 
            url: `${BASE_URL}/order-status?id=${merchantTransactionId}&status=MOCK_SUCCESS` 
        }, { status: 200 });
    }
    // --- MOCK MODE LOGIC END ---


    // NOTE: BASE_URL must be set in .env.local (e.g., https://your-site.com or ngrok url)
    const BASE_URL = process.env.BASE_URL; 
    if (!BASE_URL) throw new Error("BASE_URL env variable is missing");

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: userId,
      amount: amountInPaise,
      redirectUrl: `${BASE_URL}/order-status?id=${merchantTransactionId}`, // Frontend page to show success/fail
      redirectMode: "REDIRECT",
      callbackUrl: `${BASE_URL}/api/phonepe-callback`, // Server-to-server webhook
      mobileNumber: shippingAddress.mobile || "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // 6. Encode Payload (Base64)
    const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
    const base64EncodedPayload = bufferObj.toString("base64");

    // 7. Generate X-VERIFY Checksum
    // Formula: SHA256(base64Payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex
    const stringToHash = base64EncodedPayload + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerify = sha256 + "###" + process.env.PHONEPE_SALT_INDEX;

    // 8. Call PhonePe API
    const response = await fetch(process.env.PHONEPE_PAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
      },
      body: JSON.stringify({ request: base64EncodedPayload }),
    });

    const data = await response.json();

    if (data.success) {
      // 9. Return Redirect URL to Frontend
      return NextResponse.json({ 
        url: data.data.instrumentResponse.redirectInfo.url 
      }, { status: 200 });
    } else {
      // Payment initiation failed
      console.error("PhonePe Error:", data);
      await Order.findByIdAndDelete(newOrder._id); // Cleanup failed order
      return NextResponse.json({ 
        message: data.message || 'Payment initiation failed' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Payment API Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}