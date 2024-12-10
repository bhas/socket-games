import { useParams } from "react-router";

export default function Lobby() {

    const {sessionId} = useParams();

    return (
        <div className="flex flex-col">
            <h1>Lobby Page</h1>
            {`session id is ${sessionId}`}
        </div>
    );
}