import { NavLink, useNavigate } from "react-router";
import { useQuizService } from "../contexts/QuizServiceProvider";
import Button from "../components/Button";
import { QuizServiceAction } from "../server/quizService";
import { Session } from "../server/models";
import { useState } from "react";
import { usePlayer } from "../contexts/PlayerServiceProvider";
import SignIn from "../components/SignIn";

export default function Home() {
  const [sessionId, setSessionId] = useState("");
  const quizService = useQuizService()!;
  const { me } = usePlayer();
  const navigate = useNavigate();

  const onCreateGame = async () => {
    const session = await quizService.fetch<Session>(QuizServiceAction.CREATE_SESSION, me!.id);
    navigate(`/sessions/${session.id}/lobby`);
    console.log("Created session", session.id, "as", me!.id);
  };

  const onJoinGame = async () => {
    const session = await quizService.fetch<Session>(QuizServiceAction.JOIN_SESSION, sessionId, me!.id);
    navigate(`/sessions/${session.id}/lobby`);
    console.log("Joined session", session.id, "as", me!.id);
  };

  return (
    <div className="flex flex-col">
        {me ? 
        <>
          <h1>Home Page</h1>
          <NavLink to="/about">About</NavLink>

          <div className="flex flex-row items-center justify-center gap-10">
            <Button onClick={onCreateGame}>Create game</Button>
            <Button onClick={onJoinGame}>Join game</Button>
            <input type="text" placeholder="Enter session ID" maxLength={7} value={sessionId} onChange={e => setSessionId(e.target.value)}/>
          </div>
          </>
          : <SignIn/>
        }
    </div>
  );
}
