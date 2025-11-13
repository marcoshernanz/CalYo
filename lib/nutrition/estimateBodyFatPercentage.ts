import { ProfileData } from "@/convex/tables/profiles";

type Params = {
  weight: number;
  height: number;
  age: number;
  sex: ProfileData["sex"];
};

export default function estimateBodyFatPercentage({
  weight,
  height,
  age,
  sex,
}: Params) {
  const bmi = weight / (height * height);
  const sexFlag = sex === "male" ? 1 : 0;
  const rayBf = 1.2 * bmi + 0.23 * age - 10.8 * sexFlag - 5.4;

  const maxBf = 55;
  const minBf = 5;
  const bodyFat = Math.max(minBf, Math.min(maxBf, rayBf));

  return bodyFat;
}
