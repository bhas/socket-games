import { Link, Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <header className="bg-blue-300 p-4 flex flex-row items-center justify-center">
        My First Game
      </header>
      <main className="mx-auto max-w-4xl border-2 p-10">
        <Outlet />
      </main>
    </>
  );
}
