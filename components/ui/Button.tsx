import React from "react";
import getColor from "@/lib/utils/getColor";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import Text, { TextProps } from "./Text";

interface Props {
  children: React.ReactNode;
  pressableProps?: Omit<PressableProps, "children">;
  textProps?: Omit<TextProps, "children">;
}

export default function Button({ children, pressableProps, textProps }: Props) {
  const incomingStyle = pressableProps?.style;
  const composedStyle: PressableProps["style"] =
    typeof incomingStyle === "function"
      ? (state) => [styles.button, incomingStyle(state)]
      : [styles.button, incomingStyle];

  return (
    <Pressable {...pressableProps} style={composedStyle}>
      <Text {...textProps} style={[styles.text, textProps?.style]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: getColor("foreground"),
    height: 66,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: getColor("background"),
    fontSize: 20,
    fontWeight: "600",
  },
});
