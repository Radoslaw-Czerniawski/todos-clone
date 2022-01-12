import styles from "./StylesHeader.module.scss"

const Header = ({title}) => {
    return (
        <header>
            <h1 className={styles.mainH1}>{title}</h1>
        </header>
    );
}

export {Header};
