import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import Apple, { AppleProfile } from "@auth/core/providers/apple";
import { ResendOTP } from "./ResendOTP";
import { MutationCtx } from "./_generated/server";
import { profilesConfig } from "../config/profilesConfig";

type AppleProfileWithUser = AppleProfile & {
  user?: {
    name: {
      firstName: string;
      lastName: string;
    };
  };
};

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google,
    Apple({
      profile: (appleInfo: AppleProfileWithUser) => {
        const name = appleInfo.user
          ? `${appleInfo.user.name.firstName} ${appleInfo.user.name.lastName}`
          : undefined;
        return {
          id: appleInfo.sub,
          name: name,
          email: appleInfo.email,
        };
      },
    }),
    ResendOTP,
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx: MutationCtx, { userId }) {
      const profile = await ctx.db
        .query("profiles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      if (profile === null) {
        await ctx.db.insert("profiles", {
          userId,
          ...profilesConfig.defaultValues,
        });
      }
    },
  },
});
