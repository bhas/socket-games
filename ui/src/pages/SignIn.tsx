import { FormEvent, useState } from "react";
import { useQuizService } from "../contexts/QuizServiceContext";
import { QuizServiceAction } from "../server/quizService";
import { User } from "../server/models";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import Title from "../components/Title";
import { generateUsername } from "../utilities/valueGenerator";
import MainContentContainer from "../components/MainContentContainer";

export default function SignIn() {
  const [username, setUsername] = useState<string>(generateUsername());
  const { setMe } = useAuth();
  const quizService = useQuizService()!;
  const navigate = useNavigate();

  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = await quizService.fetch<User>(
      QuizServiceAction.SIGN_IN,
      username
    );
    console.log("Signed in as", user);
    setMe(user);
    navigate("/");
  };

  return (
    <MainContentContainer>
      <div className="flex flex-col gap-2 items-center">
        <Title>Sign In</Title>
        <form onSubmit={signIn} className="flex flex-col gap-4 items-stretch">
          <span className="self-center text-wrap">
            Make yourself stand out with a unique name 🦄
          </span>
          <input
            type="text"
            className="text-2xl px-5 py-2"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setUsername(generateUsername())}
            className="flex items-center gap-2 px-5 py-2 bg-gray-200 rounded-lg"
          >
            <span>🎲</span>
            <span>Randomize</span>
          </button>
          <Button type="submit">Sign In</Button>
        </form>
      </div>
    </MainContentContainer>
  );
}
