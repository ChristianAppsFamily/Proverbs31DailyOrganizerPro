import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { pickRewardMessage } from "@/constants/rewards";
import { RewardOverlay } from "@/components/RewardOverlay";
import type { RewardCelebrationPayload } from "@/lib/rewardTriggers";
import { setRewardCelebrationEmitter } from "@/lib/rewardTriggers";
import { getRewardSettings, type RewardSettings } from "@/lib/rewardSettings";

type RewardContextValue = {
  settings: RewardSettings | null;
  refreshSettings: () => Promise<void>;
  playPreview: () => void;
  activeCelebration: RewardCelebrationPayload | null;
};

const RewardContext = createContext<RewardContextValue | null>(null);

export function RewardProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<RewardSettings | null>(null);
  const [activeCelebration, setActiveCelebration] =
    useState<RewardCelebrationPayload | null>(null);
  const [playKey, setPlayKey] = useState(0);
  const queueRef = useRef<RewardCelebrationPayload[]>([]);
  const isPlayingRef = useRef(false);

  const refreshSettings = useCallback(async () => {
    setSettings(await getRewardSettings());
  }, []);

  useEffect(() => {
    void refreshSettings();
  }, [refreshSettings]);

  const startCelebration = useCallback((payload: RewardCelebrationPayload) => {
    isPlayingRef.current = true;
    setActiveCelebration(payload);
    setPlayKey((k) => k + 1);
  }, []);

  const dismissCelebration = useCallback(() => {
    const next = queueRef.current.shift();
    if (next) {
      startCelebration(next);
      return;
    }
    isPlayingRef.current = false;
    setActiveCelebration(null);
  }, [startCelebration]);

  const enqueueCelebration = useCallback(
    (payload: RewardCelebrationPayload) => {
      if (isPlayingRef.current) {
        queueRef.current.push(payload);
        return;
      }
      startCelebration(payload);
    },
    [startCelebration],
  );

  useEffect(() => {
    setRewardCelebrationEmitter(enqueueCelebration);
    return () => setRewardCelebrationEmitter(null);
  }, [enqueueCelebration]);

  const playPreview = useCallback(() => {
    queueRef.current.length = 0;
    isPlayingRef.current = false;
    startCelebration({
      kind: "preview",
      title: "Celebration preview!",
      message: pickRewardMessage("preview"),
    });
  }, [startCelebration]);

  const value = useMemo(
    () => ({
      settings,
      refreshSettings,
      playPreview,
      activeCelebration,
    }),
    [settings, refreshSettings, playPreview, activeCelebration],
  );

  return (
    <RewardContext.Provider value={value}>
      {children}
      {activeCelebration && settings ? (
        <RewardOverlay
          key={playKey}
          payload={activeCelebration}
          style={settings.style}
          onDone={dismissCelebration}
        />
      ) : null}
    </RewardContext.Provider>
  );
}

export function useRewards(): RewardContextValue {
  const ctx = useContext(RewardContext);
  if (!ctx) {
    throw new Error("useRewards must be used within RewardProvider");
  }
  return ctx;
}
