import env from "dotenv";
import cors from "cors";
env.config({ path: "../.env" });

import bodyParser from "body-parser";
import express from "express";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  appInfo: {
    // For sample support and debugging, not required for production:
    name: "stripe-samples/accept-a-payment",
    url: "https://github.com/stripe-samples",
    version: "0.0.2",
  },
  typescript: true,
});

const port = process.env.PORT || 4242;
const app = express();

app.use(cors());

app.listen(port, (): void =>
  console.log(`Node server listening on port ${port}!`)
);

app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === "/api/payments/webhook") {
      next();
    } else {
      bodyParser.json()(req, res, next);
    }
  }
);

const router = express.Router();

router.get("/config", (_: express.Request, res: express.Response): void => {
  // Serve checkout page.
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.get(
  "/create-payment-intent",
  async (req: express.Request, res: express.Response): Promise<void> => {
    // Create a PaymentIntent with the order amount and currency.
    const params: Stripe.PaymentIntentCreateParams = {
      amount: 1999,
      currency: "EUR",
      automatic_payment_methods: {
        enabled: true,
      },
    };

    try {
      const paymentIntent: Stripe.PaymentIntent =
        await stripe.paymentIntents.create(params);

      // Send publishable key and PaymentIntent client_secret to client.
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (e: any) {
      res.status(400).send({
        error: {
          message: e.message,
        },
      });
    }
  }
);

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard:
// https://dashboard.stripe.com/test/webhooks
router.post(
  "/webhook",
  // Use body-parser to retrieve the raw body as a buffer.
  bodyParser.raw({ type: "application/json" }),
  async (req: express.Request, res: express.Response): Promise<void> => {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"]!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      res.sendStatus(400);
      return;
    }

    // Extract the data from the event.
    const data: Stripe.Event.Data = event.data;
    const eventType: string = event.type;

    if (eventType === "payment_intent.succeeded") {
      // Cast the event into a PaymentIntent to make use of the types.
      const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
      // Funds have been captured
      // Fulfill any orders, e-mail receipts, etc
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds).
      console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
      console.log("💰 Payment captured!");
    } else if (eventType === "payment_intent.payment_failed") {
      // Cast the event into a PaymentIntent to make use of the types.
      const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
      console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
      console.log("❌ Payment failed.");
    }
    res.sendStatus(200);
  }
);

app.use("/api/payments", router);

app.listen(port, (): void =>
  console.log(`Node server listening on port ${port}!`)
);
