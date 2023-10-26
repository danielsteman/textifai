import { useContext, useEffect, useState } from "react";
import { StripeContext } from "../../app/providers/StripeProvider";

interface PaymentIntent {
  errorMessage?: string;
  status?: string;
  id?: string;
}

const Completion = () => {
  const [paymentIntentState, setPaymentIntentState] = useState<PaymentIntent>();
  const stripePromise = useContext(StripeContext);

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
    <>
      <h1>Thank you!</h1>
      <a href="/">home</a>
      <div
        id="messages"
        role="alert"
        style={paymentIntentState ? { display: "block" } : {}}
      >
        {paymentIntentState?.errorMessage ? (
          <>{paymentIntentState?.errorMessage}</>
        ) : (
          <a
            href={`https://dashboard.stripe.com/test/payments/${
              paymentIntentState!.id
            }`}
            target="_blank"
            rel="noreferrer"
          >
            {paymentIntentState!.id}
          </a>
        )}
      </div>
    </>
  );
};

export default Completion;
