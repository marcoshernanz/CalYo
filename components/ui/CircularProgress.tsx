import getColor from "@/lib/utils/getColor";
import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  progress: number | SharedValue<number>;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export default function CircularProgress({
  progress,
  size,
  strokeWidth = 8,
  color = getColor("foreground"),
}: Props) {
  const [resolvedSize, setResolvedSize] = useState(0);

  const radius = (resolvedSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const isStaticProgress = typeof progress === "number";

  const staticProgress = useSharedValue(isStaticProgress ? progress : 0);
  const sharedProgress = isStaticProgress ? staticProgress : progress;

  const animatedProps = useAnimatedProps(() => {
    const clamped = Math.max(0, Math.min(sharedProgress.value, 1));
    return {
      strokeDashoffset: circumference * (1 - clamped),
    };
  }, [circumference]);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const nextSize = Math.min(
      nativeEvent.layout.width,
      nativeEvent.layout.height
    );

    if (nextSize && nextSize !== size) {
      setResolvedSize(size ?? nextSize);
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Svg width={size} height={resolvedSize}>
        <Circle
          cx={resolvedSize / 2}
          cy={resolvedSize / 2}
          r={radius}
          stroke={getColor("secondary")}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={resolvedSize / 2}
          cy={resolvedSize / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90, ${resolvedSize / 2}, ${resolvedSize / 2})`}
          fill="none"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
});

// import getColor from "@/lib/utils/getColor";
// import { useEffect, useState } from "react";
// import { LayoutChangeEvent, StyleSheet, View } from "react-native";
// import Svg, { Circle } from "react-native-svg";
// import Animated, {
//   SharedValue,
//   useAnimatedProps,
//   useSharedValue,
// } from "react-native-reanimated";

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// interface Props {
//   progress: number | SharedValue<number>;
//   size?: number;
//   strokeWidth?: number;
//   color?: string;
// }

// export default function CircularProgress({
//   progress,
//   size,
//   strokeWidth = 8,
//   color = getColor("foreground"),
// }: Props) {
//   const [resolvedSize, setResolvedSize] = useState(size ?? 0);
//   const staticProgress = useSharedValue(
//     typeof progress === "number" ? progress : 0
//   );
//   const sharedProgress =
//     typeof progress === "number" ? staticProgress : progress;

//   useEffect(() => {
//     if (typeof progress === "number") {
//       staticProgress.value = progress;
//     }
//   }, [progress, staticProgress]);

//   useEffect(() => {
//     if (size) {
//       setResolvedSize(size);
//     }
//   }, [size]);

//   const radius = Math.max((resolvedSize - strokeWidth) / 2, 0);
//   const circumference = 2 * Math.PI * radius;

//   const animatedProps = useAnimatedProps(() => {
//     const clamped = Math.max(0, Math.min(sharedProgress.value, 1));
//     return {
//       strokeDashoffset: circumference * (1 - clamped),
//     };
//   }, [circumference]);

//   const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
//     if (size) {
//       return;
//     }

//     const nextSize = Math.min(
//       nativeEvent.layout.width,
//       nativeEvent.layout.height
//     );

//     if (nextSize) {
//       setResolvedSize(nextSize);
//     }
//   };

//   return (
//     <View style={styles.container} onLayout={handleLayout}>
//       {resolvedSize > 0 && (
//         <Svg width={resolvedSize} height={resolvedSize}>
//           <Circle
//             cx={resolvedSize / 2}
//             cy={resolvedSize / 2}
//             r={radius}
//             stroke={getColor("secondary")}
//             strokeWidth={strokeWidth}
//             fill="none"
//           />
//           <AnimatedCircle
//             cx={resolvedSize / 2}
//             cy={resolvedSize / 2}
//             r={radius}
//             stroke={color}
//             strokeWidth={strokeWidth}
//             strokeDasharray={[circumference, circumference]}
//             strokeLinecap="round"
//             transform={`rotate(-90, ${resolvedSize / 2}, ${resolvedSize / 2})`}
//             fill="none"
//             animatedProps={animatedProps}
//           />
//         </Svg>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     height: "100%",
//     width: "100%",
//   },
// });
