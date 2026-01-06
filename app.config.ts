import type { ExpoConfig } from "expo/config";

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
    return "CalYo (Dev)";
  } else {
    return "CalYo";
  }
};

export default (): ExpoConfig => ({
  name: getAppName(),
  slug: "Calyo",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "calyo",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    bundleIdentifier: getUniqueIdentifier(),
    supportsTablet: false,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    usesAppleSignIn: true,
  },
  android: {
    package: getUniqueIdentifier(),
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#F9FAFB",
    },
    edgeToEdgeEnabled: true,
  },
  plugins: [
    "expo-secure-store",
    "expo-apple-authentication",
    "expo-router",
    "expo-localization",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        backgroundColor: "#F9FAFB",
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission:
          "CalYo uses the camera to let you take photos of your meals so the AI can calculate calories and macros.",
        recordAudioAndroid: false,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "CalYo needs access to your photos to let you import food images for calorie analysis.",
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    APP_VARIANT: appVariant,
    eas: {
      projectId: "824c3b7e-6700-4f5d-8961-280b98eb9e74",
    },
  },
});
