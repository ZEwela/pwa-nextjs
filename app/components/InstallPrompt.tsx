import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if the app is in standalone mode
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Only show alert if the app is not in standalone mode and the user hasn't been prompted before
      const hasPrompted = localStorage.getItem("installPrompted");

      if (!isStandalone && !hasPrompted) {
        const alertMessage =
          'To install this app on your device, tap the share button and then "Add to Home Screen';

        alert(alertMessage);

        // Set the item in local storage to avoid prompting again
        localStorage.setItem("installPrompted", "true");
      }
    }
  }, [isStandalone]);

  return null; // No need to render anything in the component
}
