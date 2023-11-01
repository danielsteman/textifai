# Payments

Check out [Stripe Elements](https://github.com/stripe-samples/accept-a-payment/tree/main/payment-element)

## 🌎 Environment variables

The Stripe API key can be found [here](https://dashboard.stripe.com/apikeys).

```
STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

Login with Stripe CLI:

```
stripe login
```

Start forwarding webhooks:

```
stripe listen --forward-to localhost:4242/webhook
```

Documentation:

- [Payment element](https://github.com/stripe-samples/accept-a-payment/tree/main/payment-element)
- [Listen for Stripe events](https://stripe.com/docs/webhooks#configure-webhook-settings)
