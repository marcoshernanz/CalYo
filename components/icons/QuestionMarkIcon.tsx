import React, { forwardRef } from "react";
import type { LucideIcon, LucideProps } from "lucide-react-native";
import { IconQuestionMark } from "@tabler/icons-react-native";

const QuestionMarkIcon = forwardRef(function QuestionMarkIcon(
  { color = "currentColor", size = 28, strokeWidth, ...rest }: LucideProps,
  ref: any
) {
  const numericSize = typeof size === "string" ? Number(size) || 28 : size;

  return (
    <IconQuestionMark
      ref={ref}
      color={color as string}
      size={numericSize}
      {...(rest as any)}
    />
  );
}) as unknown as LucideIcon;

export default QuestionMarkIcon;
