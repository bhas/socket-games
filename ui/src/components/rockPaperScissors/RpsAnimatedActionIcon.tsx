import { useEffect, useState } from "react";
import { Move } from "../../server/models";

export function RpsAnimatedActionIcon() {
  const [move, setMove] = useState<Move>(Move.ROCK);

  useEffect(() => {
    setTimeout(() => {
      switch (move) {
        case Move.ROCK:
          setMove(Move.PAPER);
          break;
        case Move.PAPER:
          setMove(Move.SCISSORS);
          break;
        case Move.SCISSORS:
          setMove(Move.ROCK);
          break;
      }
    }, 500);
  }, [move]);

  return (
    <div className="flex flex-col gap-1">
      <div className="relative rounded-full bg-blue-600 border-solid border-4 border-blue-950 p-2 opacity-60">
        <img src={getIcon(move)} width={80} />
        <div className="absolute inset-0 flex items-center justify-center text-7xl font-semibold">?</div>
      </div>
    </div>
  );
}

function getIcon(type: Move): string {
  switch (type) {
    case Move.ROCK:
      return "/images/rps/rock.png";
    case Move.PAPER:
      return "/images/rps/paper.png";
    case Move.SCISSORS:
      return "/images/rps/scissors.png";
  }
}
