import { PropsWithChildren } from "react";

interface TextInputProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({ children, onClick }: PropsWithChildren<TextInputProps>) {
  return (
    <input type="text"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 m-1 px-4 rounded"
      onClick={onClick}
    >
      {children}
    </input>
  );
}
