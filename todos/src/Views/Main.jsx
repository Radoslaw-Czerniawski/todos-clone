import styles from "../CSS/StylesApp.module.scss";
import { Header } from "../components/Header/Header";
import { Input } from "../components/Input/Input.tsx";
import logo from "../icons/gitLogo.svg"

const Main = ({user}) => {
    return ( <div className={styles.appWrapper}>
        <section className={styles.sectionContainer}>
            <Header title={"todos"} />
            <Input user={user}/>
        </section>
        <div className={styles.authorsSection}>
                <p>Double-click to edit a todo</p>
                <p>Created by Oscar Godson</p>
                <p>Refactored by Christoph Burgmer</p>
                <p style={{ color: "black", display: "flex", position: "relative" }}>
                    Recreated by Radosław Czerniawski{" "}
                    <a href="https://github.com/Radoslaw-Czerniawski" target="_blank">
                        <div className={styles.linkImg}>
                            <img className={styles.logoImg} src={logo} alt="GitHub Link" />
                        </div>
                    </a>
                </p>
            </div>
    </div> );
}

export { Main };
