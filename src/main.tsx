import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./index.css";
import AppLayout from "./components/layout/AppLayout.tsx";
import { I18nProvider } from "./lib/i18n.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider defaultLang="ko">
        <Toaster richColors position="top-center" duration={1000} />
        <AppLayout>
          <App />
        </AppLayout>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>
);
