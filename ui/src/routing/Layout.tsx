import { Link, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Layout() {
  const { me } = useAuth();

  return (
    <>
      <header className="bg-blue-300 p-4 flex flex-row items-center justify-between text-blue-900 font-medium">
        <Link to="/" className="flex flex-row items-center gap-2 text-blue-900 hover:text-blue-700 no-underline px-3 py-1 font-medium">
          <FontAwesomeIcon icon={faHome} />
          My First Game
        </Link>
        {me && (
          <div className="flex flex-row items-center gap-2 select-none">
            <FontAwesomeIcon icon={faUser} />
            <span>{me.username}</span>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
