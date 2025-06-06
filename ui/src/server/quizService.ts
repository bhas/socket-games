import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import { RockPaperScissorsGame } from "./models";

export enum QuizServiceAction {
    SIGN_IN = "SignIn",
    SEND_MESSAGE = "SendMessage",
    SEND_CELEBRATION = "SendCelebration",
    CREATE_SESSION = "CreateSession",
    GET_SESSION = "GetSession",
    JOIN_SESSION = "JoinSession",
    LEAVE_SESSION = "LeaveSession",

    START_GAME = "StartGame",
    STOP_GAME = "StopGame",
    SELECT_MOVE = "SelectMove",
    GET_GAME = "GetGame",
}

export enum QuizServiceEvent {
    PLAYER_JOINED_SESSION = "PlayerJoined",
    PLAYER_LEFT_SESSION = "PlayerLeft",
    GAME_STARTED = "GameStarted",
    GAME_STOPPED = "GameStopped",
    GAME_COMPLETED = "GameCompleted",
    ROUND_COMPLETED = "RoundCompleted",
}

type Callback<T> = (data: T) => void;


export default class QuizService {
    private connection: HubConnection;
    private listeners: Map<QuizServiceEvent, Callback<any>[]> = new Map();


    constructor() {
        const baseUrl = import.meta.env.VITE_API_URL;
        this.initListenerMap();
        this.connection = new HubConnectionBuilder()
            .withUrl(baseUrl)
            .build();
    }

    public async start() {
        const listenToEvent = (event: QuizServiceEvent, dataFunc: (...args: any[]) => any) => {
            this.connection.on(event, args => {
                const data = dataFunc(args);
                this.listeners.get(event)!.forEach((func) => func(data));
                this.logMessageReceived(event, data);
            });
        }

        try {
            // just a comment
            await this.connection.start();
            console.log("Connected to server");
            listenToEvent(QuizServiceEvent.GAME_STARTED, (game: RockPaperScissorsGame) => game);
            listenToEvent(QuizServiceEvent.GAME_STOPPED, (gameId: number) => gameId);
            listenToEvent(QuizServiceEvent.GAME_COMPLETED, (game: RockPaperScissorsGame) => game);
            listenToEvent(QuizServiceEvent.ROUND_COMPLETED, (game: RockPaperScissorsGame) => game);
            listenToEvent(QuizServiceEvent.PLAYER_JOINED_SESSION, (player: any) => player);
            listenToEvent(QuizServiceEvent.PLAYER_LEFT_SESSION, (player: any) => player);
        }
        catch (e) {
            console.error(e, "Failed to connect to server");
        }
    }

    public async trigger(action: QuizServiceAction, ...args: any[]) {
        console.log("Sending message", action, args);
        await this.connection.invoke(action, ...args);
        this.logMessageSent(action, args);
    }

    public async fetch<TResult>(action: QuizServiceAction, ...args: any[]): Promise<TResult> {
        this.logMessageSent(action, args);
        const result = await this.connection.invoke<TResult>(action, ...args);
        return result;
    }

    public on<T>(event: QuizServiceEvent, callback: Callback<T>): void {
        this.listeners.get(event)!.push(callback);
    }

    public off<T>(event: QuizServiceEvent, callback: Callback<T>): void {
        const newItems = this.listeners.get(event)!.filter(func => func !== callback);
        this.listeners.set(event, newItems);
    }

    private initListenerMap() {
        Object.values(QuizServiceEvent).forEach(event => {
            this.listeners.set(event, []);
        });
    }

    private logMessageReceived(event: QuizServiceEvent, data: any) {
        const listenerCount = this.listeners.get(event)!.length;
        console.log(`QuizService: Received '${event}' with ${listenerCount} listeners`, data);
    }

    private logMessageSent(action: QuizServiceAction, data: any | undefined) {
        console.log(`QuizService: Sent '${action}'`, data);
    }
}
