import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Initialize axios interceptors for token management
import "./utils/axiosConfig";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
