import { useState, useCallback, useEffect } from "react";
import { InputFilters } from "./InputFilters";
import { InputNote } from "./InputNote";
import styles from "./StylesInput.module.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import uniqid from "uniqid";
import styled from "styled-components";

const Input = () => {
    const [notes, setNotes] = useState([]);
    const [currentlyRendering, setCurrentlyRendering] = useState("All");
    const [notesLeft, setNotesLeft] = useState(0);

    useEffect(() => {
        fetchNotesAndAppState();
    }, []);

    const fetchNotesAndAppState = useCallback(() => {
        fetch(`http://localhost:3000/notes`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setNotes(data);
            });

        fetch(`http://localhost:3000/notesState`)
            .then(res => res.json())
            .then(data => {
                setCurrentlyRendering(data.currentlyRendering);
                setNotesLeft(data.length);
            });
    }, []);

    const changeNoteValue = (value, noteIndex, setInputValue, id) => {
        return Promise.resolve(
            fetch(`http://localhost:3000/notes/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    text: value,
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

    console.log(notes);

    const deleteCompleted = () => {
        const deletInOrder = async () => {
            console.log("notatki", notes);
            const elToDelet = await notes.filter(note => !note.isActive && note);

            console.log("to jest to", elToDelet);

            const wow = await elToDelet.forEach(arg => {
                fetch(`http://localhost:3000/notes/${arg.id}`, {
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
        fetch(`http://localhost:3000/notes/${id}`, {
            method: "DELETE",
        }).then(() => {
            setNotes(() => {
                const sliceArr = notes.filter((note, index) => index !== noteIndex && note);
                return sliceArr;
            });

            setNotesLeft(prevState => (isActive ? prevState - 1 : prevState));
        });
    };

    const changeNoteActiveState = (isActiveState, noteIndex, id) => {
        fetch(`http://localhost:3000/notes/${id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                isActive: !isActiveState,
            }),
        })
        .then(() => {
            fetch(`http://localhost:3000/notesState`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    length: isActiveState ? notesLeft - 1 : notesLeft + 1,
                }),
            })
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
        const deletInOrder = async () => {
            const doDelete = await notes.forEach(arg => {
                fetch(`http://localhost:3000/notes/${arg.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        isActive: false,
                    }),
                });
            });
        };

        deletInOrder()
        .then(() => {
            fetch(`http://localhost:3000/notesState`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    length: notesLeft ? 0 : notes.length,
                }),
            })
        })
        .then(() => {
            setNotes(() => {
                const sliceArr = notes.map((note, index) => ({
                    text: note.text,
                    isActive: notesLeft ? false : true,
                    id: note.id,
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
                                    id: uniqeId,
                                },
                            ];

                            fetch(`http://localhost:3000/notes`, {
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json",
                                },
                                body: JSON.stringify({
                                    text: e.target.value,
                                    isActive: true,
                                    id: uniqeId,
                                }),
                            }).then(() => {
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
                {notes.map(({ text, isActive, id }, index) => {
                    if (currentlyRendering === "Active") {
                        return (
                            isActive && (
                                <CSSTransition key={id} timeout={500} classNames="item">
                                    <InputNote
                                        id={id}
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
                                <CSSTransition key={id} timeout={500} classNames="item">
                                    <InputNote
                                        id={id}
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
                            <CSSTransition key={id} timeout={500} classNames="item">
                                <InputNote
                                    id={id}
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
                        amountLeft={notesLeft}
                        whatIsRendered={currentlyRendering}
                        setCurrentlyRendering={setCurrentlyRendering}
                        deleteCompleted={deleteCompleted}
                    />
                </CSSTransition>
            )}
        </>
    );
};

export { Input };

const StyledTransition = styled(TransitionGroup)`
    width: 100%;
`;
