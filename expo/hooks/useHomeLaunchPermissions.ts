import { useEffect, useRef } from "react";
import { InteractionManager } from "react-native";
import { useAppReady } from "@/contexts/AppReadyContext";
import {
  getNotificationPermission,
  requestNotificationPermission,
} from "@/lib/notifications";

/**
 * Requests notification permission on the Tasks home screen after bootstrap.
 */
export function useHomeLaunchPermissions(): void {
  const { bootstrapReady } = useAppReady();
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!bootstrapReady || hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;

    const interaction = InteractionManager.runAfterInteractions(() => {
      void (async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));

        const notificationPermission = await getNotificationPermission();
        if (notificationPermission === "undetermined") {
          await requestNotificationPermission();
        }
      })();
    });

    return () => {
      interaction.cancel();
    };
  }, [bootstrapReady]);
}
