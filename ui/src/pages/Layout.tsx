import { Link, Outlet } from "react-router";


export default function Layout() {
    return (
        <>
        <header>I am a header</header>
        <Outlet/>
        <footer>I am a footer</footer>
        </>
    )
}