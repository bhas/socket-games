import { FormEvent, useState } from "react";
import { useQuizService } from "../contexts/QuizServiceContext";
import { QuizServiceAction } from "../server/quizService";
import { User } from "../server/models";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";



export default function SignIn() {
    const randomUsername = "Vue UI " + Math.floor(Math.random() * 100);
    const [username, setUsername] = useState<string>(randomUsername);
    const { setMe } = useAuth();
    const quizService = useQuizService()!;
    const navigate = useNavigate();

    const signIn = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = await quizService.fetch<User>(QuizServiceAction.SIGN_IN, username);
        console.log("Signed in as", user);
        setMe(user);
        navigate("/");
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