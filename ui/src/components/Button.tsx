import { PropsWithChildren } from "react";

interface ButtonProps {
  onClick: () => void;
}

export default function Button({ children, onClick }: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 m-1 px-4 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
