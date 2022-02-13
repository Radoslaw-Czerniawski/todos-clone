import { useState } from "react";
import styles from "./StylesInputFilter.module.scss";

interface Props {
    whatIsRendered: string | null;
    setCurrentlyRendering: (param: string | null) => void;
    amountLeft: number;
    currentUser: string;
    deleteCompleted: () => void;
}

export const InputFilters = ({
    whatIsRendered,
    setCurrentlyRendering,
    amountLeft,
    deleteCompleted,
    currentUser,
}: Props) => {
    const filters: string[] = ["All", "Active", "Completed"];


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
                                        currentlyRendering: filter,
                                        login: currentUser,
                                    }),
                                }).then(() => {
                                    setCurrentlyRendering( filter);
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
