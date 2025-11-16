console.log("ENV URL:", import.meta.env.VITE_CONVEX_URL);
import React from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import App from "./App";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
console.log("Convex URL from env:", import.meta.env.VITE_CONVEX_URL);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <ConvexAuthProvider client={convex}>
        <App />
      </ConvexAuthProvider>
    </ConvexProvider>
  </React.StrictMode>
);

