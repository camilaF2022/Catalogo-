// Source: https://medium.com/swlh/snackbars-in-react-an-exercise-in-hooks-and-context-299b43fd2a2b
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Snackbar from '@mui/material/Snackbar';

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
      {alerts.map((alert) => (
        <Snackbar key={alert}>{alert}</Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
}
