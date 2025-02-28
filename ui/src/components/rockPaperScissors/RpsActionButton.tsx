import clsx from "clsx";
import { Move } from "../../server/models";

interface RpsActionButtonProps {
  move: Move;
  onClick: () => void;
  selected: boolean;
}

export function RpsActionButton({ move, onClick, selected }: RpsActionButtonProps) {
  return (
    <button className="flex flex-col gap-1" onClick={onClick}>
      <strong className={clsx(!selected && "invisible")}>{getName(move)}</strong>
      <div className={clsx("rounded-full border-solid border-4 border-blue-950 p-2", selected ? "bg-orange-500" : "bg-blue-600")}>
        <img className="-scale-x-100" src={getIcon(move)} width={80} />
      </div>
    </button>
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

function getName(type: Move): string {
  switch (type) {
    case Move.ROCK:
      return "ROCK!";
    case Move.PAPER:
      return "PAPER!";
    case Move.SCISSORS:
      return "SCISSORS!";
  }
}
