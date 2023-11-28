import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  typography: {
    fontFamily: "Poppins",
    subtitle1: {
      fontSize: "20px",
    },
    subtitle2: {
      fontSize: "16px",
    },
    body1: {
      fontSize: "16px",
      fontWeight: 600,
    },
  },
  palette: {
    text: {
      secondary: "red", // Replace this with your desired color value
    },
  },
  // Other theme configurations
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
