import { Platform } from "react-native";

const API_KEYS = {
  ios: "test_ZjhfAkugMURoPeCzmlORRXnWWbX",
  android: "test_ZjhfAkugMURoPeCzmlORRXnWWbX", // Usually these are different, but user provided one.
};

export const revenueCatConfig = {
  apiKey: Platform.select({
    ios: API_KEYS.ios,
    android: API_KEYS.android,
    default: API_KEYS.ios,
  }),
  entitlementId: "CalYo Pro",
};
