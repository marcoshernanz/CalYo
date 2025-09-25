const colors = {
  primary: [59, 130, 246], // #3B82F6
  primaryLight: [191, 219, 254], // #bfdbfe
  background: [249, 250, 251], // #f9fafb
  foreground: [3, 7, 18], // #030712
  mutedForeground: [107, 114, 128], // #6b7280
  secondary: [229, 231, 235], // #e5e7eb
  destructive: [239, 68, 68], // #ef4444
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
