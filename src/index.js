import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      // Dispatch a custom event to alert the user of the update
      const event = new CustomEvent("appUpdateAvailable", {
        detail: { message: "A new version is available. Reload to update?" },
      });
      window.dispatchEvent(event);
    }
  },
});

reportWebVitals();
