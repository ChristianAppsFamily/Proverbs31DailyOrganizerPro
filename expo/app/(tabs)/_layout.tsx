import { Tabs } from "expo-router";
import { BookOpen, CheckSquare, Settings as SettingsIcon, Sparkles } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { fonts } from "@/constants/theme";
import { useAppTheme } from "@/contexts/ThemeContext";

export default function TabLayout() {
  const { colors } = useAppTheme();
  const tabBarStyle = {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 84 : 68,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textHint,
        tabBarStyle,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <CheckSquare color={color} size={22} strokeWidth={1.6} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color }) => (
            <Sparkles color={color} size={22} strokeWidth={1.6} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          tabBarIcon: ({ color }) => (
            <BookOpen color={color} size={22} strokeWidth={1.6} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <SettingsIcon color={color} size={22} strokeWidth={1.6} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 9,
    fontFamily: fonts.bodyMedium,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  item: {
    paddingVertical: 4,
  },
});
