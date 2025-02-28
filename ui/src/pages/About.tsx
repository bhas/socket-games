import { Link } from "react-router";
import MainContentContainer from "../components/MainContentContainer";

export default function About() {
  return (
    <MainContentContainer>
      <h1>About Page</h1>
      <Link to="/">Home</Link>
    </MainContentContainer>
  );
}
