import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// React Scan - visualize component re-renders in development
// Disabled during E2E tests as it intercepts pointer events
if (import.meta.env.DEV && !window.navigator.webdriver) {
  import("react-scan").then(({ scan }) => {
    scan({
      enabled: true,
      log: true, // Console logs with render counts
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
