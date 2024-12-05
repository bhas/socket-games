import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import QuizService from "../server/quizService";


export default function Home() {

    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const service = new QuizService();
        service.start().then(() => {
            service.onMessageReceived(onReceiveMessage);
            service.sendMessage("user", "Hello, world 123!");
        });

    }, [])

    const onReceiveMessage = (message: string) => {
        console.log("Yay I Received message:", message);
        setMessages([...messages, message]);
    }

    return (
        <>
        <h1>Home Page</h1>
        <NavLink to="/about">About</NavLink>

        <h2>Messages</h2>
        <ol className="list-decimal list-inside">
            {messages.map((message, index) => <li key={index}>{message}</li>)}
        </ol>

        </>
    )
}