import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Bell,
  ChevronRight,
  Crown,
  Heart,
  Moon,
  Palette,
  Shield,
} from "lucide-react-native";
import { ScreenShell } from "@/components/ScreenShell";
import { colors, fonts } from "@/constants/theme";

const SETTINGS_VERSE = {
  text:
    "She watches over the affairs of her household and does not eat the bread of idleness.",
  reference: "Proverbs 31 : 27",
} as const;

export default function SettingsScreen() {
  const [taskReminders, setTaskReminders] = React.useState<boolean>(true);
  const [sabbathPause, setSabbathPause] = React.useState<boolean>(false);

  return (
    <ScreenShell verse={SETTINGS_VERSE}>
      <Text style={styles.title}>Settings</Text>

      <PremiumCard />

      <Section label="NOTIFICATIONS">
        <SettingRow
          icon={<Bell color={colors.primary} size={15} strokeWidth={1.8} />}
          title="Task Reminders"
          description="Get notified about upcoming tasks"
          right={
            <Toggle
              value={taskReminders}
              onChange={setTaskReminders}
              testID="toggle-task-reminders"
            />
          }
        />
        <Divider />
        <SettingRow
          icon={<Moon color={colors.primary} size={15} strokeWidth={1.8} />}
          title="Sabbath Pause"
          proBadge
          description="Disable notifications during rest"
          right={
            <Toggle
              value={sabbathPause}
              onChange={setSabbathPause}
              testID="toggle-sabbath-pause"
            />
          }
        />
      </Section>

      <Section label="APPEARANCE">
        <SettingRow
          icon={<Palette color={colors.primary} size={15} strokeWidth={1.8} />}
          title="Custom Themes"
          proBadge
          description="Personalize your app colors"
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
      </Section>

      <Section label="ABOUT">
        <SettingRow
          icon={<Shield color="#7AA89E" size={15} strokeWidth={1.8} />}
          iconBg="#EEF4F0"
          title="Privacy Policy"
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
        <Divider />
        <SettingRow
          icon={<Heart color="#C47B8A" size={15} strokeWidth={1.8} />}
          iconBg="#F8ECEE"
          title="Rate This App"
          description="Help us spread the word"
          right={<ChevronRight color={colors.border} size={18} strokeWidth={1.8} />}
        />
      </Section>
    </ScreenShell>
  );
}

function PremiumCard() {
  return (
    <View style={styles.premiumCard} testID="premium-card">
      <View style={styles.premiumDecor} pointerEvents="none">
        <View style={[styles.premiumCircle, styles.premiumCircleOuter]} />
        <View style={[styles.premiumCircle, styles.premiumCircleInner]} />
      </View>
      <Crown color="#C8B8E8" size={22} strokeWidth={1.8} />
      <View style={styles.premiumMiddle}>
        <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
        <Text style={styles.premiumSubtitle}>
          Remove ads, unlimited habits, custom themes
        </Text>
      </View>
      <Text style={styles.premiumPrice}>$4.99</Text>
    </View>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
  proBadge,
  right,
}: {
  icon: React.ReactNode;
  iconBg?: string;
  title: string;
  description?: string;
  proBadge?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconBadge, iconBg ? { backgroundColor: iconBg } : null]}>
        {icon}
      </View>
      <View style={styles.rowText}>
        <View style={styles.rowTitleLine}>
          <Text style={styles.rowTitle}>{title}</Text>
          {proBadge ? (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          ) : null}
        </View>
        {description ? (
          <Text style={styles.rowDescription}>{description}</Text>
        ) : null}
      </View>
      {right ? <View style={styles.rowRight}>{right}</View> : null}
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function Toggle({
  value,
  onChange,
  testID,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
  testID?: string;
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={[styles.toggleTrack, value ? styles.toggleTrackOn : styles.toggleTrackOff]}
      testID={testID}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={[styles.toggleKnob, value ? styles.toggleKnobOn : styles.toggleKnobOff]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.text,
    lineHeight: 26,
    paddingVertical: 14,
  },
  premiumCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.headerBg,
    borderRadius: 14,
    padding: 14,
    overflow: "hidden",
    marginBottom: 18,
  },
  premiumDecor: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
  },
  premiumCircle: {
    position: "absolute",
    borderRadius: 999,
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
  },
  premiumCircleOuter: {
    top: 0,
    right: 0,
    width: 120,
    height: 120,
  },
  premiumCircleInner: {
    top: 22,
    right: 22,
    width: 76,
    height: 76,
    borderColor: "rgba(255,255,255,0.14)",
  },
  premiumMiddle: {
    flex: 1,
    gap: 2,
  },
  premiumTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.white,
  },
  premiumSubtitle: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 14,
  },
  premiumPrice: {
    fontFamily: fonts.displayRegular,
    fontSize: 18,
    color: "#C8B8E8",
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
  rowTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  proBadge: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  proBadgeText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.primary,
  },
  rowRight: {
    marginLeft: 4,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginLeft: 12 + 30 + 12,
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
});
