import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- ENV DEBUG ---
console.log("🔥 ENV TEST ->", {
  VITE_API_BASE: import.meta.env.VITE_API_BASE,
  ALL_ENV: import.meta.env
});
// ------------------

createRoot(document.getElementById("root")!).render(<App />);
