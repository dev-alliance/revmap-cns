/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";
import { DataGrid } from "@mui/x-data-grid";
import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "ORg4AjUWIQA/Gnt2UVhhQlVFfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX5QdkJjWH5ddH1dQ2Fb"
);
const theme = createTheme({
  typography: {
    fontFamily: ["Nunito Sans", "sans-serif"].join(","),
    subtitle1: {
      fontSize: "20px",
    },
    subtitle2: {
      fontSize: "17px",
    },
    body2: {
      fontSize: "12px",
    },
    body1: {
      fontSize: "1rem",
      // fontWeight: 400,
    },
  },
  palette: {
    text: {
      secondary: " #555,", // Replace this with your desired color value
    },
  },
  // shadows: [
  //   "none",
  //   "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)", // redefine the elevation 1 shadow
  //   // ... redefine other elevations if needed
  // ],
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          // fontWeight: "900",
          fontSize: "17px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#fff",
          // wordSpacing: "3px",
          // letterSpacing: "0.5px",
        },
      },
    },
  },
  // Other theme configurations
} as any);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
  // </React.StrictMode>
);
