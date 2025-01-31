import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Layout from "./pages/Layout.tsx";
import { QuizServiceProvider } from "./contexts/QuizServiceContext.tsx";
import Lobby from "./pages/Lobby.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import RockPaperScissors from "./pages/games/RockPaperScissors.tsx";
import SignIn from "./pages/SignIn.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QuizServiceProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/sign-in" element={<SignIn />} />

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/sessions/:sessionId/lobby" element={<Lobby />} />
              <Route
                path="/games/rock-paper-scissors/:gameId"
                element={<RockPaperScissors />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QuizServiceProvider>
  // </StrictMode>
);
