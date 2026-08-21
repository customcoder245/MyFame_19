const PAYMENT_INTENT_URL = process.env.EXPO_PUBLIC_AD_PAYMENT_INTENT_URL || "";
const FALLBACK_CLIENT_SECRET =
  process.env.EXPO_PUBLIC_STRIPE_TEST_CLIENT_SECRET || "";

/**
 * Requests a PaymentIntent client secret from the backend.
 * Replace the fallback implementation once the real endpoint is connected.
 */
export const requestAdPaymentIntent = async ({ amount, currency }) => {
  if (!amount || Number.isNaN(Number(amount))) {
    throw new Error("Invalid amount. Make sure price is provided.");
  }

  if (PAYMENT_INTENT_URL) {
    const response = await fetch(PAYMENT_INTENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        message || "Unable to create payment intent. Please try again."
      );
    }

    return response.json();
  }

  if (!FALLBACK_CLIENT_SECRET) {
    throw new Error(
      "Missing payment intent config. Set EXPO_PUBLIC_AD_PAYMENT_INTENT_URL or EXPO_PUBLIC_STRIPE_TEST_CLIENT_SECRET."
    );
  }

  return { clientSecret: FALLBACK_CLIENT_SECRET };
};

export default requestAdPaymentIntent;


