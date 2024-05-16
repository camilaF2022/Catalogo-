import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme } from "@mui/material/styles";

// Colors as shown in Figma
const COLORS = {
  MENU: "#56A0CC",
  AZUL1: "#E8F1F2",
  AZUL2: "#1B98E0",
  AZUL3: "#006494",
  AZUL4: "#13293D",
  CULTURE:"#FEE2DD",
  SHAPE:"#D2E5EF"
};

// Define theme colors and typography
let theme = createTheme({
  palette: {
    menu: {
      main: COLORS.MENU,
    },
    background: {
      main: COLORS.AZUL1,
    },
    footer: {
      main: COLORS.AZUL4,
    },
    tags: {
      culture: COLORS.CULTURE,
      shape: COLORS.SHAPE,
    }
  },
  typography: {
    h1: {
      fontSize: 40,
      fontWeight: 'bold',
      color: 'black',
    },
    p: {
      fontSize: 20,
      fontWeight: 'normal',
      color: 'black',
    },
  },
});

// Override primary and secondary colors
// These colors have a main, light, dark and darker variants
theme = createTheme(theme, {
  palette: {
    primary: theme.palette.augmentColor({
      color: {
        main: COLORS.AZUL2,
      },
      name: "primary",
    }),
    secondary: theme.palette.augmentColor({
      color: {
        main: COLORS.AZUL3,
      },
      name: "secondary",
    }    
    ),
  },
});

export default theme;
