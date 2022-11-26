import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <main className="App">
            <h1>APP</h1>
            <Outlet />
        </main>
    )
}

export default Layout