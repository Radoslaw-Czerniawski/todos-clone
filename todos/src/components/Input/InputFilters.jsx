import { useState } from "react";
import styles from "./StylesInputFilter.module.scss";

const InputFilters = ({ whatIsRendered, setCurrentlyRendering, amountLeft, deleteCompleted }) => {
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
                            onClick={e =>
                                setCurrentlyRendering(() => {
                                    window.localStorage.setItem(
                                        "todosView",
                                        JSON.stringify(filter),
                                    );
                                    console.log(e.target.textContent);
                                    return e.target.textContent;
                                })
                            }
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
