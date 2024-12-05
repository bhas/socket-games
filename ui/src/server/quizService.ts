import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";

enum EventType {
    SEND_MESSAGE = "SendMessage",
    SEND_CELEBRATION = "SendCelebration",
    RECEIVE_MESSAGE = "ReceiveMessage",
    RECEIVE_CELEBRATION = "ReceiveCelebration"
}

type Callback<T> = (data: T) => void;


export default class QuizService {
    private connection: HubConnection;
    private messageListeners: Callback<string>[] = [];
    private celebrationListeners: Callback<number>[] = [];

    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl("https://localhost:32768/quiz")
            .build();
    }

    public async start() {
        try {
            await this.connection.start();
            console.log("Connected to server");

            this.connection.on(EventType.RECEIVE_MESSAGE, (user: string, data: string) => {
                this.messageListeners.forEach((func) => func(data));
                this.logMessageReceived(EventType.RECEIVE_MESSAGE, this.messageListeners.length, data);
            });

            this.connection.on(EventType.RECEIVE_CELEBRATION, (user: string, years: number) => {
                this.celebrationListeners.forEach((func) => func(years));
                this.logMessageReceived(EventType.RECEIVE_CELEBRATION, this.celebrationListeners.length, years);
            });
        }
        catch (e) {
            console.error(e, "Failed to connect to server");
        }
    }

    public sendMessage(user: string, message: string) {
        this.connection.invoke(EventType.SEND_MESSAGE, user, message);
        this.logMessageSent(EventType.SEND_MESSAGE, message);
    }

    public sendCelebration(user: string, years: number) {
        this.connection.invoke(EventType.SEND_CELEBRATION, user, years);
        this.logMessageSent(EventType.SEND_CELEBRATION, years);
    }

    public onMessageReceived(callback: Callback<string>) {
        this.messageListeners.push(callback);
    }
    
    public offMessageReceived(callback: Callback<string>) {
        this.messageListeners = this.messageListeners.filter(func => func !== callback);
    }

    public onCelebrationReceived(callback: Callback<number>) {
        this.celebrationListeners.push(callback);
    }

    public offCelebrationReceived(callback: Callback<number>) {
        this.celebrationListeners = this.celebrationListeners.filter(func => func !== callback);
    }

    private logMessageReceived(event: EventType, listeners: number, data: any) {
        console.log(`QuizService: Received '${event}' with ${listeners} listeners`, data);
    }

    private logMessageSent(event: EventType, data: any | undefined) {
        console.log(`QuizService: Sent '${event}'`, data);
    }
}
