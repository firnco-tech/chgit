import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// CRITICAL: Force load .env file and override ALL environment variables (including Replit Secrets)
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  envVars.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=');
      // FORCE override any existing value (including Replit Secrets)
      delete process.env[key]; // Delete first to ensure override
      process.env[key] = value;
      console.log(`🔧 Force loaded env var: ${key} = ${value.substring(0, 8)}***`);
    }
  });
}

// CRITICAL: Verify Stripe keys are live keys and terminate if not
if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
  console.error('❌ CRITICAL ERROR: STRIPE_SECRET_KEY is not a live key!');
  console.error('❌ Current key starts with:', process.env.STRIPE_SECRET_KEY.substring(0, 8));
  console.error('❌ Server will NOT start with test keys');
  process.exit(1);
}

if (process.env.VITE_STRIPE_PUBLIC_KEY && !process.env.VITE_STRIPE_PUBLIC_KEY.startsWith('pk_live_')) {
  console.error('❌ CRITICAL ERROR: VITE_STRIPE_PUBLIC_KEY is not a live key!');
  console.error('❌ Current key starts with:', process.env.VITE_STRIPE_PUBLIC_KEY.substring(0, 8));
  console.error('❌ Server will NOT start with test keys');
  process.exit(1);
}

console.log('✅ All Stripe keys verified as LIVE keys');
console.log('✅ Payment processing will use LIVE mode');

import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Trust proxy for cookie handling in development/production environments
app.set('trust proxy', 1);

// Cookie parser for reading HTTP-only cookies
app.use(cookieParser());

// Session configuration for authentication
app.use(session({
  secret: process.env.SESSION_SECRET || 'holacupid-dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax', // Important for session cookies
  },
  name: 'sessionId', // Custom session name
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
