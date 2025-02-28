import clsx from "clsx";
import { PropsWithChildren } from "react";

interface TitleProps {
  className?: string;
}

export default function Title({ children, className }: PropsWithChildren<TitleProps>) {
  return (
    <h1 className={clsx("text-3xl font-bold pt-3 pb-5 self-center", className)}>
      {children}
    </h1>
  );
}
