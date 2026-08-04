import React from "react";
import ReactDOM from "react-dom/client";
import "./storageShim.js"; // sets up window.storage before App mounts
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
