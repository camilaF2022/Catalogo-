import { useContext } from "react";
import { SnackbarContext } from "./components/SnackbarProvider";

/**
 * useSnackBars Hook
 *
 * A custom React hook that provides access to the SnackbarContext.
 * It allows components to easily access and interact with snackbar functionality.
 *
 * @returns {Object} An object containing methods to manage snackbar alerts.
 */
const useSnackBars = () => useContext(SnackbarContext);

export default useSnackBars;
