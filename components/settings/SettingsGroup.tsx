import { StyleSheet } from "react-native";
import Card from "../ui/Card";
import React, { ComponentProps } from "react";
import SettingsItem from "./SettingsItem";

type Props = {
  children: React.ReactNode;
};

export default function SettingsGroup({ children }: Props) {
  const items = React.Children.toArray(children) as React.ReactElement<
    ComponentProps<typeof SettingsItem>
  >[];

  return (
    <Card style={styles.card}>
      {items.map((child, index) =>
        React.cloneElement(child, {
          isLast: index === items.length - 1,
        })
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
  },
});
