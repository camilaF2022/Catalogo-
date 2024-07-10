// Source: https://medium.com/swlh/snackbars-in-react-an-exercise-in-hooks-and-context-299b43fd2a2b

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Snackbar, SnackbarContent } from "@mui/material";

// Create a context for managing snackbars
export const SnackbarContext = createContext();

// Duration for automatic dismissal of snackbars (in milliseconds)
const AUTO_DISMISS = 5000;

/**
 * SnackbarProvider Component
 *
 * This component provides a context for managing and displaying snackbars throughout the application.
 * It uses React state to maintain a list of active alerts and automatically dismisses them after a set duration.
 *
 * @param {Object} children - React components wrapped by the SnackbarProvider to provide snackbar functionality.
 */
export function SnackbarProvider({ children }) {
  const [alerts, setAlerts] = useState([]); // State to manage active alerts

  // Join active alert IDs into a string for monitoring
  const activeAlertIds = alerts.join(",");

  // Effect hook to automatically dismiss the latest alert after AUTO_DISMISS duration
  useEffect(() => {
    if (activeAlertIds.length > 0) {
      const timer = setTimeout(
        () => setAlerts((alerts) => alerts.slice(0, alerts.length - 1)),
        AUTO_DISMISS
      );
      return () => clearTimeout(timer); // Clean up timer on component unmount or alert change
    }
  }, [activeAlertIds]);

  // Callback function to add a new alert to the state
  const addAlert = useCallback(
    (content) => setAlerts((alerts) => [content, ...alerts]),
    []
  );

  // Memoized value object containing addAlert function to avoid unnecessary re-renders
  const value = useMemo(() => ({ addAlert }), [addAlert]);

  return (
    <SnackbarContext.Provider value={value}>
      {/* Render wrapped children components */}
      {children}

      {/* Render active alerts as Snackbar components */}
      {alerts.map((alert, index) => (
        <Snackbar
          key={index}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open
          style={{ bottom: `${(index + 1) * 50}px` }} // Adjust the bottom margin for stacking
        >
          <SnackbarContent message={alert} />
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
}
