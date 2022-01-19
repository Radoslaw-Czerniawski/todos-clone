import { useState, useCallback, useEffect } from "react";
import { InputFilters } from "./InputFilters";
import { InputNote } from "./InputNote";
import styles from "./StylesInput.module.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import uniqid from "uniqid";
import styled from "styled-components";

const Input = ({ user }) => {
    const [notes, setNotes] = useState([]);
    const [currentlyRendering, setCurrentlyRendering] = useState("All");
    const [notesLeft, setNotesLeft] = useState(0);
    const [currentUser, setCurrentUser] = useState(user);

    console.log(user);

    useEffect(() => {
        fetchNotesAndAppState();
    }, []);

    const fetchNotesAndAppState = useCallback(() => {
        fetch(`/notes`)
            .then(res => res.json())
            .then(data => {
                setNotes(data);
            });

        fetch(`/states`)
            .then(res => res.json())
            .then(data => {
                console.log("aaa", currentUser);
                if (data.length === 0) {
                    fetch(`/states/add`, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            length: 0,
                            currentlyRendering: "All",
                            login: currentUser,
                        }),
                    }).then(() => {
                        setNotesLeft(0);
                    });
                } else {
                    console.log(data[0].login);
                    setCurrentlyRendering(data[0].currentlyRendering);
                    setNotesLeft(data[0].length);
                }
            });
    }, []);

    const changeNoteValue = (value, noteIndex, setInputValue, id) => {
        return Promise.resolve(
            fetch(`/notes/update/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    text: value,
                    isActive: notes[noteIndex].isActive,
                    login: currentUser,
                }),
            }),
        ).then(() => {
            setNotes(prevState => {
                prevState[noteIndex].text = value;
                return prevState;
            });
            setInputValue(value);
        });
    };

    const deleteCompleted = () => {
        const deletInOrder = async () => {
            const elToDelet = await notes.filter(note => !note.isActive && note);

            const wow = await elToDelet.forEach(arg => {
                fetch(`/notes/${arg._id}`, {
                    method: "DELETE",
                });
            });
        };

        deletInOrder().then(() => {
            setNotes(() => {
                const sliceArr = notes.filter((note, index) => note.isActive && note);
                return sliceArr;
            });
        });
    };

    const deleteCurrentNote = (isActive, noteIndex, id) => {
        fetch(`/notes/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                fetch(`/states/update`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        length: notesLeft - 1,
                        login: currentUser,
                    }),
                });
            })
            .then(() => {
                setNotes(() => {
                    const sliceArr = notes.filter((note, index) => index !== noteIndex && note);
                    return sliceArr;
                });

                setNotesLeft(prevState => (isActive ? prevState - 1 : prevState));
            });
    };

    const changeNoteActiveState = (isActiveState, noteIndex, id) => {
        fetch(`/notes/update/${id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                text: notes[noteIndex].text,
                isActive: !isActiveState,
                login: currentUser,
            }),
        })
            .then(() => {
                fetch(`/states/update`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        length: isActiveState ? notesLeft - 1 : notesLeft + 1,
                        login: currentUser,
                    }),
                });
            })
            .then(() => {
                setNotes(() => {
                    const newStateArr = notes;
                    newStateArr[noteIndex].isActive = !newStateArr[noteIndex].isActive;
                    return newStateArr;
                });

                setNotesLeft(prevState => (isActiveState ? prevState - 1 : prevState + 1));
            });
    };

    const changeAllNotesDone = () => {
        const deleteInOrder = async () => {
            const wow = await notes.forEach(note => {
                fetch(`/notes/update/${note._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        _id: note._id,
                        text: note.text,
                        isActive: notesLeft ? false : true,
                        login: currentUser,
                    }),
                });
            });
        };

        deleteInOrder()
            .then(() => {
                fetch(`/states/update`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        length: notesLeft ? 0 : notes.length,
                        currentlyRendering: currentlyRendering,
                        login: currentUser,
                    }),
                });
            })
            .then(() => {
                setNotes(() => {
                    const sliceArr = notes.map((note, index) => ({
                        text: note.text,
                        isActive: notesLeft ? false : true,
                        _id: note._id,
                    }));

                    return sliceArr;
                });
                if (notesLeft) {
                    setNotesLeft(0);
                } else {
                    setNotesLeft(notes.length);
                }
            });
    };

    const logoutUser = () => {
        window.localStorage.setItem("isLogged", JSON.stringify(false));
        window.localStorage.setItem("user", "");
        fetch("/users/logout")
            .then(res => res.json())
            .then(data => console.log(data))
            .then(() => window.location.reload());
    };

    return (
        <>
            <div className={styles.inputWrapper}>
                {notes.length > 0 && (
                    <span
                        onClick={changeAllNotesDone}
                        className={notesLeft ? styles.markAllDone : styles.markedAllDone}
                    ></span>
                )}
                <input
                    onKeyDown={e => {
                        if (e.key === "Enter" && e.target.value !== "") {
                            const uniqeId = uniqid();

                            const stateArr = [
                                ...notes,
                                {
                                    text: e.target.value,
                                    isActive: true,
                                    _id: uniqeId,
                                    login: currentUser,
                                },
                            ];

                            fetch(`/notes/add`, {
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json",
                                },
                                body: JSON.stringify({
                                    text: e.target.value,
                                    isActive: true,
                                    _id: uniqeId,
                                    login: currentUser,
                                }),
                            })
                                .then(() => {
                                    fetch(`/states/update`, {
                                        method: "PATCH",
                                        headers: {
                                            "Content-type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            length: notesLeft + 1,
                                            currentlyRendering: currentlyRendering,
                                            login: currentUser,
                                        }),
                                    });
                                })
                                .then(() => {
                                    setNotes(stateArr);
                                    setNotesLeft(prevState => prevState + 1);
                                    e.target.value = "";
                                });
                        }
                    }}
                    className={styles.input}
                    type="text"
                    placeholder="What needs to be done?"
                />
            </div>
            <StyledTransition>
                {notes.map(({ text, isActive, _id }, index) => {
                    if (currentlyRendering === "Active") {
                        return (
                            isActive && (
                                <CSSTransition key={_id} timeout={500} classNames="item">
                                    <InputNote
                                        id={_id}
                                        changeNoteActiveState={changeNoteActiveState}
                                        deleteNotes={deleteCurrentNote}
                                        notes={notes}
                                        noteIndex={index}
                                        changeNoteValue={changeNoteValue}
                                    />
                                </CSSTransition>
                            )
                        );
                    } else if (currentlyRendering === "Completed") {
                        return (
                            !isActive && (
                                <CSSTransition key={_id} timeout={500} classNames="item">
                                    <InputNote
                                        id={_id}
                                        changeNoteActiveState={changeNoteActiveState}
                                        deleteNotes={deleteCurrentNote}
                                        notes={notes}
                                        noteIndex={index}
                                        changeNoteValue={changeNoteValue}
                                    />
                                </CSSTransition>
                            )
                        );
                    } else {
                        return (
                            <CSSTransition key={_id} timeout={500} classNames="item">
                                <InputNote
                                    id={_id}
                                    changeNoteActiveState={changeNoteActiveState}
                                    deleteNotes={deleteCurrentNote}
                                    notes={notes}
                                    noteIndex={index}
                                    changeNoteValue={changeNoteValue}
                                />
                            </CSSTransition>
                        );
                    }
                })}
            </StyledTransition>
            {notes.length > 0 && (
                <CSSTransition timeout={500} classNames="item">
                    <InputFilters
                        currentUser={currentUser}
                        amountLeft={notesLeft}
                        whatIsRendered={currentlyRendering}
                        setCurrentlyRendering={setCurrentlyRendering}
                        deleteCompleted={deleteCompleted}
                    />
                </CSSTransition>
            )}
            <button
                onClick={() => {
                    logoutUser();
                }}
                className={styles.button}
            >
                Logout
            </button>
        </>
    );
};

export { Input };

const StyledTransition = styled(TransitionGroup)`
    width: 100%;
`;
