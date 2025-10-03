import { StyleSheet, View } from "react-native";
import OnboardingStep from "../../OnboardingStep";
import SignInButtons from "@/components/auth/SignInButtons";

export default function OnboardingCreateAccount() {
  return (
    <OnboardingStep title="Crea tu cuenta">
      <View style={styles.container}>
        <View style={styles.signInButtonsContainer}>
          <SignInButtons />
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
