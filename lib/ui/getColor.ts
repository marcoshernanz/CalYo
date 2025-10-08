const colors = {
  white: [255, 255, 255], // #ffffff
  primary: [59, 130, 246], // #3B82F6
  primaryLight: [191, 219, 254], // #bfdbfe
  background: [249, 250, 251], // #f9fafb
  foreground: [3, 7, 18], // #030712
  muted: [243, 244, 246], // #f3f4f6
  mutedForeground: [107, 114, 128], // #6b7280
  secondary: [229, 231, 235], // #e5e7eb
  destructive: [239, 68, 68], // #ef4444

  carb: [234, 179, 8], // #eab308
  protein: [239, 68, 68], // #ef4444
  fat: [16, 185, 129], // #10b981

  red: [239, 68, 68], // #ef4444
  orange: [249, 115, 22], // #f97316
  amber: [245, 158, 11], // #f59e0b
  yellow: [234, 179, 8], // #eab308
  lime: [132, 204, 22], // #84cc16
  green: [34, 197, 94], // #22c55e
  emerald: [16, 185, 129], // #10b981
  teal: [20, 184, 166], // #14b8a6
  cyan: [6, 182, 212], // #06b6d4
  sky: [14, 165, 233], // #0ea5e9
  blue: [59, 130, 246], // #3b82f6
  indigo: [99, 102, 241], // #6366f1
  violet: [139, 92, 246], // #8b5cf6
  purple: [168, 85, 247], // #a855f7
  fuchsia: [217, 70, 239], // #d946ef
  pink: [236, 72, 153], // #ec4899
  rose: [244, 63, 94], // #f43f5e
} as const;

type ColorName = keyof typeof colors;

export default function getColor(name: ColorName, opacity?: number) {
  "worklet";
  const color = colors[name];

  if (opacity !== undefined) {
    return `rgba(${color.join(", ")}, ${opacity})`;
  }

  return `rgb(${color.join(", ")})`;
}
