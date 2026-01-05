import Paywall from "@/components/paywall/Paywall";
import {
  isOnboardingDataComplete,
  useOnboardingContext,
} from "@/context/OnboardingContext";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function OnboardingPaywall() {
  const router = useRouter();
  const { data, targets } = useOnboardingContext();
  const completeOnboarding = useMutation(
    api.profiles.completeOnboarding.default
  );
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    try {
      if (!isOnboardingDataComplete(data)) return;
      await completeOnboarding({ data, targets });

      if (router.canDismiss()) router.dismissAll();
      router.replace("/app");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Paywall type="close" onClose={handleComplete} onSuccess={handleComplete} />
  );
}
