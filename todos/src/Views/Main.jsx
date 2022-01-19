import styles from "../CSS/StylesApp.module.scss";
import { Header } from "../components/Header/Header";
import { Input } from "../components/Input/Input";

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
            <p>Recreated by Radosław Czerniawski</p>
        </div>
    </div> );
}

export { Main };
