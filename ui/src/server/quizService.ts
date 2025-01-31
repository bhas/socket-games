import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";

export enum QuizServiceAction {
    SIGN_IN = "SignIn",
    SEND_MESSAGE = "SendMessage",
    SEND_CELEBRATION = "SendCelebration",
    CREATE_SESSION = "CreateSession",
    GET_SESSION = "GetSession",
    JOIN_SESSION = "JoinSession",
    LEAVE_SESSION = "LeaveSession",
}

export enum QuizServiceEvent {
    PLAYER_JOINED_SESSION = "PlayerJoined",
    PLAYER_LEFT_SESSION = "PlayerLeft",
    RECEIVE_MESSAGE = "ReceiveMessage",
    RECEIVE_CELEBRATION = "ReceiveCelebration"
}

type Callback<T> = (data: T) => void;


export default class QuizService {
    private connection: HubConnection;
    private listeners: Map<QuizServiceEvent, Callback<any>[]> = new Map();

    constructor() {
        this.initListenerMap();
        this.connection = new HubConnectionBuilder()
            .withUrl("https://localhost:7223/quiz")
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
            await this.connection.start();
            console.log("Connected to server");
            listenToEvent(QuizServiceEvent.RECEIVE_MESSAGE, (user: string, data: string) => data);
            listenToEvent(QuizServiceEvent.RECEIVE_CELEBRATION, (user: string, years: number) => years);
            listenToEvent(QuizServiceEvent.PLAYER_JOINED_SESSION, (player: any) => player);
            listenToEvent(QuizServiceEvent.PLAYER_LEFT_SESSION, (player: any) => player);
        }
        catch (e) {
            console.error(e, "Failed to connect to server");
        }
    }

    public async trigger(action: QuizServiceAction, args: any[] | undefined = undefined) {
        await this.connection.invoke(action, args);
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
