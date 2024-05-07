import logo from "./logo.svg";
import "./App.css";
import theme from "./styles";
import Button from "@mui/material/Button";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Typography variant="h1">
            Edit <code>src/App.js</code> and save to reload.
          </Typography>
          <Typography variant="p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            suscipit, purus eget ultricies aliquam, purus sem ultrices augue,
            nec laoreet nisi ipsum ac libero.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CollectionsBookmarkIcon />}
          >
            Hello World
          </Button>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
