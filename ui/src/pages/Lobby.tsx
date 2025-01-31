import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuizService } from "../contexts/QuizServiceProvider";
import { QuizServiceAction, QuizServiceEvent } from "../server/quizService";
import { User, Session } from "../server/models";

export default function Lobby() {
    const [players, setPlayers] = useState<User[]>([]);
    const { sessionId } = useParams();
    const quizService = useQuizService();

    useEffect(() => {
        if (!quizService) return;

        quizService.on(QuizServiceEvent.PLAYER_JOINED_SESSION, onPlayerJoined);
        quizService.on(QuizServiceEvent.PLAYER_LEFT_SESSION, onPlayerLeft);

        quizService.fetch<Session>(QuizServiceAction.GET_SESSION, sessionId)
            .then((session) => setPlayers(session.players));

        return () => {
            quizService.off(QuizServiceEvent.PLAYER_JOINED_SESSION, onPlayerJoined);
            quizService.off(QuizServiceEvent.PLAYER_LEFT_SESSION, onPlayerLeft);
        };
    }, [quizService, sessionId]);

    const onPlayerJoined = (player: User) => {
        setPlayers((prevPlayers) => [...prevPlayers, player]);
        console.log("Player joined session", player);
    };

    const onPlayerLeft = (player: User) => {
        setPlayers((prevPlayers) => prevPlayers.filter((x) => x.id !== player.id));
        console.log("Player left session", player);
    };

    return (
        <div className="flex flex-col">
            <h1>Lobby Page</h1>
            {`session id is ${sessionId}`}
            <h2>Players</h2>
            <ol>
                {players.map((player) => (
                    <li key={player.id}>{player.username}</li>
                ))}
            </ol>
        </div>
    );
}
