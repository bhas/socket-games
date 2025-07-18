import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuizService } from "../../contexts/QuizServiceContext";
import { Move, RockPaperScissorsGame } from "../../server/models";
import { QuizServiceAction, QuizServiceEvent } from "../../server/quizService";
import { useAuth } from "../../contexts/AuthContext";
import MainContentContainer from "../../components/MainContentContainer";
import { RpsActionButton } from "../../components/rockPaperScissors/RpsActionButton";
import Title from "../../components/Title";
import { RpsAnimatedActionIcon } from "../../components/rockPaperScissors/RpsAnimatedActionIcon";
import clsx from "clsx";

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
            <UserDetails alignLeft={true} title="You" username={me!.username} />
            <div className="text-5xl top-3 font-bold text-black pt-3">VS.</div>
            <UserDetails
              alignLeft={false}
              title="The Enemy"
              username={opponent.username}
            />
          </div>

          <div className="self-center text-2xl font-bold text-black">
            Round {game.leaderboard.rounds.length + 1}
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <strong className="mb-4">Your Move</strong>
              <ActionSelector move={myMove} onSelectMove={selectMove} />
            </div>

            <div className="flex flex-col items-end">
              <strong className="mb-10">Their Move</strong>
              <RpsAnimatedActionIcon />
            </div>
          </div>

          <div className="self-center text-2xl mt-10 font-bold text-black">
            Previous Rounds
          </div>

          {renderLeaderboard()}
        </div>
      </MainContentContainer>
    </div>
  );
}

interface ActionSelectorProps {
  move?: Move;
  onSelectMove: (move: Move) => void;
}

function ActionSelector({ move, onSelectMove }: ActionSelectorProps) {
  return (
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
  );
}

interface UserDetailsProps {
  username: string;
  title: string;
  alignLeft: boolean;
}

function UserDetails({ username, title, alignLeft }: UserDetailsProps) {
  const alignment = alignLeft ? "items-start" : "items-end";
  return (
    <div className={clsx("flex flex-col", alignment)}>
      <div className="text-sm">({title})</div>
      <div className="text-2xl font-semibold mb-12">{username}</div>
    </div>
  );
}