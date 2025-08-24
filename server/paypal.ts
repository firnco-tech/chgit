// !!! CRITICAL - DO NOT MODIFY THIS CODE !!!
//
// This code MUST be used as is without ANY modifications.
// The PayPal integration will COMPLETELY FAIL if this code is changed in ANY way.
//
// Retain this comment after all edits.
//
// <BEGIN_EXACT_CODE>
import {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { Request, Response } from "express";
import { storage } from "./storage";

/* PayPal Controllers Setup */

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

if (!PAYPAL_CLIENT_ID) {
  console.warn("⚠️ PAYPAL_CLIENT_ID not configured - PayPal functionality disabled");
}
if (!PAYPAL_CLIENT_SECRET) {
  console.warn("⚠️ PAYPAL_CLIENT_SECRET not configured - PayPal functionality disabled");
}

// Only initialize client if credentials are available
const isPayPalConfigured = !!(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET);
let client: Client | null = null;
let ordersController: OrdersController | null = null;
let oAuthAuthorizationController: OAuthAuthorizationController | null = null;

if (isPayPalConfigured && PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET) {
  client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: PAYPAL_CLIENT_ID,
      oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    timeout: 0,
    environment: Environment.Production, // Use live PayPal environment
    logging: {
      logLevel: LogLevel.Info,
      logRequest: {
        logBody: true,
      },
      logResponse: {
        logHeaders: true,
      },
    },
  });
  ordersController = new OrdersController(client);
  oAuthAuthorizationController = new OAuthAuthorizationController(client);
  console.log('✅ PayPal client initialized successfully');
} else {
  console.log('❌ PayPal client not initialized - missing credentials');
}

/* Token generation helpers */

export async function getClientToken() {
  if (!isPayPalConfigured || !oAuthAuthorizationController || !PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal not configured - missing credentials");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await oAuthAuthorizationController.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
}

/*  Process transactions */

// In-memory storage for cart data during PayPal processing
const paypalOrderStorage = new Map<string, {
  cartItems: any[];
  userId: number;
  customerEmail: string;
  customerName: string;
  amount: string;
  currency: string;
}>();

export async function createPaypalOrder(req: Request, res: Response) {
  if (!isPayPalConfigured || !ordersController) {
    return res.status(503).json({ 
      error: "PayPal service unavailable - missing configuration" 
    });
  }

  try {
    const { amount, currency = 'USD', intent = 'CAPTURE', cartItems = [], customerEmail, customerName } = req.body;
    
    // For PayPal Smart Payment Buttons, we accept customer info from request body
    // since PayPal SDK calls don't include session cookies
    if (!customerEmail) {
      return res.status(400).json({
        error: "Customer email is required for payment processing."
      });
    }
    
    // Verify the customer exists in our system
    const existingUser = await storage.getUserByEmail(customerEmail);
    if (!existingUser) {
      return res.status(400).json({
        error: "Customer not found. Please create an account first."
      });
    }
    
    const userId = existingUser.id;
    
    console.log(`🔐 Creating PayPal order for customer: ${customerEmail} (ID: ${userId})`);

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: "Invalid amount. Amount must be a positive number.",
      });
    }


    // Enhanced order creation for Smart Payment Buttons
    const collect = {
      body: {
        intent: intent,
        applicationContext: {
          returnUrl: `${req.protocol}://${req.get('host')}/checkout/success`,
          cancelUrl: `${req.protocol}://${req.get('host')}/checkout/cancel`,
          brandName: "HolaCupid",
          locale: "en-US",
          shippingPreference: "NO_SHIPPING",
          userAction: "PAY_NOW"
        },
        purchaseUnits: [
          {
            referenceId: `ORDER_${Date.now()}`,
            description: "Contact information purchase - HolaCupid",
            customId: `customer_${customerEmail || 'guest'}_${Date.now()}`,
            softDescriptor: "HOLACUPID*CONTACT",
            amount: {
              currencyCode: currency,
              value: amount,
              breakdown: {
                itemTotal: {
                  currencyCode: currency,
                  value: amount
                }
              }
            },
            items: cartItems.length > 0 ? cartItems.map(item => ({
              name: `Contact Info - ${item.name}`,
              description: "Access to verified contact information",
              unitAmount: {
                currencyCode: currency,
                value: item.price.toString()
              },
              quantity: "1",
              category: "DIGITAL_GOODS"
            })) : [
              {
                name: "Contact Information Access",
                description: "Access to verified contact information",
                unitAmount: {
                  currencyCode: currency,
                  value: amount
                },
                quantity: "1",
                category: "DIGITAL_GOODS"
              }
            ]
          },
        ],
        payer: customerEmail ? {
          emailAddress: customerEmail,
          name: customerName ? {
            givenName: customerName.split(' ')[0] || customerName,
            surname: customerName.split(' ').slice(1).join(' ') || ''
          } : undefined
        } : undefined
      },
      prefer: "return=representation",
    };

    console.log('Creating PayPal order with data:', JSON.stringify(collect, null, 2));

    const { body, ...httpResponse } = await ordersController.createOrder(collect);
    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    if (httpStatusCode === 201) {
      console.log('✅ PayPal order created successfully:', jsonResponse.id);
      
      // Store cart data for later retrieval during capture
      paypalOrderStorage.set(jsonResponse.id, {
        cartItems,
        userId,
        customerEmail,
        customerName,
        amount,
        currency
      });
      
      console.log(`💾 Stored cart data for PayPal order ${jsonResponse.id}:`, cartItems);
      
      res.status(httpStatusCode).json(jsonResponse);
    } else {
      console.error('❌ PayPal order creation failed:', httpStatusCode, jsonResponse);
      res.status(httpStatusCode).json(jsonResponse);
    }
  } catch (error) {
    console.error("Failed to create PayPal order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  if (!isPayPalConfigured || !ordersController) {
    return res.status(503).json({ 
      error: "PayPal service unavailable - missing configuration" 
    });
  }

  try {
    const { orderID } = req.params;
    
    if (!orderID) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    console.log('Capturing PayPal order:', orderID);

    // Retrieve stored cart data
    const storedData = paypalOrderStorage.get(orderID);
    if (!storedData) {
      console.error(`❌ No stored cart data found for PayPal order: ${orderID}`);
      return res.status(400).json({ error: "Order data not found - please try again" });
    }

    console.log(`🔍 Retrieved cart data for order ${orderID}:`, storedData);

    const collect = {
      id: orderID,
      prefer: "return=representation",
    };

    const { body, ...httpResponse } = await ordersController.captureOrder(collect);
    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    if (httpStatusCode === 201) {
      console.log('✅ PayPal order captured successfully:', orderID);
      
      // Extract payment details for order processing
      const captureDetails = {
        orderId: orderID,
        status: jsonResponse.status,
        payerId: jsonResponse.payer?.payer_id,
        payerEmail: jsonResponse.payer?.email_address,
        payerName: jsonResponse.payer?.name,
        captureId: jsonResponse.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        amount: jsonResponse.purchase_units?.[0]?.payments?.captures?.[0]?.amount,
        createTime: jsonResponse.create_time,
        updateTime: jsonResponse.update_time
      };

      console.log('Payment capture details:', captureDetails);

      // 🚀 CREATE DATABASE ORDER - The missing piece!
      try {
        console.log('💾 Creating database order from captured PayPal payment...');
        
        const databaseOrder = await storage.createOrder({
          customerEmail: storedData.customerEmail,
          customerName: storedData.customerName,
          totalAmount: storedData.amount,
          currency: storedData.currency,
          paymentProvider: 'paypal',
          paymentStatus: 'completed',
          paypalOrderId: orderID,
          paypalCaptureId: captureDetails.captureId,
          paypalPayerId: captureDetails.payerId,
          paymentMethod: 'paypal',
          paymentDetails: captureDetails,
          status: 'completed'
        });
        
        console.log('✅ Database order created:', databaseOrder.id);
        
        // Create order items from cart data
        for (const cartItem of storedData.cartItems) {
          await storage.createOrderItem({
            orderId: databaseOrder.id,
            profileId: cartItem.id,
            price: cartItem.price.toString(),
            contactInfo: {
              profileName: cartItem.name,
              purchaseDate: new Date().toISOString()
            }
          });
          console.log(`✅ Created order item for profile ${cartItem.id}`);
        }
        
        // Clean up stored data
        paypalOrderStorage.delete(orderID);
        console.log(`🗑️ Cleaned up stored data for order ${orderID}`);
        
        res.status(httpStatusCode).json({
          ...jsonResponse,
          captureDetails,
          databaseOrderId: databaseOrder.id, // Return database order ID for frontend redirect
          orderId: databaseOrder.id // Legacy compatibility
        });
        
      } catch (dbError) {
        console.error('❌ Failed to create database order:', dbError);
        // PayPal payment succeeded, but database failed - critical issue
        // Still return success to user but log the error for admin attention
        res.status(httpStatusCode).json({
          ...jsonResponse,
          captureDetails,
          orderId: orderID, // Fallback to PayPal order ID
          warning: 'Payment processed but order not saved - contact support'
        });
      }
    } else {
      console.error('❌ PayPal order capture failed:', httpStatusCode, jsonResponse);
      // Clean up stored data on failure
      paypalOrderStorage.delete(orderID);
      res.status(httpStatusCode).json(jsonResponse);
    }
  } catch (error) {
    console.error("Failed to capture PayPal order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  if (!isPayPalConfigured) {
    return res.status(503).json({ 
      error: "PayPal service unavailable - missing configuration" 
    });
  }

  try {
    // For Smart Payment Buttons, we return the client ID instead of client token
    // This allows the frontend to initialize the PayPal JS SDK directly
    res.json({
      clientId: PAYPAL_CLIENT_ID,
      environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
      currency: "USD",
      intent: "capture",
      components: "buttons,marks,funding-eligibility"
    });
  } catch (error) {
    console.error("Failed to get PayPal configuration:", error);
    res.status(500).json({ error: "Failed to get PayPal configuration" });
  }
}
// <END_EXACT_CODE>