import "./App.css";
import Layout from "./components/Layout";
import { SnackbarProvider } from "./hooks/components/SnackbarProvider";
import theme from "./styles";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Router>
          <Layout />
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
