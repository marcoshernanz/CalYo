import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "./Text";
import getColor from "@/lib/utils/getColor";

interface Props {
  data: string[];
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

export default function WheelPicker({ data, onValueChange }: Props) {
  const itemHeight = 40;
  const numVisibleItems = 5;
  const containerHeight = itemHeight * numVisibleItems;

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const centeredIndex = Math.round(
      (offsetY + containerHeight / 2 - itemHeight / 2) / itemHeight
    );

    const clampedIndex = Math.max(0, Math.min(centeredIndex, data.length - 1));
    const value = data[clampedIndex];
    if (value && onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <View style={styles.indicatorContainer}>
        <LinearGradient
          colors={[getColor("background"), getColor("background", 0.5)]}
          style={styles.gradient}
          pointerEvents="none"
        />
        <View style={[styles.indicator, { height: itemHeight }]}></View>
        <LinearGradient
          colors={[getColor("background", 0.5), getColor("background")]}
          style={styles.gradient}
          pointerEvents="none"
        />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item}-${index}`}
        snapToInterval={itemHeight}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(data, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={[styles.textContainer, { height: itemHeight }]}>
            <Text style={styles.text}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    // borderColor: getColor("secondary"), TODO
    borderColor: getColor("foreground"),
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: 600,
  },
});
