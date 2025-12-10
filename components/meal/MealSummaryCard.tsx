import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Text from "../ui/Text";
import WithSkeleton from "../ui/WithSkeleton";
import { ComponentType } from "react";
import { LucideProps } from "lucide-react-native";
import getColor from "@/lib/ui/getColor";

type Props = {
  macro: {
    label: string;
    Icon: ComponentType<LucideProps>;
    color: string;
    value: number;
  };
  loading: boolean;
};

export default function MealSummaryCard({ macro, loading }: Props) {
  return (
    <Button
      // key={`macro-${macro.label}-${index}`}
      variant="base"
      size="base"
      style={styles.macroCardButton}
    >
      <Card style={styles.macroCard}>
        <Text size="12" color={getColor("mutedForeground")}>
          {macro.label}
        </Text>
        <View style={styles.macroValueContainer}>
          <View style={styles.macroIconContainer}>
            <macro.Icon size={14} color={macro.color} />
          </View>
          <WithSkeleton
            loading={loading}
            skeletonStyle={{ height: 16, width: 40, borderRadius: 4 }}
          >
            <Text size="16" weight="600">
              {macro.value} g
            </Text>
          </WithSkeleton>
        </View>
      </Card>
    </Button>
  );
}

const styles = StyleSheet.create({
  macroCardButton: {
    flex: 1,
  },
  macroCard: {
    flex: 1,
    padding: 12,
    gap: 8,
  },
  macroValueContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  macroIconContainer: {
    height: 22,
    width: 22,
    borderRadius: 16,
    backgroundColor: getColor("muted"),
    alignItems: "center",
    justifyContent: "center",
  },
});
