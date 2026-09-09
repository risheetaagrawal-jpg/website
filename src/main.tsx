import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./redesign/App.tsx";
import { installVideoPlayer } from "./vimeo";

installVideoPlayer();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
