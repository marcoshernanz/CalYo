import { makeMutable } from "react-native-reanimated";

const PENDING_TIMEOUTS = makeMutable<Record<number, boolean>>({});
const TIMEOUT_ID = makeMutable(0);

export type AnimatedTimeoutID = number;

function removeFromPendingTimeouts(id: AnimatedTimeoutID): void {
  "worklet";
  PENDING_TIMEOUTS.modify((pendingTimeouts) => {
    "worklet";
    delete pendingTimeouts[id];
    return pendingTimeouts;
  });
}

export function setAnimatedTimeout(
  callback: () => void,
  delay: number
): AnimatedTimeoutID {
  "worklet";
  let startTimestamp: number;

  const currentId = TIMEOUT_ID.value;
  PENDING_TIMEOUTS.modify((pendingTimeouts) => {
    "worklet";
    pendingTimeouts[currentId] = true;
    return pendingTimeouts;
  });
  TIMEOUT_ID.value += 1;

  const step = (newTimestamp: number) => {
    "worklet";
    if (!PENDING_TIMEOUTS.value[currentId]) {
      return;
    }
    if (startTimestamp === undefined) {
      startTimestamp = newTimestamp;
    }
    if (newTimestamp >= startTimestamp + delay) {
      removeFromPendingTimeouts(currentId);
      callback();
      return;
    }
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);

  return currentId;
}

export function clearAnimatedTimeout(handle: AnimatedTimeoutID): void {
  "worklet";
  removeFromPendingTimeouts(handle);
}
