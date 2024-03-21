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
    const newWorker = registration.waiting;
    if (newWorker) {
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed") {
          if (
            window.confirm(
              "A new version of the app is available. Refresh now?"
            )
          ) {
            window.location.reload();
          }
        }
      });
    }
  },
});

reportWebVitals();
