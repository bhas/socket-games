import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuizService } from "../../contexts/QuizServiceProvider";
import { Move, RockPaperScissorsGame, RoundResult } from "../../server/models";
import { QuizServiceAction, QuizServiceEvent } from "../../server/quizService";
import { usePlayer } from "../../contexts/PlayerServiceProvider";

export default function RockPaperScissors() {
  const quizService = useQuizService();
  const { gameId } = useParams();
  const gameIdInt = Number.parseInt(gameId!);
  const { me } = usePlayer();

  const [game, setGame] = useState<RockPaperScissorsGame | undefined>(undefined);

  useEffect(() => {
    if (!quizService) return;

    quizService.on(QuizServiceEvent.ROUND_COMPLETED, onRoundCompleted);
    quizService.on(QuizServiceEvent.GAME_COMPLETED, onGameCompleted);

    fetchGame();
  }, [quizService, gameIdInt]);

  const fetchGame = async () => {
      const game = await quizService!.fetch<RockPaperScissorsGame>(QuizServiceAction.GET_GAME, gameIdInt);
      setGame(game);
      console.log("Game fetched", game);
  }

  const onRoundCompleted = (game: RockPaperScissorsGame) => {
    setGame(game);
  }

  const onGameCompleted = (game: RockPaperScissorsGame) => {
    setGame(game);
    console.warn("Game completed", game);
  }

  const selectMove = (move: Move) => {
    quizService!.trigger(QuizServiceAction.SELECT_MOVE, gameIdInt, me!.id, move);
  }

  const renderLeaderboard = () => {
    const scores = game!.leaderboard.rounds.map((round, index) => (
      <div className="flex flex-col gap-2" key={index}>
        <h4>Round {index + 1}</h4>
        <div className="flex flex-row gap-5">
        <div>Player 1: {Move[round.player1Move]}</div>
        <div>Player 2: {Move[round.player2Move]}</div>
        </div>
        
        <div>Winner: {round.result}</div>
      </div>
    ));

    return (
      <div className="flex flex-col items-center gap-12">
        <h1>Leaderboard</h1>
        {scores}
      </div>
    )
  }

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1>Rock Paper Scissors</h1>

      <div className="flex flex-row items-center justify-center gap-10">
        <button onClick={() => selectMove(Move.ROCK)}>Rock</button>
        <button onClick={() => selectMove(Move.PAPER)}>Paper</button>
        <button onClick={() => selectMove(Move.SCISSORS)}>Scissors</button>
      </div>

      <div className="flex flex-row items-center gap-12">
        <div className="flex flex-col items-center">
          <h2>Player 1: {game.player1.username}</h2>
          <div>?</div>
        </div>

        <div className="flex flex-col items-center">
          <h2>Player 2: {game.player2.username}</h2>
          <div>?</div>
        </div>
      </div>

      {renderLeaderboard()}
    </div>
  );
}
