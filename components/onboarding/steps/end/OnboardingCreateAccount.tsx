import { StyleSheet, View } from "react-native";
import OnboardingStep from "../../OnboardingStep";
import SignInButtons from "@/components/auth/SignInButtons";
import {
  isOnboardingDataComplete,
  useOnboardingContext,
} from "@/context/OnboardingContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useCallback } from "react";

export default function OnboardingCreateAccount() {
  const { data, targets } = useOnboardingContext();
  const completeOnboarding = useMutation(
    api.profiles.completeOnboarding.default
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDataComplete = isOnboardingDataComplete(data);

  const handleOnboardingComplete = useCallback(async () => {
    if (isSubmitting || !isOnboardingDataComplete(data)) return;
    setIsSubmitting(true);
    try {
      await completeOnboarding({ data, targets });
    } finally {
      setIsSubmitting(false);
    }
  }, [completeOnboarding, data, isSubmitting, targets]);

  return (
    <OnboardingStep title="Crea tu cuenta">
      <View style={styles.container}>
        <View style={styles.signInButtonsContainer}>
          <SignInButtons
            disabled={!isDataComplete || isSubmitting}
            onSuccess={handleOnboardingComplete}
          />
        </View>
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  signInButtonsContainer: {
    width: "100%",
  },
});
