import { useEffect, useState } from "react";
import { useQuizService } from "../contexts/QuizServiceProvider";

interface Props {
  header: string;
}

export default function MessageList({ header }: Props) {

    const [messages, setMessages] = useState<string[]>([]);
    const service = useQuizService();

    useEffect(() => {
      if (!service) return;

      service.onMessageReceived(onReceiveMessage);

      return () => {
        service.offMessageReceived(onReceiveMessage);
      };
    }, [service]);

    const onReceiveMessage = (message: string) => setMessages(oldMessages => [...oldMessages, message]);

    return (
    <div>
      <h2>{header}</h2>
      {messages.map((message, i) => (
        <div key={i}>{message}</div>
      ))}
    </div>
  );
}
