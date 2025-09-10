const colors = {
  background: [249, 250, 251], // #f9fafb
  foreground: [3, 7, 18], // #030712
  mutedForeground: [107, 114, 128], // #6b7280
  secondary: [229, 231, 235], // #e5e7eb
  secondaryForeground: [107, 114, 128], // #030712
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
