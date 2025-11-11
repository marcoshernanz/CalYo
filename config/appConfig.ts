import Constants from "expo-constants";

const appVariant = Constants.expoConfig?.extra?.APP_VARIANT as
  | string
  | undefined;
if (!appVariant) {
  throw new Error("APP_VARIANT is not defined in expo config extras");
}

const storageKeyBase = "appState";

const storageKey =
  appVariant === "development" ? `${storageKeyBase}-dev` : storageKeyBase;

export const appConfig = {
  storageKey,
} as const;
