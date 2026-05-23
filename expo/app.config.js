/** @type {import('expo/config').ExpoConfig} */
const APP_DISPLAY_NAME = "Proverbs 31: Daily Organizer Pro";
const APP_VERSION = "1.1";
const IOS_BUNDLE_ID = "com.christianappempire.p31organizerpro";
const ANDROID_PACKAGE = "com.christianappempire.p31organizerpro";

module.exports = {
  expo: {
    name: APP_DISPLAY_NAME,
    slug: "p31-organizer-pro",
    version: APP_VERSION,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "p31organizerpro",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "cover",
      backgroundColor: "#1a1a1a",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: IOS_BUNDLE_ID,
      buildNumber: "2",
      infoPlist: {
        CFBundleDisplayName: APP_DISPLAY_NAME,
        UIBackgroundModes: ["remote-notification"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: ANDROID_PACKAGE,
      versionCode: 2,
      permissions: ["android.permission.POST_NOTIFICATIONS"],
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          resizeMode: "cover",
          backgroundColor: "#1a1a1a",
          enableFullScreenImage_legacy: true,
        },
      ],
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
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#9E4A6E",
          sounds: [],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "proverbs-31-organizer",
      },
      appProductId: "Proverbs31OrganizerPro",
      appStoreAppleId: "1063672528",
      appStoreSku: "P31OrganizePro",
    },
  },
};
