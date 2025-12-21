import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnection';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import crypto from 'crypto';

export async function POST(request) {
  try {
    await dbConnect();

    // 1. Get Callback Data from PhonePe
    // PhonePe sends data as a base64 string in the body
    const { response: base64Response } = await request.json();
    const xVerifyHeader = request.headers.get('x-verify');

    if (!base64Response || !xVerifyHeader) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    // 2. Decode Payload
    const decodedResponse = JSON.parse(Buffer.from(base64Response, 'base64').toString('utf8'));
    
    // 3. Verify Signature (Security Check)
    // Formula: SHA256(base64Response + saltKey) + "###" + saltIndex
    const stringToHash = base64Response + process.env.PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const calculatedChecksum = sha256 + "###" + process.env.PHONEPE_SALT_INDEX;

    if (calculatedChecksum !== xVerifyHeader) {
      console.error("Checksum mismatch! Potential fraud.");
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    // 4. Process Payment Status
    const { code, data } = decodedResponse;
    const orderId = data.merchantTransactionId; // This corresponds to our Order _id
    const transactionId = data.transactionId; // PhonePe's Transaction ID

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (code === 'PAYMENT_SUCCESS') {
      // --- A. Success Scenario ---
      // Check if already processed to handle duplicate callbacks
      if (order.paymentInfo.paymentStatus !== 'completed') {
        
        // Update Order Status
        order.paymentInfo.paymentStatus = 'completed';
        order.paymentInfo.transactionId = transactionId;
        order.orderStatus = 'processing'; // Move to processing
        await order.save();

        // Clear User Cart
        await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });

        // Update Inventory (Reduce Stock)
        // We iterate through order items and update the specific variant stock
        for (const item of order.items) {
          await Product.findOneAndUpdate(
            { 
              _id: item.product, 
              "variants.color": item.color, 
              "variants.size": item.size 
            },
            { $inc: { "variants.$.stock": -item.quantity } }
          );
        }
      }
    } else {
      // --- B. Failure Scenario ---
      if (order.paymentInfo.paymentStatus === 'pending') {
        order.paymentInfo.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
        await order.save();
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error) {
    console.error('Callback Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}