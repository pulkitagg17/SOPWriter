import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./app/App.tsx";
import { Providers } from "./app/providers";

// Security: Clear any legacy auth data from storage (we use HttpOnly cookies now)
const LEGACY_KEYS = ['admin_token', 'jwt_token', 'refreshToken', 'session_id', 'user', 'token'];
LEGACY_KEYS.forEach(key => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
