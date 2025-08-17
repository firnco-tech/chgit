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
    environment:
                  process.env.NODE_ENV === "production"
                    ? Environment.Production
                    : Environment.Sandbox,
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

export async function createPaypalOrder(req: Request, res: Response) {
  if (!isPayPalConfigured || !ordersController) {
    return res.status(503).json({ 
      error: "PayPal service unavailable - missing configuration" 
    });
  }

  try {
    const { amount, currency = 'USD', intent = 'CAPTURE', customerEmail, customerName, items } = req.body;

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
          landingPage: "BILLING" as const,
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
            items: items || [
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

      res.status(httpStatusCode).json({
        ...jsonResponse,
        captureDetails
      });
    } else {
      console.error('❌ PayPal order capture failed:', httpStatusCode, jsonResponse);
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