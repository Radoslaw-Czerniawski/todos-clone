import { Navigate } from "react-router-dom";
import { Header } from "../components/Header/Header";
import styles from "./StylesAdmin.module.scss";
import { MongoDBLogoutUser } from "../utilities/MongoDBContact";
import { useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { InputFilters } from "../components/Input/InputFilters.tsx";
import uniqid from "uniqid";

const Admin = ({ isAdmin, setIsAdmin }) => {
    const [isDropped, setIsDropped] = useState({
        users: {
            list: [],
            state: false,
        },
    });

    const logoutUser = () => {
        window.localStorage.setItem("isLogged", JSON.stringify(false));
        window.localStorage.setItem("user", "");
        window.localStorage.setItem("isAdmin", JSON.stringify(false));

        MongoDBLogoutUser();
    };

    const getUsers = () => {
        fetch("/users/all")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setIsDropped({
                    ...isDropped,
                    users: {
                        list: [...data],
                        state: true,
                    },
                })
            });
    };

    // notesLeft ? styles.markAllDone : styles.markedAllDone

    const wow = isDropped;

    function sortArray(x, y){
        return x.login.localeCompare(y.login);
    }

    console.log(wow.users.list.sort(sortArray));

    return (
        <>
            {isAdmin ? (
                <div className={styles.appWrapper}>
                    <Header title={"Admin"} />
                    <section style={styles.mainSectionWrapper}>
                        <div className={styles.input}>
                            <span
                                onClick={() => {
                                    if (!isDropped.users.state) {
                                        getUsers();
                                    } else {
                                        setIsDropped({
                                            ...isDropped,
                                            users: {
                                                list: [],
                                                state: false,
                                            },
                                        });
                                    }
                                }}
                                className={
                                    isDropped.users.state ? styles.markedAllDone : styles.markAllDone
                                }
                            ></span>
                            <div className={styles.label}>View All Users</div>
                        </div>
                        <div>
                            <TransitionGroup>
                                {isDropped.users.list.sort(sortArray).map(user => (
                                    <CSSTransition timeout={300} key={uniqid()} classNames="item2">
                                        <div className={styles.listItem}>{user.login}</div>
                                    </CSSTransition>
                                ))}
                            </TransitionGroup>

                            <button
                                onClick={() => {
                                    logoutUser();
                                }}
                                className={styles.button}
                            >
                                Logout
                            </button>
                        </div>
                    </section>
                </div>
            ) : (
                <Navigate to="/" />
            )}
        </>
    );
};

export { Admin };
