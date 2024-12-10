import { NavLink, useNavigate } from "react-router";
import { useQuizService } from "../contexts/QuizServiceProvider";
import Button from "../components/Button";
import { QuizServiceAction } from "../server/quizService";
import { Session } from "../server/models";
import { useState } from "react";

export default function Home() {
  const [sessionId, setSessionId] = useState("");
  const quizService = useQuizService()!;
  const navigate = useNavigate();

  const onCreateGame = async () => {
    const username = "Vue UI " + Math.floor(Math.random() * 100);
    const session = await quizService.fetch<Session>(QuizServiceAction.CREATE_SESSION, username);
    navigate(`/sessions/${session.id}/lobby`);
    console.log("Created session " + session.id);
  };

  const onJoinGame = async () => {
    const username = "Vue UI " + Math.floor(Math.random() * 100);
    const session = await quizService.fetch<Session>(QuizServiceAction.JOIN_SESSION, sessionId, username);
    navigate(`/sessions/${session.id}/lobby`);
    console.log("Joined session " + session.id);
  };

  return (
    <div className="flex flex-col">
      <h1>Home Page</h1>
      <NavLink to="/about">About</NavLink>

      <div className="flex flex-row items-center justify-center gap-10">
        <Button onClick={onCreateGame}>Create game</Button>
        <Button onClick={onJoinGame}>Join game</Button>
        <input type="text" placeholder="Enter session ID" maxLength={7} value={sessionId} onChange={e => setSessionId(e.target.value)}/>
      </div>
    </div>
  );
}
