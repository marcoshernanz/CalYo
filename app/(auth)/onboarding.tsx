import Onboarding from "@/components/onboarding/Onboarding";
import OnboardingContextProvider from "@/context/OnboardingContext";

export default function OnboardingScreen() {
  return (
    <OnboardingContextProvider>
      <Onboarding />
    </OnboardingContextProvider>
  );
}
