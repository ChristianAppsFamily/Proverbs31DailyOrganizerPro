import React from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as StoreReview from "expo-store-review";
import {
  Bell,
  ChevronRight,
  Grid3x3,
  Heart,
  Instagram,
  Mail,
  Moon,
  Palette,
  Shield,
  Sparkles,
  Users,
} from "lucide-react-native";
import { ScreenShell } from "@/components/ScreenShell";
import { APP_DISPLAY_NAME } from "@/constants/appStore";
import { REWARD_STYLE_OPTIONS, type RewardStyleId } from "@/constants/rewards";
import { useRewards } from "@/contexts/RewardContext";
import { fonts } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { markAppRated } from "@/lib/rateAppPrompt";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  CONTACT_US_URL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  IOS_APP_STORE_REVIEW_URL,
  JOIN_COMMUNITY_URL,
  MORE_APPS_URL,
  PRIVACY_POLICY_URL,
} from "@/constants/urls";
import {
  cancelAllScheduledNotifications,
  getNotificationPermission,
  requestNotificationPermission,
  syncTaskReminders,
} from "@/lib/notifications";
import {
  fullWeekdayName,
  isRestDay,
  SABBATH_WEEKDAY_OPTIONS,
  type SabbathWeekday,
} from "@/lib/sabbathDays";
import { isSabbathPauseActive, isSabbathRestDay } from "@/lib/sabbathPause";
import {
  getSabbathPauseEnabled,
  getSabbathRestDay,
  getTaskRemindersEnabled,
  setSabbathPauseEnabled,
  setSabbathRestDay,
  setTaskRemindersEnabled,
} from "@/lib/settingsStorage";
import { setRewardSettings } from "@/lib/rewardSettings";
import { useAppStore } from "@/stores/appStore";

const SETTINGS_VERSE = {
  text:
    "She watches over the affairs of her household and does not eat the bread of idleness.",
  reference: "Proverbs 31 : 27",
} as const;

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { settings: rewardSettings, refreshSettings, playPreview } = useRewards();
  const tasks = useAppStore((s) => s.tasks);
  const [taskReminders, setTaskReminders] = React.useState<boolean>(true);
  const [sabbathPause, setSabbathPause] = React.useState<boolean>(false);
  const [sabbathRestDay, setSabbathRestDayState] = React.useState<SabbathWeekday>(0);
  const [settingsReady, setSettingsReady] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      const [reminders, sabbath, restDay] = await Promise.all([
        getTaskRemindersEnabled(),
        getSabbathPauseEnabled(),
        getSabbathRestDay(),
      ]);
      setTaskReminders(reminders);
      setSabbathPause(sabbath);
      setSabbathRestDayState(restDay);
      setSettingsReady(true);
    })();
  }, []);

  const handleTaskReminders = async (next: boolean) => {
    if (next) {
      if (await isSabbathPauseActive()) {
        const dayName = fullWeekdayName(sabbathRestDay);
        Alert.alert(
          "Sabbath Pause",
          `Task reminders stay off on ${dayName}s while Sabbath Pause is enabled.`,
        );
        return;
      }
      const permission = await requestNotificationPermission();
      if (permission !== "granted") {
        Alert.alert(
          "Notifications",
          "Enable notifications in Settings to receive task reminders.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }
      const synced = await syncTaskReminders(tasks);
      useAppStore.setState({ tasks: synced });
      setTaskReminders(true);
      await setTaskRemindersEnabled(true);
      return;
    }

    await cancelAllScheduledNotifications();
    useAppStore.setState({
      tasks: tasks.map((t) => ({ ...t, notificationId: undefined })),
    });
    setTaskReminders(false);
    await setTaskRemindersEnabled(false);
  };

  const handleSabbathPause = async (next: boolean) => {
    await setSabbathPauseEnabled(next);
    setSabbathPause(next);

    if (next && (await isSabbathRestDay())) {
      await cancelAllScheduledNotifications();
      useAppStore.setState({
        tasks: useAppStore.getState().tasks.map((t) => ({
          ...t,
          notificationId: undefined,
        })),
      });
      return;
    }

    if (!next && taskReminders && (await isSabbathRestDay())) {
      const permission = await getNotificationPermission();
      if (permission === "granted") {
        const current = useAppStore.getState().tasks;
        const synced = await syncTaskReminders(current);
        useAppStore.setState({ tasks: synced });
      }
    }
  };

  const handleSabbathRestDayChange = async (day: SabbathWeekday) => {
    const today = new Date();
    const wasRestToday = sabbathPause && isRestDay(today, sabbathRestDay);
    await setSabbathRestDay(day);
    setSabbathRestDayState(day);

    if (!sabbathPause) return;

    const isRestToday = isRestDay(today, day);
    const currentTasks = useAppStore.getState().tasks;

    if (wasRestToday && !isRestToday && taskReminders) {
      const permission = await getNotificationPermission();
      if (permission === "granted") {
        const synced = await syncTaskReminders(currentTasks);
        useAppStore.setState({ tasks: synced });
      }
      return;
    }

    if (!wasRestToday && isRestToday) {
      await cancelAllScheduledNotifications();
      useAppStore.setState({
        tasks: currentTasks.map((t) => ({ ...t, notificationId: undefined })),
      });
    }
  };

  const openUrl = (url: string) => {
    if (url.startsWith("mailto:")) {
      void Linking.openURL(url);
      return;
    }
    void WebBrowser.openBrowserAsync(url);
  };

  const rateApp = async () => {
    await markAppRated();
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
      return;
    }
    await Linking.openURL(IOS_APP_STORE_REVIEW_URL);
  };

  const openThemes = () => {
    router.push("/theme-picker");
  };

  const updateRewardSettings = async (
    patch: Partial<{
      enabled: boolean;
      onAllTasksDone: boolean;
      onHabitWeekComplete: boolean;
      onHabitCheckInMilestones: boolean;
      style: RewardStyleId;
    }>,
  ) => {
    await setRewardSettings(patch);
    await refreshSettings();
  };

  const rewardsOn = rewardSettings?.enabled ?? true;

  return (
    <ScreenShell verse={SETTINGS_VERSE}>
      <Text style={styles.title}>Settings</Text>

      <Section label="NOTIFICATIONS">
        <SettingRow
          icon={<Bell color={colors.primary} size={15} strokeWidth={1.8} />}
          title="Task Reminders"
          description="Get notified about upcoming tasks"
          right={
            <Toggle
              value={taskReminders}
              onChange={handleTaskReminders}
              testID="toggle-task-reminders"
              disabled={!settingsReady}
            />
          }
        />
        <Divider />
        <SettingRow
          icon={<Moon color={colors.primary} size={15} strokeWidth={1.8} />}
          title="Sabbath Pause"
          description="Silence task reminders on your rest day"
          right={
            <Toggle
              value={sabbathPause}
              onChange={handleSabbathPause}
              testID="toggle-sabbath-pause"
              disabled={!settingsReady}
            />
          }
        />
        <SabbathDayPicker
          selectedDay={sabbathRestDay}
          onSelectDay={handleSabbathRestDayChange}
          disabled={!settingsReady}
        />
      </Section>

      <Section label="APPEARANCE">
        <SettingRow
          icon={<Palette color={colors.primary} size={15} strokeWidth={1.8} />}
          title="Custom Themes"
          description="Personalize your app colors"
          onPress={openThemes}
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
      </Section>

      <Section label="CELEBRATIONS">
        <SettingRow
          icon={<Sparkles color={colors.primary} size={15} strokeWidth={1.8} />}
          title="Celebrations"
          description="Visual rewards when you hit milestones"
          right={
            <Toggle
              value={rewardsOn}
              onChange={(next) => void updateRewardSettings({ enabled: next })}
              testID="toggle-celebrations"
              disabled={!settingsReady || !rewardSettings}
            />
          }
        />
        <Divider />
        <SettingRow
          icon={<Sparkles color="#FFCC00" size={15} strokeWidth={1.8} />}
          title="All tasks done today"
          description="Celebrate when every task is checked off"
          right={
            <Toggle
              value={rewardSettings?.onAllTasksDone ?? true}
              onChange={(next) =>
                void updateRewardSettings({ onAllTasksDone: next })
              }
              testID="toggle-reward-all-tasks"
              disabled={!settingsReady || !rewardSettings || !rewardsOn}
            />
          }
        />
        <Divider />
        <SettingRow
          icon={<Sparkles color="#34C759" size={15} strokeWidth={1.8} />}
          title="Full habit week"
          description="Celebrate when all 7 days are checked in"
          right={
            <Toggle
              value={rewardSettings?.onHabitWeekComplete ?? true}
              onChange={(next) =>
                void updateRewardSettings({ onHabitWeekComplete: next })
              }
              testID="toggle-reward-habit-week"
              disabled={!settingsReady || !rewardSettings || !rewardsOn}
            />
          }
        />
        <Divider />
        <SettingRow
          icon={<Sparkles color="#9E4A6E" size={15} strokeWidth={1.8} />}
          title="Every 30 check-ins"
          description="Celebrate at 30, 60, 90… total habit check-ins (any days)"
          right={
            <Toggle
              value={rewardSettings?.onHabitCheckInMilestones ?? true}
              onChange={(next) =>
                void updateRewardSettings({ onHabitCheckInMilestones: next })
              }
              testID="toggle-reward-habit-30"
              disabled={!settingsReady || !rewardSettings || !rewardsOn}
            />
          }
        />
        <RewardStylePicker
          selectedStyle={rewardSettings?.style ?? "confetti"}
          onSelectStyle={(style) => void updateRewardSettings({ style })}
          onPreview={playPreview}
          disabled={!settingsReady || !rewardSettings || !rewardsOn}
        />
      </Section>

      <Section label="COMMUNITY">
        <SettingRow
          icon={<Grid3x3 color={colors.primary} size={15} strokeWidth={1.8} />}
          title="More Apps"
          onPress={() => openUrl(MORE_APPS_URL)}
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
        <Divider />
        <SettingRow
          icon={<Users color={colors.primary} size={15} strokeWidth={1.8} />}
          title="Join Our Community"
          onPress={() => openUrl(JOIN_COMMUNITY_URL)}
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
        <Divider />
        <SettingRow
          icon={<Heart color="#4267B2" size={15} strokeWidth={1.8} />}
          iconBg="#EEF4F0"
          title="Facebook"
          onPress={() => openUrl(FACEBOOK_URL)}
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
        <Divider />
        <SettingRow
          icon={<Instagram color="#C13584" size={15} strokeWidth={1.8} />}
          iconBg="#F8ECEE"
          title="Follow Us on Instagram"
          onPress={() => openUrl(INSTAGRAM_URL)}
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
        <Divider />
        <SettingRow
          icon={<Mail color={colors.primary} size={15} strokeWidth={1.8} />}
          title="Contact Us"
          onPress={() => openUrl(CONTACT_US_URL)}
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
      </Section>

      <Section label="ABOUT">
        <SettingRow
          icon={<Shield color="#7AA89E" size={15} strokeWidth={1.8} />}
          iconBg="#EEF4F0"
          title="Privacy Policy"
          description="How we handle your information"
          onPress={() => openUrl(PRIVACY_POLICY_URL)}
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
        <Divider />
        <SettingRow
          icon={<Heart color="#C47B8A" size={15} strokeWidth={1.8} />}
          iconBg="#F8ECEE"
          title="Rate This App"
          description="Help us spread the word"
          onPress={rateApp}
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
      </Section>

      <View style={styles.credits}>
        <Text style={styles.creditsApp}>{APP_DISPLAY_NAME}</Text>
        <Text style={styles.creditsLine}>Developed By</Text>
        <Text style={styles.creditsCompany}>Christian App Empire LLC</Text>
        <Text style={styles.creditsLegal}>
          Copyright © Christian App Empire LLC 2026.{"\n"}All Rights Reserved.
        </Text>
      </View>
    </ScreenShell>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function SettingRow({
  icon,
  iconBg,
  title,
  description,
  right,
  onPress,
}: {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const content = (
    <>
      <View style={[styles.iconBadge, iconBg ? { backgroundColor: iconBg } : null]}>
        {icon}
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {description ? (
          <Text style={styles.rowDescription}>{description}</Text>
        ) : null}
      </View>
      {right ? <View style={styles.rowRight}>{right}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

function Divider() {
  const styles = useThemedStyles(createStyles);
  return <View style={styles.divider} />;
}

function RewardStylePicker({
  selectedStyle,
  onSelectStyle,
  onPreview,
  disabled,
}: {
  selectedStyle: RewardStyleId;
  onSelectStyle: (style: RewardStyleId) => void;
  onPreview: () => void;
  disabled?: boolean;
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.rewardStyleBlock}>
      <Text style={styles.sabbathDayLabel}>CELEBRATION STYLE</Text>
      <View style={styles.rewardStyleList}>
        {REWARD_STYLE_OPTIONS.map((option) => {
          const active = option.id === selectedStyle;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSelectStyle(option.id)}
              disabled={disabled}
              style={[
                styles.rewardStyleCard,
                active && styles.rewardStyleCardActive,
                disabled && styles.sabbathDayChipDisabled,
              ]}
              testID={`reward-style-${option.id}`}
            >
              <Text
                style={[
                  styles.rewardStyleName,
                  active && styles.rewardStyleNameActive,
                ]}
              >
                {option.name}
              </Text>
              <Text
                style={[
                  styles.rewardStyleDesc,
                  active && styles.rewardStyleDescActive,
                ]}
              >
                {option.description}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable
        onPress={onPreview}
        disabled={disabled}
        style={[styles.previewButton, disabled && styles.sabbathDayChipDisabled]}
        testID="preview-celebration"
      >
        <Text style={styles.previewButtonText}>Preview celebration</Text>
      </Pressable>
    </View>
  );
}

function SabbathDayPicker({
  selectedDay,
  onSelectDay,
  disabled,
}: {
  selectedDay: SabbathWeekday;
  onSelectDay: (day: SabbathWeekday) => void;
  disabled?: boolean;
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.sabbathDayBlock}>
      <Text style={styles.sabbathDayLabel}>REST DAY</Text>
      <View style={styles.sabbathDayRow}>
        {SABBATH_WEEKDAY_OPTIONS.map((option) => {
          const active = option.day === selectedDay;
          return (
            <Pressable
              key={option.day}
              onPress={() => onSelectDay(option.day)}
              disabled={disabled}
              style={[
                styles.sabbathDayChip,
                active && styles.sabbathDayChipActive,
                disabled && styles.sabbathDayChipDisabled,
              ]}
              testID={`sabbath-day-${option.label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[
                  styles.sabbathDayChipText,
                  active && styles.sabbathDayChipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Toggle({
  value,
  onChange,
  testID,
  disabled,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
  testID?: string;
  disabled?: boolean;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={[
        styles.toggleTrack,
        value ? styles.toggleTrackOn : styles.toggleTrackOff,
        disabled && styles.toggleTrackDisabled,
      ]}
      testID={testID}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      disabled={disabled}
    >
      <View style={[styles.toggleKnob, value ? styles.toggleKnobOn : styles.toggleKnobOff]} />
    </Pressable>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    title: {
      fontFamily: fonts.display,
      fontSize: 22,
      color: colors.text,
      lineHeight: 26,
      paddingVertical: 14,
    },
    section: {
      gap: 8,
      marginBottom: 18,
    },
    sectionLabel: {
      fontFamily: fonts.bodyMedium,
      fontSize: 9,
      letterSpacing: 2,
      color: colors.textHint,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 12,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    rowPressed: {
      backgroundColor: colors.surface,
    },
    iconBadge: {
      width: 30,
      height: 30,
      borderRadius: 8,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    rowText: {
      flex: 1,
      gap: 2,
    },
    rowTitle: {
      fontFamily: fonts.body,
      fontSize: 12.5,
      color: colors.text,
    },
    rowDescription: {
      fontFamily: fonts.body,
      fontSize: 10,
      color: colors.textHint,
    },
    rowRight: {
      marginLeft: 4,
    },
    divider: {
      height: 0.5,
      backgroundColor: colors.border,
      marginLeft: 12 + 30 + 12,
    },
    sabbathDayBlock: {
      paddingHorizontal: 12,
      paddingBottom: 14,
      paddingTop: 4,
      gap: 8,
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
    },
    sabbathDayLabel: {
      fontFamily: fonts.bodyMedium,
      fontSize: 9,
      letterSpacing: 1.6,
      color: colors.textHint,
    },
    sabbathDayRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 4,
    },
    sabbathDayChip: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    sabbathDayChipActive: {
      backgroundColor: colors.headerBg,
      borderColor: colors.headerBg,
    },
    sabbathDayChipDisabled: {
      opacity: 0.5,
    },
    sabbathDayChipText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 10,
      color: colors.textMuted,
    },
    sabbathDayChipTextActive: {
      color: colors.white,
    },
    rewardStyleBlock: {
      paddingHorizontal: 12,
      paddingBottom: 14,
      paddingTop: 4,
      gap: 10,
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
    },
    rewardStyleList: {
      gap: 8,
    },
    rewardStyleCard: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: 2,
    },
    rewardStyleCardActive: {
      backgroundColor: colors.headerBg,
      borderColor: colors.headerBg,
    },
    rewardStyleName: {
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      color: colors.text,
    },
    rewardStyleNameActive: {
      color: colors.white,
    },
    rewardStyleDesc: {
      fontFamily: fonts.body,
      fontSize: 10,
      color: colors.textMuted,
      lineHeight: 14,
    },
    rewardStyleDescActive: {
      color: "rgba(255, 255, 255, 0.75)",
    },
    previewButton: {
      alignItems: "center",
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    previewButtonText: {
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      color: colors.primary,
    },
    toggleTrack: {
      width: 38,
      height: 22,
      borderRadius: 999,
      padding: 2,
      justifyContent: "center",
    },
  toggleTrackOff: {
    backgroundColor: colors.border,
  },
  toggleTrackOn: {
    backgroundColor: colors.primary,
  },
  toggleTrackDisabled: {
    opacity: 0.5,
  },
    toggleKnob: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.white,
    },
    toggleKnobOff: {
      alignSelf: "flex-start",
    },
    toggleKnobOn: {
      alignSelf: "flex-end",
    },
    credits: {
      alignItems: "center",
      gap: 4,
      paddingTop: 8,
      paddingBottom: 16,
    },
    creditsApp: {
      fontFamily: fonts.display,
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
    },
    creditsLine: {
      fontFamily: fonts.body,
      fontSize: 10,
      color: colors.textMuted,
      marginTop: 4,
    },
    creditsCompany: {
      fontFamily: fonts.bodyMedium,
      fontSize: 11,
      color: colors.primary,
    },
    creditsLegal: {
      fontFamily: fonts.body,
      fontSize: 9,
      color: colors.textHint,
      textAlign: "center",
      lineHeight: 14,
      marginTop: 6,
    },
  });
