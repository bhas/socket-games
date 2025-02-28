import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuizService } from "../../contexts/QuizServiceContext";
import { Move, RockPaperScissorsGame, User } from "../../server/models";
import { QuizServiceAction, QuizServiceEvent } from "../../server/quizService";
import { useAuth } from "../../contexts/AuthContext";
import MainContentContainer from "../../components/MainContentContainer";
import {
  RpsActionButton,
} from "../../components/rockPaperScissors/RpsActionButton";
import Title from "../../components/Title";
import { RpsAnimatedActionIcon } from "../../components/rockPaperScissors/RpsAnimatedActionIcon";

export default function RockPaperScissors() {
  const quizService = useQuizService();
  const { gameId } = useParams();
  const gameIdInt = Number.parseInt(gameId!);
  const { me } = useAuth();

  const [game, setGame] = useState<RockPaperScissorsGame | undefined>(
    undefined
  );
  const [myMove, setMyMove] = useState<Move | undefined>(undefined);

  useEffect(() => {
    if (!quizService) return;

    quizService.on(QuizServiceEvent.ROUND_COMPLETED, onRoundCompleted);
    quizService.on(QuizServiceEvent.GAME_COMPLETED, onGameCompleted);

    fetchGame();
  }, [quizService, gameIdInt]);

  const fetchGame = async () => {
    const game = await quizService!.fetch<RockPaperScissorsGame>(
      QuizServiceAction.GET_GAME,
      gameIdInt
    );
    setGame(game);
    console.log("Game fetched", game);
  };

  const onRoundCompleted = (game: RockPaperScissorsGame) => {
    setMyMove(undefined);
    setGame(game);
  };

  const onGameCompleted = (game: RockPaperScissorsGame) => {
    setGame(game);
    console.warn("Game completed", game);
  };

  const selectMove = (move: Move) => {
    setMyMove(move);
    quizService!.trigger(
      QuizServiceAction.SELECT_MOVE,
      gameIdInt,
      me!.id,
      move
    );
  };

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
    );
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  const opponent = me!.id === game.player1.id ? game.player2 : game.player1;

  return (
    <div className="bg-yellow-300">
      <MainContentContainer>
        <div className="flex flex-col gap-6">
          <Title>Rock Paper Scissors</Title>

          <div className="flex flex-row justify-between">
            <MeSection onSelectMove={selectMove} username={me!.username} move={myMove} />
            <OpponentSection username={opponent.username} />
          </div>

          <div className="grid grid-cols-2"></div>

          {renderLeaderboard()}
        </div>
      </MainContentContainer>
    </div>
  );
}

interface MeSectionProps {
  username: string;
  move?: Move;
  onSelectMove: (move: Move) => void;
}

function MeSection({ username, move, onSelectMove }: MeSectionProps) {
  return (
    <div className="flex flex-col items-start">
      <div className="text-sm">(You)</div>
      <div className="text-2xl font-semibold mb-12">{username}</div>
      <strong className="mb-4">Your Move</strong>
      <div className="flex flex-row items-center justify-center gap-10">
        <RpsActionButton
          move={Move.ROCK}
          onClick={() => onSelectMove(Move.ROCK)}
          selected={move === Move.ROCK}
        />
        <RpsActionButton
          move={Move.PAPER}
          onClick={() => onSelectMove(Move.PAPER)}
          selected={move === Move.PAPER}
        />
        <RpsActionButton
          move={Move.SCISSORS}
          onClick={() => onSelectMove(Move.SCISSORS)}
          selected={move === Move.SCISSORS}
        />
      </div>
    </div>
  );
}

interface OpponentSectionProps {
  username: string;
  move?: Move;
}

function OpponentSection({ username }: OpponentSectionProps) {
  return (
    <div className="flex flex-col items-end">
      <div className="text-sm">(The Enemy)</div>
      <div className="text-2xl font-semibold mb-12">{username}</div>
      <strong className="mb-10">Their Move</strong>
      <RpsAnimatedActionIcon />
    </div>
  );
}
