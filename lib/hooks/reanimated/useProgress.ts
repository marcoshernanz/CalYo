import { useEffect } from "react";
import {
  cancelAnimation,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function useProgress() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500 });

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, [progress]);

  return progress;
}
