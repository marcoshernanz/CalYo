export default function calcRatio(value: number, target: number) {
  "worklet";
  if (target <= 0) {
    return 0;
  }
  return Math.min(1, value / target);
}
