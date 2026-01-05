import { StyleSheet, View } from "react-native";
import OnboardingStep from "../../OnboardingStep";
import SignInButtons from "@/components/auth/SignInButtons";
import {
  isOnboardingDataComplete,
  useOnboardingContext,
} from "@/context/OnboardingContext";
import { useState, useCallback } from "react";
import sleep from "@/lib/utils/sleep";

export default function OnboardingCreateAccount() {
  const { data } = useOnboardingContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDataComplete = isOnboardingDataComplete(data);

  const handleOnboardingComplete = useCallback(async () => {
    if (isSubmitting || !isOnboardingDataComplete(data)) return;
    setIsSubmitting(true);
    try {
      await sleep(1000);
    } finally {
      setIsSubmitting(false);
    }
  }, [data, isSubmitting]);

  return (
    <OnboardingStep title="Crea tu cuenta">
      <View style={styles.container}>
        <View style={styles.signInButtonsContainer}>
          <SignInButtons
            disabled={!isDataComplete || isSubmitting}
            onSuccess={handleOnboardingComplete}
            shouldRedirect={false}
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
