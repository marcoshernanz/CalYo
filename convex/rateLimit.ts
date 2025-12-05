import { RateLimiter, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

const DAY = 24 * HOUR;

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  analyzeMealPhoto: {
    kind: "fixed window",
    rate: 20,
    period: DAY,
  },
});

export const { getRateLimit, getServerTime } = rateLimiter.hookAPI(
  "analyzeMealPhoto",
  {
    key: async (ctx) => {
      const userId = await getAuthUserId(ctx);
      return userId ?? "anonymous";
    },
  }
);
