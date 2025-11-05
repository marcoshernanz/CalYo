type AccurateInterval = {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export default function createAccurateInterval(
  callback: () => void,
  interval = 1000
): AccurateInterval {
  let expected = 0;
  let timeout: NodeJS.Timeout | null = null;
  let paused = true;
  let pauseTime = 0;
  let remainingTimeAtPause = 0;

  const step = () => {
    const now = Date.now();
    const drift = now - expected;

    callback();

    expected += interval;

    if (drift > interval) {
      expected = now + interval;
    }

    if (!paused) {
      const wait = Math.max(0, interval - drift);
      timeout = setTimeout(step, wait);
    }
  };

  const start = () => {
    if (paused) {
      paused = false;
      expected = Date.now() + interval;
      timeout = setTimeout(step, interval);
    }
  };

  const stop = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    paused = true;
    pauseTime = 0;
    remainingTimeAtPause = 0;
  };

  const pause = () => {
    if (!paused && timeout) {
      clearTimeout(timeout);
      timeout = null;
      paused = true;
      pauseTime = Date.now();

      remainingTimeAtPause = Math.max(0, expected - pauseTime);
    }
  };

  const resume = () => {
    if (paused) {
      paused = false;
      const now = Date.now();

      if (pauseTime > 0 && remainingTimeAtPause > 0) {
        expected = now + remainingTimeAtPause;
        timeout = setTimeout(step, remainingTimeAtPause);
      } else {
        expected = now + interval;
        timeout = setTimeout(step, interval);
      }

      pauseTime = 0;
      remainingTimeAtPause = 0;
    }
  };

  return {
    start,
    stop,
    pause,
    resume,
  };
}
