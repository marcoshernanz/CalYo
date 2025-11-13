import { ProfileData } from "@/convex/tables/profiles";

type Params = {
  sex: ProfileData["sex"];
  weight: number;
  height: number;
  age: number;
};

export default function computeBmr({ sex, weight, height, age }: Params) {
  const add = sex === "male" ? 5 : -161;
  const bmr = 10 * weight + 625 * height - 5 * age + add;
  return bmr;
}
