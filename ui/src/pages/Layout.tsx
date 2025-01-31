import { Outlet } from "react-router";
import { usePlayer } from "../contexts/PlayerServiceProvider";

export default function Layout() {
  const { me } = usePlayer();

  return (
    <>
      <header className="bg-blue-300 p-4 flex flex-row items-center justify-center">
        My First Game
        {me && <span> - {me.username}</span>}
      </header>
      <main className="mx-auto max-w-4xl border-2 p-10">
        <Outlet />
      </main>
    </>
  );
}
