import React, { useEffect, useState } from "react";
import { Stripe, loadStripe } from "@stripe/stripe-js";

interface Props {
  children: React.ReactNode;
}

export const StripeContext = React.createContext<
  Promise<Stripe | null> | undefined | null
>(null);

export const StripeProvider: React.FC<Props> = ({ children }) => {
  const [stripePromise, setStripePromise] = useState<
    Promise<Stripe | null> | undefined | null
  >();

  useEffect(() => {
    setStripePromise(loadStripe(import.meta.env.VITE_FIREBASE_APIKEY));
  }, []);

  return (
    <StripeContext.Provider value={stripePromise}>
      {children}
    </StripeContext.Provider>
  );
};
