import { StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  size?: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
};

export default function ScannerRect({
  size = 56,
  borderRadius = 16,
  borderColor = "#FFFFFF",
  borderWidth = 5,
}: Props) {
  const cornerStyle: ViewStyle = {
    width: size,
    height: size,
    borderColor: borderColor,
    position: "absolute",
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          cornerStyle,
          styles.topLeftCorner,
          {
            borderTopLeftRadius: borderRadius,
            borderLeftWidth: borderWidth,
            borderTopWidth: borderWidth,
          },
        ]}
      ></View>
      <View
        style={[
          cornerStyle,
          styles.topRightCorner,
          {
            borderTopRightRadius: borderRadius,
            borderRightWidth: borderWidth,
            borderTopWidth: borderWidth,
          },
        ]}
      ></View>
      <View
        style={[
          cornerStyle,
          styles.bottomLeftCorner,
          {
            borderBottomLeftRadius: borderRadius,
            borderLeftWidth: borderWidth,
            borderBottomWidth: borderWidth,
          },
        ]}
      ></View>
      <View
        style={[
          cornerStyle,
          styles.bottomRightCorner,
          {
            borderBottomRightRadius: borderRadius,
            borderRightWidth: borderWidth,
            borderBottomWidth: borderWidth,
          },
        ]}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  topLeftCorner: {
    top: 0,
    left: 0,
  },
  topRightCorner: {
    top: 0,
    right: 0,
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0,
  },
  bottomRightCorner: {
    bottom: 0,
    right: 0,
  },
});
