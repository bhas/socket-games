import { PropsWithChildren } from "react";

export default function MainContentContainer({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-4xl border-2 p-10 flex flex-col">
        {children}
    </div>
  );
}
