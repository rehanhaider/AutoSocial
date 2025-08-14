import { HapticFeedback, Theme } from "@/lib/types/settingsTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
    theme: Theme;
    hapticFeedback: HapticFeedback;
    setTheme: (theme: Theme) => void;
    setHapticFeedback: (hapticFeedback: HapticFeedback) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            theme: "system",
            hapticFeedback: "enabled",
            setTheme: (theme: Theme) => set({ theme }),
            setHapticFeedback: (hapticFeedback: HapticFeedback) => set({ hapticFeedback }),
        }),
        {
            name: "settings-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
