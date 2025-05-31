import React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { registerServiceWorker } from './lib/serviceWorker';

// Register service worker
registerServiceWorker().catch(console.error);

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);