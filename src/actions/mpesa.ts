'use server';

import { z } from 'zod';

const stkPushSchema = z.object({
  phone: z.string().min(10, { message: 'A valid phone number is required.' }),
  amount: z.string().min(1, { message: 'Amount is required.' }),
});

// This is a SIMULATED STK Push function.
// In a real application, this is where you would make the API call to Safaricom's Daraja API.
export async function initiateStkPush(params: { phone: string, amount: string }) {
  const validatedFields = stkPushSchema.safeParse(params);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input provided.',
    };
  }

  const { phone, amount } = validatedFields.data;

  // 1. Get Environment Variables
  // In a real scenario, you'd pull these from process.env, which are populated from your .env file.
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortCode = process.env.MPESA_BUSINESS_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;

  if (!consumerKey || !consumerSecret || !shortCode || !passkey || consumerKey === 'YOUR_CONSUMER_KEY') {
    console.error('M-Pesa environment variables are not set correctly in the .env file.');
    // User-friendly message for the frontend
    return {
        success: false,
        message: 'The payment service is not configured correctly. Please contact support.',
    };
  }
  
  // --- REAL IMPLEMENTATION WOULD START HERE ---

  // 2. Get OAuth Token from Safaricom
  // const tokenResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
  //   headers: {
  //     'Authorization': `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`
  //   }
  // });
  // const tokenData = await tokenResponse.json();
  // const accessToken = tokenData.access_token;

  // 3. Prepare the STK Push Request Payload
  // const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  // const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
  
  // const payload = {
  //   BusinessShortCode: shortCode,
  //   Password: password,
  //   Timestamp: timestamp,
  //   TransactionType: "CustomerPayBillOnline", // or "CustomerBuyGoodsOnline"
  //   Amount: amount,
  //   PartyA: phone, // User's phone number
  //   PartyB: shortCode,
  //   PhoneNumber: phone,
  //   CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa-callback`,
  //   AccountReference: "ChangaraConnect",
  //   TransactionDesc: "Tithe/Offering"
  // };

  // 4. Make the STK Push Request
  // const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${accessToken}`
  //   },
  //   body: JSON.stringify(payload)
  // });
  // const stkData = await stkResponse.json();

  // 5. Handle the response
  // if (stkData.ResponseCode === '0') {
  //   return { success: true };
  // } else {
  //   return { success: false, message: stkData.ResponseDescription };
  // }

  // --- END OF REAL IMPLEMENTATION ---


  // For this simulation, we'll just assume success.
  console.log(`Simulating STK Push to ${phone} for amount ${amount}`);
  console.log('Using Shortcode:', shortCode);
  
  // This is where you would handle the callback from M-Pesa to confirm the transaction
  // and then save the contribution to the database.

  return {
    success: true,
  };
}
