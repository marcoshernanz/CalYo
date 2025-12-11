import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Text from "../ui/Text";
import CircularProgress from "../ui/CircularProgress";
import getColor from "@/lib/ui/getColor";
import { ComponentType } from "react";
import { LucideProps } from "lucide-react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import calcRatio from "@/lib/utils/calcRatio";

type Props = {
  item: {
    name: string;
    value: number;
    target: number;
    Icon: ComponentType<LucideProps>;
    color: string;
  };
  progress: SharedValue<number>;
  onPress?: () => void;
};

export default function HomeSummaryCardBig({ item, progress, onPress }: Props) {
  const itemProgress = useDerivedValue(
    () => calcRatio(item.value, item.target) * progress.value
  );

  return (
    <Button variant="base" size="base" onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.cardTextContainer}>
          <Text size="12" weight="600" color={getColor("mutedForeground")}>
            {item.name}
          </Text>
          <View style={styles.cardValueContainer}>
            <Text size="40" weight="600">
              {Math.round(item.value)}
            </Text>
            <Text
              size="20"
              color={getColor("mutedForeground")}
              style={styles.cardTargetText}
            >
              {" "}
              / {item.target}
            </Text>
          </View>
        </View>
        <View style={styles.cardProgressContainer}>
          <CircularProgress
            progress={itemProgress}
            color={item.color}
            strokeWidth={5}
            size={80}
          />
          <View style={styles.cardIconContainer}>
            <item.Icon size={20} strokeWidth={2.25} color={item.color} />
          </View>
        </View>
      </Card>
    </Button>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: getColor("background"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTextContainer: {},
  cardValueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  cardTargetText: {
    paddingBottom: 6,
  },
  cardProgressContainer: {
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
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
