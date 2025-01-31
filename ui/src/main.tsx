import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Layout from "./pages/Layout.tsx";
import { QuizServiceProvider } from "./contexts/QuizServiceProvider.tsx";
import Lobby from "./pages/Lobby.tsx";
import { PlayerProvider } from "./contexts/PlayerServiceProvider.tsx";
import RockPaperScissors from "./pages/games/RockPaperScissors.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QuizServiceProvider>
  <PlayerProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sessions/:sessionId/lobby" element={<Lobby />} />
          <Route path="/games/rock-paper-scissors/:gameId" element={<RockPaperScissors />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </PlayerProvider>
  </QuizServiceProvider>
  // </StrictMode>
);
