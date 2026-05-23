import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CONFETTI_COLORS, type RewardStyleId } from "@/constants/rewards";
import { fonts } from "@/constants/theme";
import type { RewardCelebrationPayload } from "@/lib/rewardTriggers";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const CONFETTI_COUNT = 48;
const SPARKLE_COUNT = 24;

type Props = {
  payload: RewardCelebrationPayload;
  style: RewardStyleId;
  onDone: () => void;
};

type ParticleSpec = {
  left: number;
  size: number;
  color: string;
  delay: number;
  drift: number;
  duration: number;
  spin: number;
};

function buildConfettiSpecs(): ParticleSpec[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    left: Math.random() * SCREEN_W,
    size: 6 + Math.random() * 8,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 400,
    drift: (Math.random() - 0.5) * 80,
    duration: 2200 + Math.random() * 1400,
    spin: (Math.random() - 0.5) * 720,
  }));
}

function buildSparkleSpecs() {
  return Array.from({ length: SPARKLE_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * (SCREEN_W * 0.35);
    return {
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      size: 4 + Math.random() * 10,
      delay: Math.random() * 200,
    };
  });
}

export function RewardOverlay({ payload, style, onDone }: Props) {
  const insets = useSafeAreaInsets();
  const confettiSpecs = useMemo(() => buildConfettiSpecs(), []);
  const sparkleSpecs = useMemo(() => buildSparkleSpecs(), []);

  const glowOpacity = useRef(new Animated.Value(0)).current;
  const bannerY = useRef(new Animated.Value(80)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;

  const showConfetti =
    style === "confetti" || style === "full";
  const showSparkles =
    style === "sparkles" || style === "full";
  const showGlow =
    style === "glow" || style === "full";
  const showBanner = style === "victory" || style === "full";

  useEffect(() => {
    if (style === "full") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const animations: Animated.CompositeAnimation[] = [];

    if (showGlow) {
      animations.push(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.55,
            duration: 350,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0,
            duration: 900,
            delay: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    }

    if (showBanner) {
      animations.push(
        Animated.parallel([
          Animated.spring(bannerY, {
            toValue: 0,
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }),
          Animated.timing(bannerOpacity, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
          }),
        ]),
      );
    }

    Animated.parallel(animations).start();

    const timer = setTimeout(onDone, style === "glow" ? 2400 : 3200);
    return () => clearTimeout(timer);
  }, [
    bannerOpacity,
    bannerY,
    glowOpacity,
    onDone,
    showBanner,
    showGlow,
    style,
  ]);

  return (
    <View style={styles.overlayRoot} pointerEvents="box-none">
      <Pressable style={styles.dismissTap} onPress={onDone} accessibilityLabel="Dismiss celebration" />

      {showGlow ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.glow, { opacity: glowOpacity }]}
        />
      ) : null}

      {showConfetti ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {confettiSpecs.map((spec, index) => (
            <ConfettiPiece key={`c-${index}`} spec={spec} />
          ))}
        </View>
      ) : null}

      {showSparkles ? (
        <View pointerEvents="none" style={styles.sparkleCenter}>
          {sparkleSpecs.map((spec, index) => (
            <SparklePiece key={`s-${index}`} spec={spec} />
          ))}
        </View>
      ) : null}

      {showBanner ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.bannerWrap,
            {
              paddingBottom: insets.bottom + 24,
              opacity: bannerOpacity,
              transform: [{ translateY: bannerY }],
            },
          ]}
        >
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>{payload.title}</Text>
            <Text style={styles.bannerMessage}>{payload.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

function ConfettiPiece({ spec }: { spec: ParticleSpec }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: spec.duration,
      delay: spec.delay,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [progress, spec.delay, spec.duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, SCREEN_H + 40],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, spec.drift],
  });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", `${spec.spin}deg`],
  });

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          left: spec.left,
          width: spec.size,
          height: spec.size * 1.4,
          backgroundColor: spec.color,
          transform: [{ translateY }, { translateX }, { rotate }],
        },
      ]}
    />
  );
}

function SparklePiece({
  spec,
}: {
  spec: { tx: number; ty: number; size: number; delay: number };
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 900,
      delay: spec.delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, spec.delay]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, spec.tx],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, spec.ty],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.2],
  });

  return (
    <Animated.View
      style={[
        styles.sparkle,
        {
          width: spec.size,
          height: spec.size,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  dismissTap: {
    ...StyleSheet.absoluteFillObject,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFE8A8",
  },
  confettiPiece: {
    position: "absolute",
    top: 0,
    borderRadius: 2,
  },
  sparkleCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFD60A",
    shadowColor: "#FFF",
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  bannerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
  },
  banner: {
    backgroundColor: "rgba(46, 16, 32, 0.92)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  bannerTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
  },
  bannerMessage: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.78)",
    textAlign: "center",
    lineHeight: 18,
  },
});
