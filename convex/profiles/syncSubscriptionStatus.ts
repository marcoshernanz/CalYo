import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import logError from "@/lib/utils/logError";
import { revenueCatConfig } from "@/config/revenueCatConfig";

export const syncSubscriptionStatus = action({
  args: {},
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("Unauthorized");

      const secretKey = process.env.REVENUECAT_SECRET_KEY;
      if (!secretKey) {
        throw new Error("REVENUECAT_SECRET_KEY is not set");
      }

      const response = await fetch(
        `https://api.revenuecat.com/v1/subscribers/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      // if (!response.ok) {
      //   throw new Error(`RevenueCat API error: ${response.statusText}`);
      // }

      // const data = await response.json();
      // const entitlements = data.subscriber?.entitlements || {};
      // const proEntitlement = entitlements[revenueCatConfig.entitlementId];

      // let isPro = false;
      // if (proEntitlement) {
      //   const expiresDate = proEntitlement.expires_date;
      //   if (expiresDate === null) {
      //     // Lifetime subscription
      //     isPro = true;
      //   } else {
      //     const now = new Date();
      //     const expiration = new Date(expiresDate);
      //     if (expiration > now) {
      //       isPro = true;
      //     }
      //   }
      // }

      // await ctx.runMutation(internal.profiles.updateProStatus.default, {
      //   isPro,
      //   userId,
      // });
    } catch (error) {
      logError("syncSubscriptionStatus error", error);
      // Don't throw to client, just log
    }
  },
});

export default syncSubscriptionStatus;
