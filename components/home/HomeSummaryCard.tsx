import calcRatio from "@/lib/utils/calcRatio";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { StyleSheet, View } from "react-native";
import getColor from "@/lib/ui/getColor";
import Text from "../ui/Text";
import CircularProgress from "../ui/CircularProgress";
import { ComponentType, useEffect } from "react";
import { LucideProps } from "lucide-react-native";

type Props = {
  item: {
    name: string;
    value: number;
    target: number;
    Icon: ComponentType<LucideProps>;
    color: string;
  };
  progress: SharedValue<number>;
};

export default function HomeSummaryCard({ item, progress }: Props) {
  const ratio = calcRatio(item.value, item.target);
  const animatedRatio = useSharedValue(ratio);

  useEffect(() => {
    animatedRatio.value = withTiming(ratio, { duration: 750 });
  }, [ratio, animatedRatio]);

  const itemProgress = useDerivedValue(
    () => animatedRatio.value * progress.value
  );

  return (
    <Button variant="base" size="base" style={{ flex: 1 }}>
      <Card style={styles.card}>
        <Text size="12" weight="600" color={getColor("mutedForeground")}>
          {item.name}
        </Text>
        <View style={styles.cardValueContainer}>
          <Text size="18" weight="600">
            {Math.round(item.value)}
          </Text>
          <Text
            size="10"
            color={getColor("mutedForeground")}
            style={styles.cardTargetText}
          >
            {" "}
            / {item.target}
          </Text>
        </View>
        <View style={styles.cardProgressContainer}>
          <CircularProgress
            progress={itemProgress}
            color={item.color}
            strokeWidth={4}
            size={80}
          />
          <View style={styles.cardIconContainer}>
            <item.Icon size={18} strokeWidth={2.25} />
          </View>
        </View>
      </Card>
    </Button>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: getColor("background"),
    flex: 1,
    padding: 16,
  },
  cardValueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 12,
    paddingTop: 4,
  },
  cardTargetText: {
    paddingBottom: 3,
  },
  cardProgressContainer: {
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  cardIconContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: getColor("muted"),
  },
});
