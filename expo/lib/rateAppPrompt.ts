import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Linking } from "react-native";
import * as StoreReview from "expo-store-review";
import { IOS_APP_STORE_REVIEW_URL } from "@/constants/urls";

const STORAGE_KEY = "proverbs31-rate-prompt-v1";

const MILESTONE_ITEMS = 3;
const COMPLETION_INTERVAL = 5;

type RatePromptState = {
  hasRated: boolean;
  showedThreeMilestone: boolean;
  totalTasksCompleted: number;
  totalHabitCheckIns: number;
  lastPromptTaskCompletions: number;
  lastPromptHabitCheckIns: number;
};

const DEFAULT_STATE: RatePromptState = {
  hasRated: false,
  showedThreeMilestone: false,
  totalTasksCompleted: 0,
  totalHabitCheckIns: 0,
  lastPromptTaskCompletions: 0,
  lastPromptHabitCheckIns: 0,
};

let promptedThisSession = false;

async function loadState(): Promise<RatePromptState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

async function saveState(state: RatePromptState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function markAppRated(): Promise<void> {
  const state = await loadState();
  state.hasRated = true;
  await saveState(state);
}

async function openStoreReview(): Promise<void> {
  await markAppRated();
  if (await StoreReview.isAvailableAsync()) {
    await StoreReview.requestReview();
    return;
  }
  await Linking.openURL(IOS_APP_STORE_REVIEW_URL);
}

async function showRatePrompt(): Promise<void> {
  if (promptedThisSession) {
    return;
  }

  const state = await loadState();
  if (state.hasRated) {
    return;
  }

  promptedThisSession = true;

  return new Promise((resolve) => {
    Alert.alert(
      "Enjoying Proverbs 31: Daily Organizer Pro?",
      "Your review helps other women discover this app.",
      [
        {
          text: "Not Now",
          style: "cancel",
          onPress: () => resolve(),
        },
        {
          text: "Rate App",
          onPress: () => {
            void openStoreReview().finally(resolve);
          },
        },
      ],
    );
  });
}

async function tryThreeItemMilestone(
  taskCount: number,
  habitCount: number,
): Promise<void> {
  const state = await loadState();
  if (state.hasRated || state.showedThreeMilestone) {
    return;
  }
  if (taskCount < MILESTONE_ITEMS || habitCount < MILESTONE_ITEMS) {
    return;
  }

  state.showedThreeMilestone = true;
  await saveState(state);
  await showRatePrompt();
}

export async function maybePromptAfterTaskAdded(
  taskCount: number,
  habitCount: number,
): Promise<void> {
  await tryThreeItemMilestone(taskCount, habitCount);
}

export async function maybePromptAfterHabitAdded(
  taskCount: number,
  habitCount: number,
): Promise<void> {
  await tryThreeItemMilestone(taskCount, habitCount);
}

export async function maybePromptAfterTaskCompleted(): Promise<void> {
  const state = await loadState();
  if (state.hasRated) {
    return;
  }

  state.totalTasksCompleted += 1;
  const sinceLastPrompt =
    state.totalTasksCompleted - state.lastPromptTaskCompletions;

  if (sinceLastPrompt < COMPLETION_INTERVAL) {
    await saveState(state);
    return;
  }

  state.lastPromptTaskCompletions = state.totalTasksCompleted;
  await saveState(state);
  await showRatePrompt();
}

export async function maybePromptAfterHabitCheckIn(): Promise<void> {
  const state = await loadState();
  if (state.hasRated) {
    return;
  }

  state.totalHabitCheckIns += 1;
  const sinceLastPrompt =
    state.totalHabitCheckIns - state.lastPromptHabitCheckIns;

  if (sinceLastPrompt < COMPLETION_INTERVAL) {
    await saveState(state);
    return;
  }

  state.lastPromptHabitCheckIns = state.totalHabitCheckIns;
  await saveState(state);
  await showRatePrompt();
}
