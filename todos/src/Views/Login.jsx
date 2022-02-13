import { Header } from "../components/Header/Header";
import styles from "../CSS/StylesApp.module.scss";
import styles2 from "../components/Input/StylesInput.module.scss";
import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import logo from "../icons/gitLogo.svg";
import ReactDOM from "react-dom";

const Login = ({ setIsLogged, setCurrentUser, setIsAdmin }) => {
    const [loginState, setLoginState] = useState();
    const [passwordState, setPasswordState] = useState();
    const [isLoggedCurrent, setIsLoggedCurrent] = useState(false);
    const [loginOrRegister, setLoginOrRegister] = useState("login");
    const [modal, setModal] = useState({
        isModal: false,
        message: "wow",
        isSuccess: false,
    });

    const form = useRef();

    const loginUser = async e => {
        e.preventDefault();

        if (loginOrRegister === "login") {
            const res = await fetch("/users/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    login: form.current.login.value,
                    password: form.current.password.value,
                }),
            });

            if (res.ok) {
                const response = await res.json();
                const message = response.message;

                window.localStorage.setItem("isLogged", JSON.stringify(true));
                window.localStorage.setItem("user", JSON.stringify(form.current.login.value));

                setModal({
                    isModal: true,
                    message: message,
                    isSuccess: true,
                });

                fetch("/users")
                    .then(res => res.json())
                    .then(data => {
                        setTimeout(() => {
                            setModal({
                                isModal: false,
                                message: "",
                                isSuccess: false,
                            });
                            setCurrentUser(form.current.login.value);
                            setIsLoggedCurrent(true);
                            setIsLogged(true);
                        }, 1000);

                        if (data.isAdmin) {
                            window.localStorage.setItem("isAdmin", JSON.stringify(true));
                            setIsAdmin(true);
                        } else {
                            window.localStorage.setItem("isAdmin", JSON.stringify(false));
                            setIsAdmin(false);
                        }
                    })
                    .catch(error => console.log(error));
            } else {
                const message = await res.json();

                setModal({
                    isModal: true,
                    message: message,
                    isSuccess: false,
                });

                setTimeout(() => {
                    setModal({
                        isModal: false,
                        message: "",
                        isSuccess: false,
                    });
                }, 1000);
            }
        } else {
            const res = await fetch("/users/register", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    login: form.current.login.value,
                    password: form.current.password.value,
                }),
            });

            if (res.ok) {
                const response = await res.json();
                setModal({
                    isModal: true,
                    message: response,
                    isSuccess: true,
                });
                setTimeout(() => {
                    setModal({
                        isModal: false,
                        message: "",
                        isSuccess: false,
                    });
                }, 1700);
            } else {
                const response = await res.json();

                setModal({
                    isModal: true,
                    message: response,
                    isSuccess: false,
                });
                setTimeout(() => {
                    setModal({
                        isModal: false,
                        message: "",
                        isSuccess: false,
                    });
                }, 1700);
            }
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
                        loginUser(e);
                    }}
                >
                    <label className={styles2.label}>
                        Login
                        <input
                            required
                            name="login"
                            className={styles2.input2}
                            placeholder="login"
                        />
                    </label>

                    <label className={styles2.label}>
                        Password
                        <input
                            required
                            name="password"
                            type="password"
                            className={styles2.input2}
                            placeholder="password"
                        />
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button
                            onClick={() => setLoginOrRegister("login")}
                            className={styles2.button}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setLoginOrRegister("register")}
                            className={styles2.button}
                        >
                            Register
                        </button>
                    </div>
                </form>
                {isLoggedCurrent ? <Navigate to="/" /> : ""}
            </section>
            <div className={styles.authorsSection}>
                <p>Double-click to edit a todo</p>
                <p>Created by Oscar Godson</p>
                <p>Refactored by Christoph Burgmer</p>
                <p style={{ color: "black", display: "flex", position: "relative" }}>
                    Recreated by Radosław Czerniawski{" "}
                    <a href="https://github.com/Radoslaw-Czerniawski" target="_blank">
                        <div className={styles.linkImg}>
                            <img className={styles.logoImg} src={logo} alt="GitHub Link" />
                        </div>
                    </a>
                </p>
            </div>
            {modal.isModal &&
                ReactDOM.createPortal(
                    <div className={styles.modalWrapper}>
                        <div
                            className={
                                modal.isSuccess ? styles.modalWindowSuccess : styles.modalWindow
                            }
                        >
                            <h2>{modal.message}</h2>
                        </div>
                    </div>,
                    document.getElementById("wow"),
                )}
        </div>
    );
};

export { Login };
