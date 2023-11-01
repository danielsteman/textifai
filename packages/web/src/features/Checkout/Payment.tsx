import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import { config } from "../../app/config/config";
import theme from "../../app/themes/theme";
import { Box, Heading, useColorMode } from "@chakra-ui/react";
import axios from "axios";

const Payment = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const [clientSecret, setClientSecret] = useState("");
  const { colorMode } = useColorMode();

  const appearance: Appearance = {
    theme: "stripe",
    variables: {
      colorText: "white",
      colorDanger: theme.colors[colorMode].error,
      colorPrimaryText: theme.colors[colorMode].onPrimary,
      colorPrimary: theme.colors[colorMode].primary,
      colorBackground: theme.colors[colorMode].surface,
    },
  };

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axios.get(
          `${config.payments.url}/api/payments/create-payment-intent`
        );
        const { clientSecret } = response.data;
        setClientSecret(clientSecret);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClientSecret();
  }, []);

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <Heading py={4} fontWeight={800}>
        Enter your payment details
      </Heading>
      <Box w={600}>
        {clientSecret && stripePromise && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance }}
          >
            <CheckoutForm />
          </Elements>
        )}
      </Box>
    </Box>
  );
};

export default Payment;
