import React, { useEffect, useState } from "react";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface Props {
  children: React.ReactNode;
}

export const StripeContext = React.createContext<
  Stripe | PromiseLike<Stripe | null> | null
>(null);

export const StripeProvider: React.FC<Props> = ({ children }) => {
  const [stripePromise, setStripePromise] = useState<
    Stripe | PromiseLike<Stripe | null> | null
  >();

  useEffect(() => {
    setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
  }, []);

  return (
    <>
      {stripePromise && <Elements stripe={stripePromise}>{children}</Elements>}
    </>
  );
};
