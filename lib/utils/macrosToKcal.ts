type Params = {
  protein?: number;
  fat?: number;
  carbs?: number;
}

export default function macrosToKcal({
  protein = 0,
  fat = 0,
  carbs = 0,
}: Params): number {
  return protein * 4 + fat * 9 + carbs * 4;
}
