import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuizService } from "../contexts/QuizServiceContext";
import { QuizServiceAction, QuizServiceEvent } from "../server/quizService";
import { User, Session, GameType, RockPaperScissorsGame } from "../server/models";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import MainContentContainer from "../components/MainContentContainer";
import Title from "../components/Title";

export default function Lobby() {
    const [players, setPlayers] = useState<User[]>([]);
    const { sessionId } = useParams();
    const { me } = useAuth();
    const quizService = useQuizService();
    const navigate = useNavigate();

    useEffect(() => {
        if (!quizService) return;

        quizService.on(QuizServiceEvent.PLAYER_JOINED_SESSION, onPlayerJoined);
        quizService.on(QuizServiceEvent.PLAYER_LEFT_SESSION, onPlayerLeft);
        quizService.on(QuizServiceEvent.GAME_STARTED, onGameStarted);

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

    const onGameStarted = async (game: RockPaperScissorsGame) => {
        navigate(`/games/rock-paper-scissors/${game.id}`);
    };

    const startGame = () => {
        quizService!.trigger(QuizServiceAction.START_GAME, sessionId, me?.id, GameType.ROCK_PAPER_SCISSORS);
    };

    return (
        <MainContentContainer>
            <Title>Lobby Page</Title>
            {`session id is ${sessionId}`}
            <h2>Players</h2>
            <ol>
                {players.map((player) => (
                    <li key={player.id}>{player.username}</li>
                ))}
            </ol>
            <Button onClick={() => startGame()}>Start Game</Button>
        </MainContentContainer>
    );
}
