import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useQuizService } from "../contexts/QuizServiceProvider";

export default function Home() {
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const quizService = useQuizService()!;

  useEffect(() => {
    if (!quizService)
        return; 

    quizService.onMessageReceived(onReceiveMessage);
    quizService.sendMessage("user", "Hello, world 123!");

    return () => {
        quizService.offMessageReceived(onReceiveMessage);
    }
  }, [quizService]);

  const onReceiveMessage = (message: string) => {
    setMessages(oldMessages => [...oldMessages, message]);
  };

  const handleSendMessage = () => {
    quizService.sendMessage("user", messageText);
  };

  return (
    <>
      <h1>Home Page</h1>
      <NavLink to="/about">About</NavLink>

      <input
        type="text"
        placeholder="Enter message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={() => handleSendMessage()}>Send</button>

      <h2>Messages</h2>
      <ol className="list-decimal list-inside">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ol>
    </>
  );
}
