// Source: https://medium.com/swlh/snackbars-in-react-an-exercise-in-hooks-and-context-299b43fd2a2b
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Snackbar, SnackbarContent } from "@mui/material";

export const SnackbarContext = createContext();

const AUTO_DISMISS = 5000;

export function SnackbarProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

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

  const addAlert = useCallback(
    (content) => setAlerts((alerts) => [content, ...alerts]),
    []
  );

  const value = useMemo(() => ({ addAlert }), [addAlert]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
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
