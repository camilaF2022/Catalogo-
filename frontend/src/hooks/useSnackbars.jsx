import { useContext } from "react";
import { SnackbarContext } from "./components/SnackbarProvider";

export const useSnackBars = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackBars must be used within a SnackbarProvider");
    }
    return context;
}
