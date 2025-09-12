import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export default function Onboarding() {
  return (
    <OnboardingLayout
      header="Crear cuenta"
      title="What is your height?"
      numSteps={10}
      currentStep={3}
    >
      Step 1
    </OnboardingLayout>
  );
}
