import { useState } from "react";
import { InputFilters } from "./InputFilters";
import { InputNote } from "./InputNote";
import styles from "./StylesInput.module.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import uniqid from "uniqid"
import styled from "styled-components"


const Input = () => {
    const [notes, setNotes] = useState([]);
    const [currentlyRendering, setCurrentlyRendering] = useState("All");
    const [notesLeft, setNotesLeft] = useState(0);

    const changeNoteValue = (value, noteIndex, setInputValue) => {
        setNotes(prevState => {
            prevState[noteIndex].text = value;
            return prevState;
        });

        setInputValue(value);
    };

    const deleteCompleted = () => {
        setNotes(() => {
            const sliceArr = notes.filter((note, index) => note.isActive && note);
            return sliceArr;
        });
    };

    const deleteCurrentNote = (isActive, noteIndex) => {
        setNotes(() => {
            const sliceArr = notes.filter((note, index) => index !== noteIndex && note);
            console.log(sliceArr);
            return sliceArr;
        });

        setNotesLeft(prevState => (isActive ? prevState - 1 : prevState));
    };

    const changeNoteActiveState = (isActive, noteIndex) => {
        setNotes(() => {
            const newStateArr = notes;
            newStateArr[noteIndex].isActive = !newStateArr[noteIndex].isActive;
            return newStateArr;
        });

        setNotesLeft(prevState => (isActive ? prevState - 1 : prevState + 1));
    };

    const changeAllNotesDone = () => {
        setNotes(() => {
            const sliceArr = notes.map((note, index) => ({
                text: note.text,
                isActive: notesLeft ? false : true,
            }));
            return sliceArr;
        });
        if (notesLeft) {
            setNotesLeft(0);
        } else {
            setNotesLeft(notes.length);
        }
    };

    let displayNotes = notes;

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
                            setNotes([
                                ...notes,
                                {
                                    text: e.target.value,
                                    isActive: true,
                                    id: uniqid(),
                                },
                            ]);

                            setNotesLeft(prevState => prevState + 1);
                            e.target.value = "";
                        }
                    }}
                    className={styles.input}
                    type="text"
                    placeholder="What needs to be done?"
                />
            </div>
            <StyledTransition>
                {displayNotes.map(({ text, isActive, id }, index) => {
                    if (currentlyRendering === "Active") {
                        return (
                            isActive && (
                                <CSSTransition key={id} timeout={500} classNames="item">
                                    <InputNote
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
                            <CSSTransition
                                key={id}
                                timeout={500}
                                classNames="item"
                            >
                                <InputNote
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
                <InputFilters
                    amountLeft={notesLeft}
                    whatIsRendered={currentlyRendering}
                    setCurrentlyRendering={setCurrentlyRendering}
                    deleteCompleted={deleteCompleted}
                />
            )}
        </>
    );
};

export { Input };

const StyledTransition = styled(TransitionGroup)`
    width: 100%
`
