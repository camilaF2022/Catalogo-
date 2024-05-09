import "./App.css";
import Layout from "./components/Layout";
import theme from "./styles";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

export default App;
