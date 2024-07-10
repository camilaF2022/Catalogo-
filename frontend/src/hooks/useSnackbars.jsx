import { useContext } from "react";
import { SnackbarContext } from "./components/SnackbarProvider";

/**
 * Custom hook to access SnackbarContext and retrieve snackbar management functions.
 * @returns {{
 *   addAlert: Function  // Function to add a new alert message to the snackbar.
 * }}
 * @throws Will throw an error if used outside of a SnackbarProvider.
 */
export const useSnackBars = () => {
    const context = useContext(SnackbarContext); // Retrieves context from SnackbarProvider.
    if (!context) {
        throw new Error("useSnackBars must be used within a SnackbarProvider");
    }
    return context; // Returns context containing addAlert function.
}
