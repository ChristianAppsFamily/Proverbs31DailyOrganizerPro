import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { getBannerAdUnitId } from "@/constants/ads";
import { useAppReady } from "@/contexts/AppReadyContext";

export function AdBanner() {
  const { adsReady, isPremium } = useAppReady();

  if (Platform.OS === "web" || !adsReady || isPremium) {
    return null;
  }

  return (
    <View style={styles.wrap} testID="admob-banner">
      <BannerAd
        unitId={getBannerAdUnitId()}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
});
