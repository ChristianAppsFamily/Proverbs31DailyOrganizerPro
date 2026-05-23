import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar, Clock } from "lucide-react-native";
import { fonts, radius } from "@/constants/theme";
import type { AppColors } from "@/constants/themes";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  defaultReminderDate,
  formatReminderLabel,
  toReminderIso,
} from "@/lib/reminderDefaults";

type Props = {
  enabled: boolean;
  reminderAt: string | null;
  onEnabledChange: (enabled: boolean) => void;
  onReminderAtChange: (iso: string | null) => void;
};

type PickerMode = "date" | "time";

export function ReminderSchedulePanel({
  enabled,
  reminderAt,
  onEnabledChange,
  onReminderAtChange,
}: Props) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const dateValue = reminderAt ? new Date(reminderAt) : defaultReminderDate();
  const [activePicker, setActivePicker] = useState<PickerMode | null>(null);

  const handleToggle = (next: boolean) => {
    onEnabledChange(next);
    if (next && !reminderAt) {
      onReminderAtChange(toReminderIso(defaultReminderDate()));
    }
    if (!next) {
      onReminderAtChange(null);
      setActivePicker(null);
    }
  };

  const closePicker = () => setActivePicker(null);

  const openPicker = (mode: PickerMode) => {
    setActivePicker(mode);
  };

  const applyDate = (selected: Date) => {
    const base = reminderAt ? new Date(reminderAt) : defaultReminderDate();
    base.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    onReminderAtChange(toReminderIso(base));
  };

  const applyTime = (selected: Date) => {
    const base = reminderAt ? new Date(reminderAt) : defaultReminderDate();
    base.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    onReminderAtChange(toReminderIso(base));
  };

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      setActivePicker(null);
    }
    if (event.type === "dismissed" || !selected) {
      return;
    }
    if (activePicker === "date") {
      applyDate(selected);
    } else if (activePicker === "time") {
      applyTime(selected);
    }
  };

  const pickerMode = activePicker ?? "date";

  return (
    <View style={styles.wrap}>
      <View style={styles.rowCard}>
        <Text style={styles.rowText}>Remind me on a day</Text>
        <Switch
          value={enabled}
          onValueChange={handleToggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.border}
        />
      </View>

      {enabled ? (
        <View style={styles.schedule}>
          <Text style={styles.scheduleHint}>{formatReminderLabel(reminderAt)}</Text>

          <View style={styles.pickerRow}>
            <Pressable
              style={[styles.pickerBtn, activePicker === "date" && styles.pickerBtnActive]}
              onPress={() => openPicker("date")}
            >
              <Calendar
                color={activePicker === "date" ? colors.white : colors.primary}
                size={14}
                strokeWidth={1.8}
              />
              <Text
                style={[
                  styles.pickerBtnText,
                  activePicker === "date" && styles.pickerBtnTextActive,
                ]}
              >
                Date
              </Text>
            </Pressable>

            <Pressable
              style={[styles.pickerBtn, activePicker === "time" && styles.pickerBtnActive]}
              onPress={() => openPicker("time")}
            >
              <Clock
                color={activePicker === "time" ? colors.white : colors.primary}
                size={14}
                strokeWidth={1.8}
              />
              <Text
                style={[
                  styles.pickerBtnText,
                  activePicker === "time" && styles.pickerBtnTextActive,
                ]}
              >
                Time
              </Text>
            </Pressable>
          </View>

          {Platform.OS === "android" && activePicker ? (
            <DateTimePicker
              value={dateValue}
              mode={pickerMode}
              display="default"
              minimumDate={pickerMode === "date" ? new Date() : undefined}
              onChange={onPickerChange}
            />
          ) : null}
        </View>
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal
          visible={activePicker !== null}
          transparent
          animationType="slide"
          onRequestClose={closePicker}
        >
          <View style={styles.modalRoot}>
            <Pressable style={styles.modalBackdrop} onPress={closePicker} />
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {pickerMode === "date" ? "Reminder date" : "Reminder time"}
                </Text>
                <Pressable onPress={closePicker} hitSlop={12}>
                  <Text style={styles.modalDone}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={dateValue}
                mode={pickerMode}
                display="spinner"
                minimumDate={pickerMode === "date" ? new Date() : undefined}
                onChange={onPickerChange}
                themeVariant="light"
                style={styles.iosPicker}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
  wrap: {
    gap: 8,
  },
  rowCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  rowText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.text,
  },
  schedule: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  scheduleHint: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.text,
  },
  pickerRow: {
    flexDirection: "row",
    gap: 8,
  },
  pickerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  pickerBtnActive: {
    backgroundColor: colors.primary,
  },
  pickerBtnText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.primary,
  },
  pickerBtnTextActive: {
    color: colors.white,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.text,
  },
  modalDone: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.primary,
  },
  iosPicker: {
    height: 216,
  },
  });
