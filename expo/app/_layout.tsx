import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts as useCormorant,
  CormorantGaramond_300Light,
  CormorantGaramond_300Light_Italic,
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
} from "@expo-google-fonts/cormorant-garamond";
import {
  DMSans_400Regular,
  DMSans_500Medium,
} from "@expo-google-fonts/dm-sans";
import { AppBootstrap } from "@/components/AppBootstrap";
import { AppReadyProvider, useAppReady } from "@/contexts/AppReadyContext";
import { RewardProvider } from "@/contexts/RewardContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden after a fast refresh.
});

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-item"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="add-habit"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="add-journal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="theme-picker"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}

function AppRoot() {
  const [loaded] = useCormorant({
    CormorantGaramond_300Light,
    CormorantGaramond_300Light_Italic,
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
  });
  const { bootstrapReady } = useAppReady();
  const [splashHidden, setSplashHidden] = useState(false);

  const onBootstrapComplete = useCallback(() => {
    void SplashScreen.hideAsync()
      .catch(() => {})
      .finally(() => {
        setSplashHidden(true);
      });
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        SplashScreen.setOptions({
          duration: 200,
          fade: true,
        });
      } catch {
        // setOptions is unavailable in Expo Go.
      }
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <AppBootstrap fontsLoaded={loaded} onBootstrapComplete={onBootstrapComplete} />
      {bootstrapReady && splashHidden ? (
        <RootLayoutNav />
      ) : (
        <View style={{ flex: 1, backgroundColor: "#1a1a1a" }} />
      )}
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppReadyProvider>
        <ThemeProvider>
          <RewardProvider>
            <SafeAreaProvider>
              <AppRoot />
            </SafeAreaProvider>
          </RewardProvider>
        </ThemeProvider>
      </AppReadyProvider>
    </QueryClientProvider>
  );
}
