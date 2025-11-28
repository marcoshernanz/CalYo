import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import Apple, { AppleProfile } from "@auth/core/providers/apple";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { ResendOTP } from "./ResendOTP";
import { MutationCtx } from "./_generated/server";
import { api } from "./_generated/api";
import { profilesConfig } from "../config/profilesConfig";
import testingConfig from "../config/testingConfig";

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
    ConvexCredentials({
      id: "password",
      authorize: async (credentials, ctx) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if (
          email === testingConfig.testEmail &&
          password === testingConfig.testPassword
        ) {
          const userId = await ctx.runMutation(
            api.testing.getOrCreateTestUser.default,
            { email, password }
          );
          return { userId };
        }
        return null;
      },
    }),
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
