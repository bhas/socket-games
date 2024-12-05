import { NavLink } from "react-router";


export default function Home() {
    return (
        <>
        <h1>Home Page</h1>
        <NavLink to="/about">About</NavLink>
        </>
    )
}