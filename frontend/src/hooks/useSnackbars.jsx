import { useContext } from "react";
import { SnackbarContext } from "./components/SnackbarProvider";

const useSnackBars = () => useContext(SnackbarContext);

export default useSnackBars;
