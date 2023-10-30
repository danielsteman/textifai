import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { config } from "../../app/config/config";
import theme from "../../app/themes/theme";
import { useColorMode } from "@chakra-ui/react";

const Payment = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const [clientSecret, setClientSecret] = useState("");
  const { colorMode } = useColorMode();

  const appearance: Appearance = {
    theme: "stripe",
    variables: {
      colorPrimaryText: theme.colors[colorMode].onPrimary,
      colorPrimary: theme.colors[colorMode].primary,
      colorBackground: theme.colors[colorMode].surface,
    },
  };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(`${config.payments.url}/api/payments/create-payment-intent`)
      .then((res) => {
        return res.json();
      })
      .then(({ clientSecret }: any) => setClientSecret(clientSecret));
  }, []);

  return (
    <>
      <h1>Payment</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default Payment;
