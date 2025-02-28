import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { QuizServiceProvider } from "./contexts/QuizServiceContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { AppRoutes } from "./routing/AppRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QuizServiceProvider>
    <AuthProvider>
      <BrowserRouter>
        {AppRoutes}
      </BrowserRouter>
    </AuthProvider>
  </QuizServiceProvider>
  // </StrictMode>
);
