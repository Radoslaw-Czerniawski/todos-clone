import styles from "./StylesInputNote.module.scss";
import { useEffect, useRef, useState } from "react";

const InputNote = ({
    changeNoteActiveState,
    deleteNotes,
    noteIndex,
    notes,
    changeNoteValue,
    id,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(notes[noteIndex].text);
    const [needReload, setNeedReload] = useState(false);
    const content = notes[noteIndex];

    const editNote = () => {
        if (content.isActive) {
            setIsEditing(prevState => !prevState);
            setInputValue(content.text);
        }
    };

    useEffect(() => {
        setNeedReload(false);
    }, [needReload]);

    const targetOffset = content.isActive ? 1 : 0.2;
    const cross = useRef(null);
    const currentOpacity = useRef(content.isActive ? 1 : 0.2);

    useEffect(() => {
        let id;
        const updateIncrementallyCarouselPositionAfterAnimationStart = () => {
            const currentNoteSpan = cross.current;

            if (!content.isActive) {
                currentOpacity.current = Math.max((currentOpacity.current -= 0.1), targetOffset);
                currentNoteSpan.style.setProperty("text-decoration", "line-through");
            } else {
                currentOpacity.current = Math.min((currentOpacity.current += 0.1), targetOffset);
                currentNoteSpan.style.setProperty("text-decoration", "none");
            }

            currentNoteSpan.style.setProperty("--var-opacity", currentOpacity.current);

            id = requestAnimationFrame(updateIncrementallyCarouselPositionAfterAnimationStart);
            if (currentOpacity.current === targetOffset) {
                cancelAnimationFrame(id);
            } else if (!content.isActive && currentOpacity.current === 0.2) {
                return;
            }
        };

        updateIncrementallyCarouselPositionAfterAnimationStart();

        return () => {
            cancelAnimationFrame(id);
        };
    }, [content.isActive]);

    return (
        <>
            {!needReload && (
                <div className={styles.noteContainer}>
                    <input type="checkbox" className={styles.checkbox} />
                    <span
                        className={content.isActive ? styles.checkmark : styles.checkedCheckmark}
                        onClick={() => changeNoteActiveState(content.isActive, noteIndex, id)}
                    ></span>
                    {!needReload && (
                        <div onDoubleClick={editNote} className={styles.labelContainer}>
                            {isEditing ? (
                                <input
                                    onBlur={editNote}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") {
                                            changeNoteValue(inputValue, noteIndex, setInputValue, id)
                                            .then(() => {
                                                setIsEditing(false);
                                            })
                                        }
                                    }}
                                    autoFocus
                                    value={inputValue}
                                    className={styles.labelInput}
                                    ref={cross}
                                />
                            ) : (
                                <span className={styles.labelNote} ref={cross}>
                                    {content.text}
                                </span>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => deleteNotes(content.isActive, noteIndex, id)}
                        className={styles.removeNote}
                    />
                </div>
            )}
        </>
    );
};

export { InputNote };
