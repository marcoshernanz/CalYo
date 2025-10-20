export default function l2Normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (!isFinite(norm) || norm === 0) {
    return vector;
  }

  return vector.map((x) => x / norm);
}
