import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import QuizService from "../server/quizService";


const QuizServiceContext = createContext<QuizService | undefined>(undefined);

export const QuizServiceProvider = ({children}: PropsWithChildren) => {
    const [quizService, setQuizService] = useState<QuizService | undefined>(undefined);

    useEffect(() => {
        const quizService = new QuizService();
        quizService.start().then(() => setQuizService(quizService));
    }, []);

    return (
        <QuizServiceContext.Provider value={quizService}>
            {children}
        </QuizServiceContext.Provider>
    )
}

export const useQuizService = () => useContext(QuizServiceContext);