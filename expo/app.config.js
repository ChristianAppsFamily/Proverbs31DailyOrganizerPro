/** @type {import('expo/config').ExpoConfig} */
const ADMOB_APP_IDS = {
  ios: "ca-app-pub-3002325591150738~8603205607",
  android: "ca-app-pub-3002325591150738~9800737201",
};

const ATT_MESSAGE =
  "Proverbs 31 uses this identifier to show relevant ads and support the free version of the app.";

module.exports = {
  expo: {
    name: "Proverbs 31",
    slug: "au728cqyl2zvkiuezh60i",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "rork-app",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "app.rork.au728cqyl2zvkiuezh60i",
      infoPlist: {
        NSUserTrackingUsageDescription: ATT_MESSAGE,
        GADApplicationIdentifier: ADMOB_APP_IDS.ios,
        UIBackgroundModes: ["remote-notification"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "app.rork.au728cqyl2zvkiuezh60i",
      permissions: [
        "android.permission.POST_NOTIFICATIONS",
        "com.google.android.gms.permission.AD_ID",
      ],
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-dev-client",
      [
        "expo-router",
        {
          origin: "https://rork.com/",
        },
      ],
      "expo-font",
      "expo-web-browser",
      [
        "expo-tracking-transparency",
        {
          userTrackingPermission: ATT_MESSAGE,
        },
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: ADMOB_APP_IDS.android,
          iosAppId: ADMOB_APP_IDS.ios,
          delayAppMeasurementInit: true,
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#5B4B8A",
          sounds: [],
        },
      ],
      "react-native-iap",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "proverbs-31-organizer",
      },
    },
  },
};
