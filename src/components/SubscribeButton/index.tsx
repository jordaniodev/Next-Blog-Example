import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

export function SubscribeButton() {
  const session = useSession();
  const router = useRouter();
  async function handleSubscribe() {
    if (session.status === "loading" || session.status === "unauthenticated") {
      signIn("github");
      return;
    }
    if (session.data.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      stripe.redirectToCheckout({ sessionId });
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <button
      type="button"
      data-testid="button-subscribe"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      {" "}
      Subscribe now{" "}
    </button>
  );
}
