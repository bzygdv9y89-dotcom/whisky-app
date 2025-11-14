import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // make extension explicit to avoid resolution issues

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
