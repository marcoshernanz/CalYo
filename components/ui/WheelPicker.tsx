import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "./Text";
import getColor from "@/lib/ui/getColor";

type Props = {
  data: string[];
  onValueChange?: (value: string) => void;
  initialValue?: string;
  itemStyle?: ViewStyle;
  ref?: React.Ref<FlatList<string>>;
};

export default function WheelPicker({
  data,
  onValueChange,
  initialValue,
  itemStyle,
  ref,
}: Props) {
  const numVisibleItems = 5;
  const itemHeight = 40;
  const containerHeight = itemHeight * numVisibleItems;

  const paddingCount = Math.floor(numVisibleItems / 2);
  const paddingItems: string[] = Array.from({ length: paddingCount }, () => "");

  const paddedData: string[] = [...paddingItems, ...data, ...paddingItems];

  const initialScrollIndex = initialValue ? data.indexOf(initialValue) : 0;
  const safeInitialScrollIndex =
    initialScrollIndex > -1 ? initialScrollIndex : 0;

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const centeredIndex = Math.round(
      (offsetY + containerHeight / 2 - itemHeight / 2) / itemHeight
    );

    const clampedIndex = Math.max(
      0,
      Math.min(centeredIndex, paddedData.length - 1)
    );
    const value = paddedData[clampedIndex];
    if (value && onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer, { height: containerHeight }]}>
        <View style={styles.indicatorContainer}>
          <LinearGradient
            colors={[getColor("background"), getColor("background", 0.6)]}
            style={styles.gradient}
            pointerEvents="none"
          />
          <View style={[styles.indicator, { height: itemHeight - 4 }]}></View>
          <LinearGradient
            colors={[getColor("background", 0.6), getColor("background")]}
            style={styles.gradient}
            pointerEvents="none"
          />
        </View>
        <FlatList
          ref={ref}
          data={paddedData}
          keyExtractor={(item, index) => `${item}-${index}`}
          snapToInterval={itemHeight}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          initialScrollIndex={safeInitialScrollIndex}
          getItemLayout={(_, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={[styles.item, { height: itemHeight }, itemStyle]}>
              <Text weight="600">{item}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    width: "100%",
  },
  indicatorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    flex: 1,
    width: "100%",
    zIndex: 1,
  },
  indicator: {
    width: "100%",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: getColor("mutedForeground"),
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
});
