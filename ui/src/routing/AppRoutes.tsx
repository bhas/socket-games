import { Route, Routes } from "react-router";
import Layout from "./Layout";
import SignIn from "../pages/SignIn";
import PrivateRoute from "./PrivateRoute";
import About from "../pages/About";
import Home from "../pages/Home";
import Lobby from "../pages/Lobby";
import RockPaperScissors from "../pages/games/RockPaperScissors";

export const AppRoutes = (
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
);
