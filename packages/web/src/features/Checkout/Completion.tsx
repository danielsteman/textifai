import { Box, Button, Heading, Link } from "@chakra-ui/react";
import { loadStripe } from "@stripe/stripe-js";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PaymentIntent {
  errorMessage?: string;
  status?: string;
  id?: string;
}

const Completion = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const [paymentIntentState, setPaymentIntentState] = useState<PaymentIntent>({
    errorMessage: "",
    status: "",
    id: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!stripePromise) return;

    stripePromise.then(async (stripe: any) => {
      const url = new URL(window.location.href);
      const clientSecret = url.searchParams.get("payment_intent_client_secret");
      const { error, paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret
      );

      if (error) {
        setPaymentIntentState({ errorMessage: error.message });
      } else {
        setPaymentIntentState({
          status: paymentIntent.status,
          id: paymentIntent.id,
        });
      }
    });
  }, [stripePromise]);

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
      gap={4}
    >
      <Heading>Thank you!</Heading>
      <div
        id="messages"
        role="alert"
        style={paymentIntentState ? { display: "block" } : {}}
      >
        {paymentIntentState?.errorMessage ? (
          <>{paymentIntentState?.errorMessage}</>
        ) : (
          <Link
            href={`https://dashboard.stripe.com/test/payments/${
              paymentIntentState!.id
            }`}
            target="_blank"
            rel="noreferrer"
          >
            Your receipt
          </Link>
        )}
      </div>
      <Button onClick={() => navigate("/features/workspace")}>
        Let's get to work
      </Button>
    </Box>
  );
};

export default Completion;
