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
    console.log("Service worker update detected.");
    if (registration && registration.waiting) {
      console.log("Service worker waiting...");
      const waitingServiceWorker = registration.waiting;
      if (waitingServiceWorker) {
        console.log("Service worker waiting found.");
        waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
        if (window.confirm("A new version is available. Reload to update?")) {
          window.location.reload();
        }
      }
    }
  },
});

reportWebVitals();
