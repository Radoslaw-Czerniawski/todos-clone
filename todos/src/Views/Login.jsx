import { Header } from "../components/Header/Header";
import styles from "../CSS/StylesApp.module.scss";
import styles2 from "../components/Input/StylesInput.module.scss";
import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";

const Login = ({ setIsLogged, setCurrentUser }) => {
    const [loginState, setLoginState] = useState();
    const [passwordState, setPasswordState] = useState();
    const [isLoggedCurrent, setIsLoggedCurrent] = useState(false);
    const [loginOrRegister, setLoginOrRegister] = useState("login");

    const form = useRef();

    const loginUser = e => {
        e.preventDefault();

        if (loginOrRegister === "login") {
            return fetch("/users/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    login: form.current.login.value,
                    password: form.current.password.value,
                }),
            })
                .then(res => res.json())
                .then(data => {
                    window.localStorage.setItem("isLogged", JSON.stringify(true))
                    window.localStorage.setItem("user", JSON.stringify(form.current.login.value))
                    setCurrentUser(form.current.login.value);
                    setIsLoggedCurrent(true);
                    setIsLogged(true);
                    console.log(data);
                })
        } else {
            console.log("wow69");
            return fetch("/users/register", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    login: form.current.login.value,
                    password: form.current.password.value,
                }),
            })
        }
    };

    return (
        <div className={styles.appWrapper}>
            <section className={styles.sectionContainer}>
                <Header title={"Log / Reg"} />
                <form
                    ref={form}
                    className={styles2.form}
                    onSubmit={e => {
                        loginUser(e)
                    }}
                >
                    <label className={styles2.label}>
                        Login
                        <input name="login" className={styles2.input2} placeholder="login" />
                    </label>

                    <label className={styles2.label}>
                        Password
                        <input name="password" className={styles2.input2} placeholder="password" />
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button onClick={() => setLoginOrRegister("login")} className={styles2.button}>Login</button>
                        <button onClick={() => setLoginOrRegister("register")} className={styles2.button}>Register</button>
                    </div>
                </form>
                {isLoggedCurrent ? <Navigate to="/" /> : ""}
            </section>
        </div>
    );
};

export { Login };
