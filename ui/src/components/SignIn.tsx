import { FormEvent, useState } from "react";
import { useQuizService } from "../contexts/QuizServiceProvider";
import { QuizServiceAction } from "../server/quizService";
import { User } from "../server/models";
import { usePlayer } from "../contexts/PlayerServiceProvider";



export default function SignIn() {
    const randomUsername = "Vue UI " + Math.floor(Math.random() * 100);
    const [username, setUsername] = useState<string>(randomUsername);
    const { setMe } = usePlayer();
    const quizService = useQuizService()!;

    const signIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = await quizService.fetch<User>(QuizServiceAction.SIGN_IN, username);
        console.log("Signed in as", user);
        setMe(user);
    }

    return (
        <div className="flex flex-col gap-3 items-center">
            <h2>Sign In</h2>
            <form onSubmit={signIn}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" required value={username} onChange={e => setUsername(e.target.value)}/>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}