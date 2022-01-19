import { useState } from "react";
import styles from "./StylesInputFilter.module.scss";

const InputFilters = ({
    whatIsRendered,
    setCurrentlyRendering,
    amountLeft,
    deleteCompleted,
    currentUser
}) => {
    const filters = ["All", "Active", "Completed"];

    return (
        <>
            <ul className={styles.filtersList}>
                <li className={styles.itemsLeft}>
                    {amountLeft} {amountLeft === 0 || amountLeft > 1 ? "Items" : "Item"} Left
                </li>
                <li className={styles.filterLinks}>
                    {filters.map(filter => (
                        <span
                            key={filter}
                            className={whatIsRendered === filter ? styles.active : styles.mode}
                            onClick={e => {
                                fetch(`/states/update`, {
                                    method: "PATCH",
                                    headers: {
                                        "Content-type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        length: amountLeft,
                                        currentlyRendering: e.target.textContent,
                                        login: currentUser
                                    }),
                                }).then(() => {
                                    setCurrentlyRendering(e.target.textContent);
                                });
                            }}
                        >
                            {filter}
                        </span>
                    ))}
                </li>
                <li onClick={deleteCompleted} className={styles.clearCompleted}>
                    Clear Completed
                </li>
            </ul>
        </>
    );
};

export { InputFilters };
