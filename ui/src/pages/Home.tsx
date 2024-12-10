import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useQuizService } from "../contexts/QuizServiceProvider";
import Button from "../components/Button";
import { QuizServiceAction } from "../server/quizService";
import { Session } from "../server/models";

export default function Home() {
  const quizService = useQuizService()!;

  useEffect(() => {
    if (!quizService) return;

    // quizService.onMessageReceived(onReceiveMessage);
    // quizService.sendMessage("user", "Hello, world 123!");


    return () => {
      // quizService.offMessageReceived(onReceiveMessage);
    };
  }, [quizService]);

  const onCreateGame = async () => {
    const session = await quizService.fetch<Session>(QuizServiceAction.CREATE_SESSION);
    console.log(session);
  };

  const onJoinGame = () => {
    console.log("Join game");
  };

  return (
    <div className="flex flex-col">
      <h1>Home Page</h1>
      <NavLink to="/about">About</NavLink>

      <div className="flex flex-row items-center justify-center gap-10">
        <Button onClick={onCreateGame}>Create game</Button>
        <Button onClick={onJoinGame}>Join game</Button>
      </div>
    </div>
  );
}
