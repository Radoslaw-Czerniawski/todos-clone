import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authentication } from "./components/Authentication/Authentication";
import { Login } from "./Views/Login";
import { Main } from "./Views/Main";
import {Admin } from "./Views/Admin"

function App() {

    const [isLogged, setIsLogged] = useState(() => {
        const state = JSON.parse(window.localStorage.getItem("isLogged"))
        return state !== null ? state : false
    });
    const [user, setCurrentUser] = useState(() => {
        const user = window.localStorage.getItem("user")
        return user !== "" ? JSON.parse(window.localStorage.getItem("user")) : null
    });



    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Authentication user={user} isLogged={isLogged}>
                            <Main user={user} />
                            <Admin />
                        </Authentication>
                    }
                >
                </Route>
                <Route path="/login" element={<Login setCurrentUser={setCurrentUser} setIsLogged={setIsLogged} />}/>
                <Route path="/admin" element={<Admin />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
