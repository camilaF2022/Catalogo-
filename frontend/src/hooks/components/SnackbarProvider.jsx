// Source: https://medium.com/swlh/snackbars-in-react-an-exercise-in-hooks-and-context-299b43fd2a2b
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Snackbar, SnackbarContent } from "@mui/material";

// Create a context for managing snackbar alerts
export const SnackbarContext = createContext();

// Duration for auto-dismissing snackbar alerts (in milliseconds)
const AUTO_DISMISS = 5000;

/**
 * SnackbarProvider component manages snackbar alerts using context API.
 * It provides methods to add alerts and automatically dismisses them after a set duration.
 * Uses Material-UI Snackbar and SnackbarContent for displaying alerts.
 * @param children The components rendered within SnackbarProvider.
 */
export function SnackbarProvider({ children }) {

// State to hold the list of active alerts
  const [alerts, setAlerts] = useState([]);

// Effect to auto-dismiss alerts after a specified duration
  const activeAlertIds = alerts.join(",");
  useEffect(() => {
    if (activeAlertIds.length > 0) {
      const timer = setTimeout(
        () => setAlerts((alerts) => alerts.slice(0, alerts.length - 1)),
        AUTO_DISMISS
      );
      return () => clearTimeout(timer);
    }
  }, [activeAlertIds]);

// Callback function to add a new alert
  const addAlert = useCallback(
    (content) => setAlerts((alerts) => [content, ...alerts]),
    []
  );

// Memoized value containing the addAlert function for context provider
  const value = useMemo(() => ({ addAlert }), [addAlert]);

// Render SnackbarProvider with context value and alerts
  return (
    <SnackbarContext.Provider value={value}>
    {/* Render children components */}
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
