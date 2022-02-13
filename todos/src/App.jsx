import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authentication } from "./components/Authentication/Authentication";
import { Login } from "./Views/Login";
import { Main } from "./Views/Main";
import { Admin } from "./Views/Admin";
import styles from "./CSS/StylesApp.module.scss";

function App() {
    const [isLogged, setIsLogged] = useState(() => {
        const state = JSON.parse(window.localStorage.getItem("isLogged"));
        return state !== null ? state : false;
    });
    const [user, setCurrentUser] = useState(() => {
        const user = window.localStorage.getItem("user");
        return user !== "" ? JSON.parse(window.localStorage.getItem("user")) : null;
    });
    const [isAdmin, setIsAdmin] = useState(() => {
        const admin = window.localStorage.getItem("isAdmin")
        return admin !== "" ? JSON.parse(window.localStorage.getItem("isAdmin")) : false
    })


    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Authentication isAdmin={isAdmin} isLogged={isLogged}>
                            <Main user={user} />
                        </Authentication>
                    }
                ></Route>
                <Route
                    path="/login"
                    element={
                        <Login
                            setIsAdmin={setIsAdmin}
                            setCurrentUser={setCurrentUser}
                            setIsLogged={setIsLogged}
                        />
                    }
                />
                <Route path="/admin" element={<Admin setIsAdmin={setIsAdmin} isAdmin={isAdmin}/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
