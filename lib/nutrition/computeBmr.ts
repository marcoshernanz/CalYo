import { OnboardingValues } from "@/context/OnboardingContext";

interface Params {
  sex: OnboardingValues["sex"];
  weight: number;
  height: number;
  age: number;
}

export default function computeBmr({ sex, weight, height, age }: Params) {
  const add = sex === "male" ? 5 : -161;
  const bmr = 10 * weight + 625 * height - 5 * age + add;
  return bmr;
}
