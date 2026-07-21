import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ThemeProvider } from "./contexts/ThemeContext";
import { DatasetProvider } from "./contexts/DatasetContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <DatasetProvider>
        <App />
      </DatasetProvider>
    </ThemeProvider>
  </React.StrictMode>
);