import { useState, useCallback, useEffect } from "react";
import { InputFilters } from "./InputFilters";
import { InputNote } from "./InputNote";
import styles from "./StylesInput.module.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import uniqid from "uniqid";
import styled from "styled-components";
import {
    MongoDBAddSTates,
    MongoDBDeleteNote,
    MongoDBDecrementStateLength,
    MongoDBDeleteNotesInOrder,
    MongoDBFetchStates,
    MongoDBGetNotes,
    MongoDBMarkAllNotesDone,
    MongoDBPatchStatesLength,
    MongoDBUpdateActiveState,
    MongoDBUpdateNoteValue,
    MongoDBLogoutUser,
} from "../../utilities/MongoDBContact";

export interface Note {
    text: string;
    isActive: boolean;
    _id: string;
    login: string;
}

interface NoteData extends Note {
    __v: number;
}

interface Props {
    user: string;
}

interface StateData {
    _id: string;
    __v: number;
    length: number;
    login: string;
    currentlyRendering: string;
}

export const Input = ({ user }: Props) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentlyRendering, setCurrentlyRendering] = useState<string | null>("All");
    const [notesLeft, setNotesLeft] = useState<number>(0);
    const [currentUser, setCurrentUser] = useState<string>(user);

    console.log(user);

    useEffect((): void => {
        fetchNotesAndAppState();
    }, []);

    const fetchNotesAndAppState = useCallback((): void => {
        MongoDBGetNotes().then((data: NoteData[]) => {
            setNotes(data);
        });

        MongoDBFetchStates().then((data: StateData[]) => {
            if (data.length === 0) {
                MongoDBAddSTates(currentUser).then(() => {
                    setNotesLeft(0);
                });
            } else {
                console.log(data[0].login);
                setCurrentlyRendering(data[0].currentlyRendering);
                setNotesLeft(data[0].length);
            }
        });
    }, []);

    const changeNoteValue = (
        value: string,
        noteIndex: number,
        setInputValue: (param: string) => void,
        id: string,
    ): Promise<void> => {
        return MongoDBUpdateNoteValue(id, value, notes, noteIndex, currentUser).then(() => {
            setNotes(prevState => {
                prevState[noteIndex].text = value;
                return prevState;
            });
            setInputValue(value);
        });
    };

    const deleteCompleted = (): void => {
        MongoDBDeleteNotesInOrder(notes).then(() => {
            setNotes(() => {
                const sliceArr: Note[] = notes.filter(note => note.isActive && note);
                return sliceArr;
            });
        });
    };

    const deleteCurrentNote = (isActive: boolean, noteIndex: number, id: string): void => {
        MongoDBDeleteNote(id)
            .then(() => {
                MongoDBDecrementStateLength(notesLeft, currentUser);
            })
            .then(() => {
                setNotes(() => {
                    const sliceArr: Note[] = notes.filter(
                        (note, index) => index !== noteIndex && note,
                    );
                    return sliceArr;
                });

                setNotesLeft(prevState => (isActive ? prevState - 1 : prevState));
            });
    };

    const changeNoteActiveState = (isActiveState: boolean, noteIndex: number, id: string) => {
        MongoDBUpdateActiveState(id, notes, isActiveState, noteIndex, currentUser)
            .then(() => {
                MongoDBPatchStatesLength(isActiveState, currentUser, notesLeft, currentlyRendering);
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
        MongoDBMarkAllNotesDone(notes, currentUser, notesLeft, currentlyRendering).then(() => {
            setNotes(() => {
                const sliceArr: Note[] = notes.map((note, index) => ({
                    text: note.text,
                    isActive: notesLeft ? false : true,
                    _id: note._id,
                    login: note.login,
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
        window.localStorage.setItem("isAdmin", JSON.stringify(false));

        MongoDBLogoutUser();
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
                    maxLength={32}
                    onKeyDown={e => {
                        if (e.key === "Enter" && e.currentTarget.value !== "") {
                            const uniqeId = uniqid();

                            const stateArr: Note[] = [
                                ...notes,
                                {
                                    text: e.currentTarget.value,
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
                                    text: e.currentTarget.value,
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
                                    e.currentTarget.value = "";
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

const StyledTransition = styled(TransitionGroup)`
    width: 100%;
`;
