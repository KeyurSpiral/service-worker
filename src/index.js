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
    console.log("New version available!");
    const answer = window.confirm(
      "A new version of the app is available. Click OK to refresh."
    );
    if (answer) {
      window.location.reload();
    }
  },
});

reportWebVitals();
