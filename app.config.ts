import { ConfigContext, ExpoConfig } from "expo/config";

const appVariant = process.env.APP_VARIANT;
const isDevelopment = appVariant === "development";

const getUniqueIdentifier = () => {
  if (isDevelopment) {
    return "com.marcoshernanz.calyo.dev";
  } else {
    return "com.marcoshernanz.calyo";
  }
};

const getAppName = () => {
  if (isDevelopment) {
    return "Calyo (Dev)";
  } else {
    return "Calyo";
  }
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "Calyo",
  version: "1.0.0",
  orientation: "portrait",
  // icon: "./assets/images/icon.png",
  scheme: "calyo",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    bundleIdentifier: getUniqueIdentifier(),
    supportsTablet: false,
  },
  android: {
    package: getUniqueIdentifier(),
    // "adaptiveIcon": {
    //   "foregroundImage": "./assets/images/adaptive-icon.png",
    //   "backgroundColor": "#ffffff"
    // },
    edgeToEdgeEnabled: true,
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        // image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    APP_VARIANT: appVariant,
  },
});
